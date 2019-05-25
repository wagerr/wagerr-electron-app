<template>
  <div class="splash">
    <div class="row text-center">
      <div class="col s12 splash-image"></div>

      <div class="col s12 version">Wagerr Electron App {{ walletVersion }}</div>

      <div class="col s12">
        <transition name="slide-fade" mode="out-in">
          <div :key="initText">
            <h5>{{ initText }}</h5>
          </div>
        </transition>
      </div>

      <div class="col s12 splash-loading-container">
        <div class="slider">
          <div class="line"></div>
          <div class="break dot1"></div>
          <div class="break dot2"></div>
          <div class="break dot3"></div>
        </div>
      </div>

      <div class="splash-wallet-repair text-center">
        <div>
          <a href="#" @click="restartWallet">Restart Wallet</a>
        </div>

        <div>
          <a href="#" @click="rescanBlockchain">Rescan Blockchain Files</a>
        </div>

        <div>
          <a href="#" @click="reindexBlockchain">Reindex Blockchain</a>
        </div>

        <div>
          <a href="#" @click="resyncBlockchain">Resync Blockchain</a>
        </div>

        <div>
          <a href="#" @click="onOpenConf">Wagerr.Conf</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import moment from 'moment';
import blockchainRPC from '@/services/api/blockchain_rpc';
import networkRPC from '@/services/api/network_rpc';
import { getWagerrConfPath } from '../../../main/blockchain/blockchain';
import ipcRender from '../../../common/ipc/ipcRender';
import { shell } from 'electron';

let path = require('path');

export default {
  name: 'SplashScreen',

  computed: {
    ...Vuex.mapGetters([
      'balance',
      'initText',
      'walletLoaded',
      'walletSynced',
      'walletUnlocked',
      'walletVersion'
    ])
  },

  methods: {
    ...Vuex.mapActions([
      'syncWallet',
      'updateInfo',
      'updateBlocks',
      'walletBalance',
      'updateInitText',
      'updateNetworkType',
      'updateWalletLoaded',
      'updateWalletSynced',
      'updateNumMasternodes',
      'updateNumConnections',
      'walletExtendedBalance',
      'getWGRTransactionList',
      'getPLBetTransactionList',
      'getCGBetTransactionList',
      'getWGRTransactionRecords'
    ]),

    rescanBlockchain: function() {
      ipcRender.rescanBlockchain();
    },

    reindexBlockchain: function() {
      ipcRender.reindexBlockchain();
    },

    resyncBlockchain: function() {
      ipcRender.resyncBlockchain();
    },

    restartWallet: function() {
      ipcRender.restartWallet();
    },

    closeWallet: function() {
      ipcRender.closeWallet();
    },

    getTimeBehindText: function(secs, blockchainInfo) {
      const HOUR_IN_SECONDS = 60 * 60;
      const DAY_IN_SECONDS = 24 * 60 * 60;
      const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      const YEAR_IN_SECONDS = 31556952; // Average length of year in Gregorian calendar.

      let timeBehindText;
      let years;
      let remainder;

      if (Math.round(secs / HOUR_IN_SECONDS) === 0) {
        // Wallet is synced enough to all user access.
        this.updateWalletLoaded(true);
      } else if (secs < 2 * DAY_IN_SECONDS) {
        timeBehindText =
          Math.round(secs / HOUR_IN_SECONDS) +
          ' hours behind, Scanning block ' +
          blockchainInfo.blocks;
      } else if (secs < 2 * WEEK_IN_SECONDS) {
        timeBehindText =
          Math.round(secs / DAY_IN_SECONDS) +
          ' days behind, Scanning block ' +
          blockchainInfo.blocks;
      } else if (secs < YEAR_IN_SECONDS) {
        timeBehindText =
          Math.round(secs / WEEK_IN_SECONDS) +
          ' weeks behind, Scanning block ' +
          blockchainInfo.blocks;
      } else {
        years = secs / YEAR_IN_SECONDS;
        remainder = secs % YEAR_IN_SECONDS;

        timeBehindText =
          Math.round(years) +
          ' year and ' +
          Math.round(remainder / WEEK_IN_SECONDS) +
          ' weeks behind, Scanning block ' +
          blockchainInfo.blocks;
      }

      return timeBehindText;
    },

    // Check for peers to ensure we are connected to the network.
    checkPeerStatus: function() {
      return new Promise(function(resolve, reject) {
        let count = 0;
        let peers = 0;

        let intervalId = setInterval(async function() {
          peers = await networkRPC.getPeerInfo();
          //console.log('peer count: ' + peers.length);

          // If we have successfully connected to peers return
          if (peers.length > 0) {
            clearInterval(intervalId);
            resolve(true);
          }

          // If we have no peers show a warning message to the user.
          if (count === 15) {
            ipcRender.noPeers();
            clearInterval(intervalId);
            resolve(true);
          }

          count++;
        }, 2000);
      });
    },

    // Show the blockchain sync status information.
    syncBlockchainStatus: function() {
      return new Promise(
        function(resolve, reject) {
          let secs = 1;
          let block;

          // Check the status of the blockchain to see if we need to sync to the tip.
          let intervalId = setInterval(
            async function() {
              let blockchainInfo = await blockchainRPC.getBlockchainInfo();
              let bestBlockHash = blockchainInfo.bestblockhash;

              block = await blockchainRPC.getBlockInfo(bestBlockHash);
              secs = moment().diff(block.time * 1000, 'seconds');

              let timeBehindText = this.getTimeBehindText(secs, blockchainInfo);
              this.updateInitText(timeBehindText);

              // if the blockchain has been fully synced.
              if (secs < 0) {
                // Set the network type.
                clearInterval(intervalId);
                resolve(true);
              }
            }.bind(this),
            500
          );
        }.bind(this)
      );
    },
    onOpenConf: function() {
      console.log(this.confPath);
      //ipcRender.openConf(s);
      shell.openItem(this.confPath);
    }
  },
  data() {
    return {
      confPath: getWagerrConfPath()
    };
  },

  async created() {
    // Check if connected to the Wagerr network and if we have peers.
    this.updateInitText('Connecting to peers...');
    await this.checkPeerStatus();

    // After connecting to peers get some blockchain info.
    this.updateInitText('Getting blockchain information...');
    await this.walletExtendedBalance();
    await this.getWGRTransactionRecords(100);
    await this.getPLBetTransactionList(50);
    await this.getCGBetTransactionList(25);

    // Set the network.
    let blockchainInfo = await blockchainRPC.getBlockchainInfo();
    let network = blockchainInfo.chain === 'test' ? 'Testnet' : 'Mainnet';
    await this.updateNetworkType(network);

    // If Wallet not synced show time behind text.
    await this.syncBlockchainStatus();
  }
};
</script>
