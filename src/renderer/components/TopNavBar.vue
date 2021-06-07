<template>
  <header class="z-depth-2">
    <div class="wagerr-logo"></div>

    <ul class="top-nav">
      <li>
        <router-link to="/" exact>
          <i class="navico-wallet"></i>
          <h6>Wallet Home</h6>
        </router-link>
      </li>

      <li>
        <router-link to="/bet_history">
          <i class="navico-history"></i>
          <h6>Bet History</h6>
        </router-link>
      </li>

      <li>
        <router-link to="/betting">
          <i class="navico-betting"></i>
          <h6>Betting</h6>
        </router-link>
      </li>

      <li class="disabled">
        <a>
          <i class="navico-dice"></i>
          <h6>
            Chain Games
            <br />
            <small>(Coming soon!)</small>
          </h6>
        </a>
      </li>

      <li>
        <router-link to="/masternodes">
          <i class="navico-wrench"></i>
          <h6>Masternodes</h6>
        </router-link>
      </li>

      <li>
        <router-link to="/tools/info">
          <i class="navico-wrench"></i>
          <h6>Tools &amp; Info</h6>
        </router-link>
      </li>

      <li>
        <el-dropdown trigger="click" placement="bottom-start">
          <div>
            <i class="navico-gear"></i>
            <h6>Settings</h6>
          </div>
          <el-dropdown-menu slot="dropdown" class="topnav-dropdown">
            <el-dropdown-item v-if="!walletEncrypted">
              <a @click="openModal('encrypt-wallet')">
                <i class="icon-file-lock"></i>
                Encrypt Wallet
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a @click="openModal('change-wallet-password')">
                <i class="icon-user-lock"></i>
                Change Password
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a @click="updadteConsoleVisible">
                <i class="icon-cli"></i>
                RPC CLI Tool
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/preferences" exact>
                <i class="icon-cog"></i>
                Preferences
              </router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
            :data-target="walletLocked ? 'unlock-wallet-modal' : ''"
            :class="`lock fa ${lockIcon} tooltipped modal-trigger`"
            :data-tooltip="lockText"
            @click="!walletLocked ? lockWallet() : ''"
          >
          </i>
          <el-tooltip placement="left">
            <div slot="content">
              <small>
                Balance: {{ Math.trunc(balance * 100) / 100 }}
                <br />
                Unconfirmed: {{ Math.trunc(pending * 100) / 100 }}
                <br />
                Immature: {{ Math.trunc(immature * 100) / 100 }}
                <br />
                Locked: {{ Math.trunc(lockedBalance * 100) / 100 }}
              </small>
            </div>
            <el-row>
              <el-row>
                {{ walletLoaded ? Math.trunc(balance * 10000) / 10000 : 'Loading...' }}
                <span class="currency">
                  {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
                </span>
              </el-row>
              <el-row>
                <h6>Currently Available</h6>
              </el-row>
            </el-row>
          </el-tooltip>
        </div>
      </span>
    </div>
  </header>
</template>

<script>
import Vuex from 'vuex';
import EncryptWallet from './modals/EncryptWallet.vue';
import ChangePassword from './modals/ChangePassword.vue';

export default {
  name: 'TopNavBar',

  components: {
    EncryptWallet,
    ChangePassword
  },

  data() {
    return {
      intervalHandle: 0
    };
  },

  computed: {
    ...Vuex.mapGetters([
      'balance',
      'immature',
      'lockedBalance',
      'pending',
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

  mounted() {
    // Initializes modals, dropdown and tooltip
    this.$initMaterialize();

    let isRunning = false;
    this.intervalHandle = setInterval(async () => {
      if (!isRunning) {
        isRunning = true;
        await this.walletInfo();
        await this.walletExtendedBalance();
        isRunning = false;
      }
    }, 3000);
  },

  beforeDestroy() {
    clearInterval(this.intervalHandle);
  },

  methods: {
    ...Vuex.mapActions([
      'lockWallet',
      'updadteConsoleVisible',
      'walletExtendedBalance',
      'walletInfo'
    ]),

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      M.Modal.getInstance(modal).open();
    }
  }
};
</script>

<style lang="scss">
@import '../assets/scss/element-ui';

// Dropdown list
@include dropdown(topnav-dropdown, #212529);
</style>

<style scoped lang="scss">
@import '../assets/scss/_variables';

header {
  color: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  height: 90px;
  background-color: $wagerr-red;
  background-image: url(../assets/images/bg-header.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  .wagerr-logo {
    height: 50px;
    background-image: url(../assets/images/logo-header.svg);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    float: left;
    margin: 20px 0 0 0;
    width: 200px;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
  }

  .wagerr-balance {
    margin: 17px 25px 0 0;

    #wagerr-total-balance {
      background-color: $bg-gradient-black-half;
      display: inline-block;
      padding: 10px 15px;
      font-weight: 600;
      color: $white;
      font-size: 16px;
      letter-spacing: 0.3px;

      h6 {
        color: $wagerr-red;
        font-size: 11px;
        text-align: center;
        letter-spacing: 0.3px;
        margin-top: 2px;
        margin-bottom: 0;
        font-weight: 600;
      }
    }

    i {
      margin-left: 10px;
      cursor: pointer;
      font-weight: bold;
    }
  }

  ul {
    margin: 0;
    padding: 0;

    li {
      display: block;
      float: left;
      list-style: none;
      font-size: 28px;
      padding: 0;
      cursor: pointer;
      text-align: center;
      height: 90px;
      position: relative;
      width: 110px;

      &:hover {
        background-color: $bg-gradient-black-quarter;

        i {
          filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.3));
        }

        h6 {
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
      }

      &.router-link-active {
        background-color: $bg-gradient-black-half;
      }

      a {
        display: block;
        height: 100%;
        width: 100%;
      }

      i {
        cursor: pointer;
        font-size: 0;
        margin: 20px 0 0;
        width: 100%;
        height: 30px;
        display: block;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;

        &.navico-wallet {
          background-image: url(../assets/images/navico-wallet.svg);
          height: 31px;
          margin-top: 22px;
        }

        &.navico-history {
          background-image: url(../assets/images/navico-history.svg);
          height: 32px;
          margin-top: 21px;
        }

        &.navico-betting {
          background-image: url(../assets/images/navico-betting.svg);
          height: 27px;
          margin-top: 23px;
        }

        &.navico-dice {
          background-image: url(../assets/images/navico-dice.svg);
          height: 24px;
          margin-top: 25px;
        }

        &.navico-wrench {
          background-image: url(../assets/images/navico-wrench.svg);
          height: 28px;
          margin-top: 22px;
        }

        &.navico-gear {
          background-image: url(../assets/images/navico-gear.svg);
          height: 26px;
          margin-top: 24px;
        }
      }

      h6 {
        color: #fff;
        font-size: 12px;
        margin: 0;
        position: absolute;
        top: 58px;
        display: block;
        text-align: center;
        width: 100%;
        letter-spacing: 0.5px;
      }

      .title {
        display: block;
        text-align: center;
        text-transform: uppercase;
        color: #fff;
        font-size: 12px;
        padding-top: 5px;
      }

      .dropdown-content {
        position: absolute;
        top: 90px !important;
        left: 0 !important;
        width: max-content !important;
        height: auto !important;

        li {
          display: block;
          float: left;
          list-style: none;
          font-size: 28px;
          padding: 15px 20px 10px 20px;
          cursor: pointer;
          min-height: auto;
          height: auto;

          a {
            text-align: left;
            font-size: 13px;
            padding: 8px 16px;

            &:hover {
              background-color: $bg-gradient-black-half;
            }

            i {
              margin: 0 8px 0 0 !important;
              color: $wagerr-red;
              font-weight: 600;
            }
          }
        }
      }

      .dropdown-trigger {
        margin-top: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        position: absolute;
      }

      #settings-dropdown li {
        padding: 0;
      }
    }
  }
}

.user-balance-flex {
  display: flex;

  i.lock {
    margin-left: 0;
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

// Dropdown button
.el-dropdown {
  width: 100%;
  color: white;
  height: 100%;

  // - Fixes behaviour of dropdown div trigger
  div.el-dropdown-selfdefine {
    width: 100%;
    height: 100%;
    position: absolute;
    outline: none;
  }
}

.disabled {
  color: rgba(255, 255, 255, 0.5);
  cursor: default;

  &:hover {
    background-color: transparent;
  }

  a {
    cursor: default;
  }

  i {
    cursor: default;
  }

  h6 {
    cursor: default;
  }
}
</style>
