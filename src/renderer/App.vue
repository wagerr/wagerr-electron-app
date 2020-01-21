<template>
  <div id="app" class="bg-gradient">
    <SplashScreen v-if="!walletLoaded"></SplashScreen>

    <div v-else class="wrapper">
      <div class="nav">
        <top-nav-bar></top-nav-bar>
      </div>

      <div class="main-content">
        <transition name="fade" mode="out-in" v-if="!getConsoleVisibleStatus">
          <router-view></router-view>
        </transition>

        <debug-input v-if="getConsoleVisibleStatus"></debug-input>
        <!--
            <el-menu class="el-menu-vertical-demo">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">Debug Console</span>
              </template>
            </el-menu>
        !-->
      </div>
    </div>

    <!-- Include modals -->
    <unlock-wallet :is-startup="isStartup"></unlock-wallet>
  </div>
</template>

<script>
import Vuex from 'vuex';
import TopNavBar from '@/components/TopNavBar.vue';
import SplashScreen from '@/components/splashscreen/SplashScreen';
import DebugInput from '@/components/rpc/DebugInput';
import UnlockWallet from '@/components/modals/UnlockWallet';

export default {
  name: 'App',
  components: { SplashScreen, TopNavBar, DebugInput, UnlockWallet },
  methods: {
    ...Vuex.mapActions([])

  },

  data() {
    return {
      isStartup: true
    }
  },

  mounted() {
    // Initializes some modals
    this.$initMaterialize('App.vue');
  },

  computed: {
    ...Vuex.mapGetters(['walletLoaded', 'getConsoleVisibleStatus', 'walletEncrypted', 'getPasswordOnStartup'])
  },
  watch: {
    walletLoaded: async function(walletLoaded) {
      if (walletLoaded) {
        // Initialize and launch unlock wallet modal if necessary
        let elem = document.getElementById('unlock-wallet-modal');

        if (this.walletEncrypted && this.getPasswordOnStartup) {
          let self = this;
          let instance = M.Modal.init(elem, { onCloseEnd: () => self.isStartup = false });
          instance.open();
        } else {
          M.Modal.init(elem);
          this.isStartup = false;
        }
      }
    }
  }
};
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
