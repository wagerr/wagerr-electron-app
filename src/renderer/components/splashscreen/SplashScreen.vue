<template>
  <div class="splash">
    <div class="row text-center">
      <div class="col s12 splash-image"></div>

      <div class="col s12 version">Wagerr Electron App {{ walletVersion }}</div>

      <div class="col s12">
        <transition name="slide-fade" mode="out-in">
          <div v-if="!wagerrCorruptDatabase" :key="initText">
            <h5>{{ initText }}</h5>
          </div>
          <div v-else :key="'Corrupt database'">
            <h5>
              ⚠️ Error loading block database. This can occur when upgrading, please resync below.️
            </h5>
          </div>
        </transition>
      </div>

      <div v-if="!wagerrCorruptDatabase" class="col s12 splash-loading-container">
        <div class="slider">
          <div class="line"></div>
          <div class="break dot1"></div>
          <div class="break dot2"></div>
          <div class="break dot3"></div>
        </div>
      </div>

      <download-snapshot
        v-if="mayDownloadSnapshot && getNetworkType !== 'Testnet'"
        :sync-method="syncMethod"
        :time-behind-text="timeBehindText"
        v-on:update-sync-method="updateSyncMethod"
      />

      <div class="splash-wallet-repair text-center">
        <div v-if="!wagerrCorruptDatabase">
          <a href="#" @click="restartWallet">Restart Wallet</a>
        </div>

        <div v-if="!wagerrCorruptDatabase">
          <a href="#" @click="rescanBlockchain">Rescan Blockchain Files</a>
        </div>

        <div v-if="!wagerrCorruptDatabase">
          <a href="#" @click="reindexBlockchain">Reindex Blockchain</a>
        </div>

        <div>
          <a href="#" @click="resyncBlockchain">Resync Blockchain</a>
        </div>

        <div v-if="!wagerrCorruptDatabase">
          <a href="#" @click="onOpenConf">Wagerr.Conf</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, shell } from 'electron';
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import blockchainRPC from '../../services/api/blockchain_rpc';
import networkRPC from '../../services/api/network_rpc';
import ipcRendererHandler from '../../../common/ipc/ipcRenderer';
import { getWagerrConfPath } from '../../../main/wagerrd/blockchain';
import DownloadSnapshot from './DownloadSnapshot.vue';
import { syncMethods } from '../../../main/constants/constants';

export default {
  name: 'SplashScreen',
  components: { DownloadSnapshot },

  data() {
    return {
      confPath: getWagerrConfPath(),
      syncMethod: syncMethods.SCAN_BLOCKS,
      timeBehindText: '',
      mayDownloadSnapshot: false,
      wagerrCorruptDatabase: false
    };
  },

  computed: {
    ...mapGetters([
      'getNetworkType',
      'initText',
      'walletVersion'
    ])
  },

  methods: {
    ...mapActions([
      'updateInitText',
      'updateNetworkType',
      'updateWalletLoaded',
      'walletExtendedBalance',
      'getCGBetTransactionList',
      'loadUserSettings',
      'walletInfo'
    ]),

    rescanBlockchain: function() {
      ipcRendererHandler.rescanBlockchain();
    },

    reindexBlockchain: function() {
      ipcRendererHandler.reindexBlockchain();
    },

    resyncBlockchain: function() {
      ipcRendererHandler.resyncBlockchain();
    },

    restartWallet: function() {
      ipcRendererHandler.restartWallet();
    },

    closeWallet: function() {
      ipcRendererHandler.closeWallet();
    },

    updateSyncMethod: function(syncMethod) {
      this.syncMethod = syncMethod;
    },

    getTimeBehindText: function(durationBehind) {
      let timeBehindText;

      if (durationBehind.asDays() < 2) {
        timeBehindText = `${Math.ceil(durationBehind.asHours())} hours behind`;
      } else if (durationBehind.asWeeks() < 2) {
        timeBehindText = `${Math.ceil(durationBehind.asDays())} days behind`;
      } else if (durationBehind.asYears() < 1) {
        timeBehindText = `${Math.ceil(durationBehind.asWeeks())}  weeks behind`;
      } else {
        const weeksBehind = Math.ceil(
          durationBehind.asWeeks() -
            moment.duration(durationBehind.years(), 'years').asWeeks()
        );
        timeBehindText = `${durationBehind.years()} year and ${weeksBehind} weeks behind`;
      }

      return timeBehindText;
    },

    sleep: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Check for peers.
    checkPeerStatus: async function() {
      let count = 0;
      let connections = 0;
      let peersFound = false;

      this.updateInitText('Connecting to peers... this may take some time!');
      ipcRendererHandler.log('info', 'Waiting for daemon to find peers');

      // While no peers have connected to the daemon keep looping.
      while (!peersFound) {
        let peerInfo = await networkRPC.getPeerInfo();
        connections = peerInfo.length;

        // If we have successfully connected to peers break out of the loop.
        if (connections > 0) {
          peersFound = true;
          break;
        }

        count++;

        // Give the daemon an arbitrary 101 loops to find peers. If not show an error to the user.
        if (count === 100) {
          ipcRendererHandler.log(
            'warn',
            'No peers could be found, please review your Wagerr Core logs'
          );
          ipcRendererHandler.noPeers();
          return 1;
        }

        // Sleep for 15 seconds between loops to lessen the burden on contiously making calls to the daemon and updating the UI.
        await this.sleep(15000);
      }

      // Once peers have been found resolve the Promise.
      if (peersFound) {
        ipcRendererHandler.log('info', 'Connected to network');
        return 1;
      }
    },

    // Check for daemon initialized
    checkDaemonInitialized: async function() {
      this.updateInitText('Initializing daemon... this may take some time!');
      ipcRendererHandler.log('info', 'Waiting for daemon to initialize');

      // wait 50 seconds + 10 previous seconds => 1 minute so daemon can initialize
      await this.sleep(50000);

      // While no peers have connected to the daemon keep looping.
      while (true) {
        let netInfo = (await networkRPC.getInfo()).result;

        // If we have successfully connected to peers break out of the loop.
        if (netInfo.blocks !== -1) {
          ipcRendererHandler.log('info', 'Daemon initialized');
          break;
        }

        // Sleep for 20 second between loops to lessen the burden on contiously making calls to the daemon and updating the UI.
        await this.sleep(20000);
      }
    },

    // Show the blockchain sync status information.
    syncBlockchainStatus: async function() {
      let blockchainInfo, durationBehind, synced = false;
      ipcRendererHandler.log('info', 'Syncing blockchain');

      while (!synced) {
        if (this.syncMethod === syncMethods.SCAN_BLOCKS) {
          blockchainInfo = await blockchainRPC.getBlockchainInfo();
          durationBehind = await blockchainRPC.getBlockDurationBehind(blockchainInfo.bestblockhash);

          // If less than half an hour behind
          if (Math.round(durationBehind.asHours()) === 0) {
            // Wallet is synced enough to allow user access.
            this.loadWallet();

          } else {
            this.timeBehindText = this.getTimeBehindText(durationBehind);

            this.updateInitText(this.timeBehindText + ', Scanning block ' + blockchainInfo.blocks);

            // TODO: Re-enable after v4 testing.
            // let weeksBehind = Math.ceil(durationBehind.asWeeks());
            // this.mayDownloadSnapshot = weeksBehind > blockchainSnapshot.TRESHOLD_IN_WEEKS;
          }
        }

        // If verification progress is 1 or above it means the daemon is synced.
        if (blockchainInfo.verificationprogress >= 1) {
          synced = true;
          break;
        }

        // Sleep for 1 second between loops to lessen the burden on contiously
        // making calls to the daemon and updating the UI.
        await this.sleep(1000);
      }

      // Once peers have been found resolve the Promise.
      if (synced) {
        ipcRendererHandler.log('info', 'Blockchain is now synced with network');
        return 1;
      }
    },

    onOpenConf: function() {
      ipcRendererHandler.log('debug', 'Opening wagerr.conf file');
      shell.openItem(this.confPath);
    },

    async loadWallet() {
      // After connecting to peers get some blockchain info.
      this.updateInitText('Fetching wallet information...');
      await this.walletInfo();
      await this.getCGBetTransactionList(25);
      await this.walletExtendedBalance();

      this.updateWalletLoaded(true);
    }
  },

  async mounted() {
    ipcRenderer.on('wagerr-corrupt-database', () => {
      this.wagerrCorruptDatabase = true;
    });

    if (!this.wagerrCorruptDatabase) {
      // On some computers (especially Windows) the daemon is taking a while to
      // launch. If we start hitting it with RPC calls too early the app might
      // fail to launch in some instances. Dirty workaround to allow 10 seconds
      // before moving to the RPC calls.
      await this.sleep(10000);

      // Wait for the daemon to be initialized
      await this.checkDaemonInitialized();

      // Check if connected to the Wagerr network and if we have peers.
      await this.checkPeerStatus();

      // Set the network.
      let blockchainInfo = await blockchainRPC.getBlockchainInfo();
      let network = blockchainInfo.chain === 'test' ? 'Testnet' : 'Mainnet';
      // load User Config - could use methods access, instead of store.dispatch
      await this.loadUserSettings(network);
      await this.updateNetworkType(network);

      // If Wallet not synced show time behind text.
      await this.syncBlockchainStatus();
    }
  }
};
</script>
