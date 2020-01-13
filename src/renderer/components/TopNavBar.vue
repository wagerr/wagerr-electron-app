<template>
  <header class="z-depth-2">
    <div class="wagerr-logo"></div>

    <ul class="top-nav">
      <router-link tag="li" to="/" exact>
        <i class="navico-wallet"></i>
        <h6>{{ $t('Wallet Home') }}</h6>
      </router-link>

      <router-link tag="li" to="/bet_history">
        <i class="navico-history"></i>
        <h6>{{ $t('Bet History') }}</h6>
      </router-link>

      <router-link tag="li" to="/betting">
        <i class="navico-betting"></i>
        <h6>{{ $t('Betting') }}</h6>
      </router-link>

      <router-link tag="li" to="/chain_games">
        <i class="navico-dice"></i>
        <h6>{{ $t('Chain Games') }}</h6>
      </router-link>

      <router-link tag="li" to="/masternodes">
        <i class="navico-wrench"></i>
        <h6>{{ $t('Masternodes') }}</h6>
      </router-link>

      <router-link tag="li" to="/tools/info">
        <i class="navico-wrench"></i>
        <h6 v-html="$t('Tools &amp; Info')"></h6>
      </router-link>

      <li>
        <!-- Dropdown Trigger -->
        <div class="dropdown-trigger" data-target="settings-dropdown">
          <i class="navico-gear"></i>
          <h6>{{ $t('Settings') }}</h6>
        </div>

        <!-- Dropdown Structure -->
        <ul id="settings-dropdown" class="dropdown-content">
          <li v-if="walletUnlocked && walletEncrypted">
            <a @click="lockWallet">
              <i class="icon-lock"></i>
              {{ $t('Lock Wallet') }}
            </a>
          </li>

          <li v-else-if="walletEncrypted">
            <a class="modal-trigger" data-target="unlock-wallet-modal">
              <i class="icon-unlock"></i>
              {{ $t('Unlock Wallet') }}
            </a>
          </li>

          <li v-if="!walletEncrypted">
            <a class="modal-trigger" data-target="encrypt-wallet">
              <i class="icon-file-lock"></i>
              {{ $t('Encrypt Wallet') }}
            </a>
          </li>

          <li>
            <a class="modal-trigger" data-target="change-wallet-password">
              <i class="icon-user-lock"></i>
              {{ $t('Change Password') }}
            </a>
          </li>

          <li>
            <a @click="updadteConsoleVisible">
              <i class="icon-cli"></i>
              {{ $t('RPC CLI Tool') }}
            </a>
          </li>

          <router-link tag="li" to="/preferences" exact>
            <a>
              <i class="icon-cog"></i>
              {{ $t('Preferences') }}
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
        {{ walletLoaded ? $n(balance, 'decimal', getFormatLocale) : $t('Loading...') }}
        <span class="currency">{{
          getNetworkType === 'Testnet' ? 'tWGR' : 'WGR'
        }}</span>
        <h6>{{ $t('Currently Available') }}</h6>
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
      'getNetworkType',
      'getFormatLocale'
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
  background-color: $gray-900;
}

.dropdown-content li a {
  color: white;
}

.dropdown-content li a i {
  color: $wagerr-red;
  font-size: 1.3em;
}

.dropdown-content li:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
