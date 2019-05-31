<!-- Main Wagerr Wallet Nav Bar -->
<template>
  <header class="z-depth-2">
    <div class="wagerr-logo"></div>

    <ul class="top-nav">
      <router-link tag="li" to="/" exact>
        <i class="navico-wallet"></i>
        <h6>Wallet Home</h6>
      </router-link>

      <router-link tag="li" to="/bets">
        <i class="navico-history"></i>
        <h6>Bet History</h6>
      </router-link>

      <router-link tag="li" to="/betting">
        <i class="navico-betting"></i>
        <h6>Betting</h6>
      </router-link>

      <router-link tag="li" to="/chain_games">
        <i class="navico-dice"></i>
        <h6>Chain Games</h6>
      </router-link>

      <router-link tag="li" to="/tools/info">
        <i class="navico-wrench"></i>
        <h6>Tools &amp; Info</h6>
      </router-link>

      <li>
        <!-- Dropdown Trigger -->
        <div class="dropdown-trigger" data-target="settings-dropdown">
          <i class="navico-gear"></i>
          <h6>Settings</h6>
        </div>

        <!-- Dropdown Structure -->
        <ul id="settings-dropdown" class="dropdown-content">
          <li v-if="walletUnlocked">
            <a @click="lockWallet">
              <i class="icon-lock"></i>
              Lock Wallet
            </a>
          </li>

          <li v-else>
            <a class="modal-trigger" data-target="unlock-wallet-modal">
              <i class="icon-unlock"></i>
              Unlock Wallet
            </a>
          </li>

          <li>
            <a class="modal-trigger" data-target="encrypt-wallet">
              <i class="icon-file-lock"></i>
              Encrypt Wallet
            </a>
          </li>

          <li>
            <a class="modal-trigger" data-target="change-wallet-password">
              <i class="icon-user-lock"></i>
              Change Password
            </a>
          </li>

          <!--<li>

                        <a class="modal-trigger" data-target="">

                            <i class="icon-network-lock"></i>

                            Bip32 Tool

                        </a>

                    </li>

                    <li>

                        <a class="modal-trigger" data-target="">

                            <i class="icon-paper-plane"></i>

                            Multi Send

                        </a>

          </li>-->

          <li>
            <a class="modal-trigger" data-target="sign-verify-message">
              <i class="icon-pencil"></i>
              Sign Message
            </a>
          </li>

          <li>
            <a class="modal-trigger" data-target="sign-verify-message">
              <i class="icon-check"></i>
              Verify Message
            </a>
          </li>

          <li>
            <a @click="backupWallet">
              <i class="icon-files"></i>
              Backup Wallet
            </a>
          </li>

          <li>
            <a @click="updadteConsoleVisible">
              <i class="icon-cli"></i>
              RPC CLI Tool
            </a>
          </li>
        </ul>
      </li>

      <!-- Settings Modals -->
      <encrypt-wallet></encrypt-wallet>
      <change-password></change-password>
      <sign-verify-message></sign-verify-message>
      <unlock-wallet></unlock-wallet>
    </ul>

    <div class="pull-right wagerr-balance">
      <span id="wagerr-total-balance">
        {{ walletLoaded ? (Math.trunc(balance * 10000) / 10000) : 'Loading...' }}
        <span class="currency">{{
          getNetworkType === 'Testnet' ? 'tWGR' : 'WGR'
        }}</span>
        <h6>Currently Available</h6>
      </span>
    </div>
  </header>
</template>

<script>
import Vuex from 'vuex';
import wagerrRPC from '@/services/api/wagerrRPC';
import EncryptWallet from '@/components/modals/EncryptWallet.vue';
import ChangePassword from '@/components/modals/ChangePassword.vue';
import UnlockWallet from '@/components/modals/UnlockWallet';
import SignVerifyMessage from '@/components/modals/SignVerifyMessage';

const { remote } = require('electron');

export default {
  name: 'TopNavBar',
  components: {
    EncryptWallet,
    ChangePassword,
    SignVerifyMessage,
    UnlockWallet
  },

  computed: {
    ...Vuex.mapGetters([
      'balance',
      'walletLoaded',
      'walletUnlocked',
      'getNetworkType'
    ])
  },

  methods: {
    ...Vuex.mapActions(['lockWallet', 'updadteConsoleVisible']),

    backupWallet: function() {
      let folderPath = remote.dialog.showOpenDialog({
        title: 'Backup Wallet.dat file.',
        buttonLabel: 'Select Folder',
        properties: ['openDirectory'],
        buttons: ['Confirm', 'Cancel'],
        cancelId: 1,
        defaultId: 0
      });

      console.log();

      if (folderPath) {
        wagerrRPC.client
          .backupWallet(folderPath)
          .then(function(resp) {
            console.log(resp);
            M.toast({
              html:
                '<span class="toast__bold-font">Success &nbsp;</span> Wallet backup up located here: ' +
                folderPath,
              classes: 'green'
            });
          })
          .catch(function(err) {
            M.toast({ html: err, classes: 'wagerr-red-bg' });
            console.log(err);
          });
      }
    }
  },

  mounted() {
    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit();
  }
};
</script>
