<template>
  <header class="z-depth-2">
    <div class="wagerr-logo"></div>

    <ul class="top-nav">
      <router-link tag="li" to="/" exact>
        <i class="navico-wallet"></i>
        <h6>Wallet Home</h6>
      </router-link>

      <router-link tag="li" to="/bet_history">
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
          <li v-if="walletUnlocked && walletEncrypted">
            <a @click="lockWallet">
              <i class="icon-lock"></i>
              Lock Wallet
            </a>
          </li>

          <li v-else-if="walletEncrypted">
            <a class="modal-trigger" data-target="unlock-wallet-modal">
              <i class="icon-unlock"></i>
              Unlock Wallet
            </a>
          </li>

          <li v-if="!walletEncrypted">
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

          <li>
            <a @click="updadteConsoleVisible">
              <i class="icon-cli"></i>
              RPC CLI Tool
            </a>
          </li>

          <router-link tag="li" to="/preferences" exact>
            <a>
              <i class="icon-cog"></i>
              Preferences
            </a>
          </router-link>
        </ul>
      </li>

      <!-- Settings Modals -->
      <encrypt-wallet></encrypt-wallet>
      <change-password></change-password>
      <unlock-wallet></unlock-wallet>
    </ul>

    <div class="pull-right wagerr-balance">
      <span id="wagerr-total-balance">
        {{ walletLoaded ? Math.trunc(balance * 10000) / 10000 : 'Loading...' }}
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
import EncryptWallet from '@/components/modals/EncryptWallet.vue';
import ChangePassword from '@/components/modals/ChangePassword.vue';
import UnlockWallet from '@/components/modals/UnlockWallet';

export default {
  name: 'TopNavBar',
  components: {
    EncryptWallet,
    ChangePassword,
    UnlockWallet
  },

  computed: {
    ...Vuex.mapGetters([
      'balance',
      'walletLoaded',
      'walletUnlocked',
      'walletEncrypted',
      'getNetworkType'
    ])
  },

  methods: {
    ...Vuex.mapActions(['lockWallet', 'updadteConsoleVisible', 'walletInfo'])
  },

  mounted() {
    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit();

    this.walletInfo();

    this.timeout = setInterval(
      function() {
        this.walletInfo();
      }.bind(this),
      3000
    );
  }
};
</script>

<style scoped lang="scss">
@import '../assets/scss/_variables';

.dropdown-content {
  background-color: $dark_grey;
}

.dropdown-content li a {
  color: white;
}

.dropdown-content li a i {
  color: $wagerr_red;
  font-size: 1.3em;
}

.dropdown-content li:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
