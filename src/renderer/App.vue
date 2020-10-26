<template>
  <div id="app" class="bg-gradient">
    <SplashScreen v-if="!walletLoaded"></SplashScreen>

    <div v-else class="wrapper">
      <div class="nav">
        <top-nav-bar></top-nav-bar>
      </div>

      <div class="main-content">
        <transition v-if="!getConsoleVisibleStatus" name="fade" mode="out-in">
          <router-view></router-view>
        </transition>

        <debug-input v-if="getConsoleVisibleStatus"></debug-input>
      </div>
    </div>

    <!-- Include modals -->
    <unlock-wallet :is-startup="isStartup"></unlock-wallet>
  </div>
</template>

<script>
import Vuex from 'vuex';
import TopNavBar from './components/TopNavBar.vue';
import SplashScreen from './components/splashscreen/SplashScreen.vue';
import DebugInput from './components/rpc/DebugInput.vue';
import UnlockWallet from './components/modals/UnlockWallet.vue';

export default {
  name: 'App',

  components: { SplashScreen, TopNavBar, DebugInput, UnlockWallet },

  data() {
    return {
      isStartup: true
    };
  },

  computed: {
    ...Vuex.mapGetters([
      'walletLoaded',
      'getConsoleVisibleStatus',
      'walletEncrypted',
      'getPasswordOnStartup'
    ])
  },

  watch: {
    async walletLoaded(walletLoaded) {
      if (walletLoaded) {
        // Initialize and launch unlock wallet modal if necessary
        const elem = document.getElementById('unlock-wallet-modal');

        if (this.walletEncrypted && this.getPasswordOnStartup) {
          const self = this;
          const instance = M.Modal.init(elem, { onCloseEnd: () => self.isStartup = false });
          instance.open();
        } else {
          M.Modal.init(elem);
          this.isStartup = false;
        }
      }
    }
  },

  mounted() {
    // Initializes some modals
    this.$initMaterialize();
  }
};
</script>
