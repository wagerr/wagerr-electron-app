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

      <router-link tag="li" to="/masternodes">
        <i class="navico-wrench"></i>
        <h6>Masternodes</h6>
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
    </ul>

    <div class="pull-right wagerr-balance">
      <span id="wagerr-total-balance">
        <div class="user-balance-flex">
          <i
            v-if="walletEncrypted"
            @click="!walletLocked ? lockWallet() : ''"
            :data-target="walletLocked ? 'unlock-wallet-modal': ''"
            :class="`lock fa ${lockIcon} tooltipped modal-trigger`"
            :data-tooltip="lockText">
          </i>
          <div>
            {{ walletLoaded ? Math.trunc(balance * 10000) / 10000 : 'Loading...' }}
            <span class="currency">{{
              getNetworkType === 'Testnet' ? 'tWGR' : 'WGR'
            }}</span>
            <h6>Currently Available</h6>
          </div>
        </div>
      </span>
    </div>
  </header>
</template>

<script>
import Vuex from 'vuex';
import EncryptWallet from '@/components/modals/EncryptWallet.vue';
import ChangePassword from '@/components/modals/ChangePassword.vue';

export default {
  name: 'TopNavBar',
  components: {
    EncryptWallet,
    ChangePassword
  },

  computed: {
    ...Vuex.mapGetters([
      'balance',
      'walletLoaded',
      'walletLocked',
      'walletUnlocked',
      'walletUnlockedFully',
      'walletUnlockedOnlyStaking',
      'walletEncrypted',
      'getNetworkType'
    ]),
    lockIcon() {
      if (this.walletLocked) return 'fa-lock';
      if (this.walletUnlockedOnlyStaking) return 'fa-unlock';
      if (this.walletUnlockedFully) return 'fa-lock-open';
    },
    lockText() {
      if (this.walletLocked) return 'Wallet Locked';
      if (this.walletUnlockedOnlyStaking) return 'Wallet Unlocked (only staking)';
      if (this.walletUnlockedFully) return 'Wallet Unlocked';
    }
  },

  methods: {
    ...Vuex.mapActions(['lockWallet', 'updadteConsoleVisible', 'walletInfo'])
  },

  async mounted() {
    // Initializes modals, dropdown and tooltip
    this.$initMaterialize();

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
@import '@/assets/scss/_variables';

.user-balance-flex {
  display: flex;

  i.lock {
    margin-left: 0px;
    font-size: 1.2em;
    margin-right: 10px;
    margin-top: 2px;

    &.fa-lock {
      color: $wagerr-red;
    }
    &.fa-unlock {
      color: #aaa;
    }
    &.fa-lock-open {
      color: white;
      font-size: 1em;
      margin-top: 4px;
    }
  }
}

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
