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
  </div>
</template>

<script>
import Vuex from 'vuex';
import TopNavBar from '@/components/TopNavBar.vue';
import SplashScreen from '@/components/splashscreen/SplashScreen';
import DebugInput from '@/components/rpc/DebugInput';

export default {
  name: 'App',
  components: { SplashScreen, TopNavBar, DebugInput },

  computed: {
    ...Vuex.mapGetters(['walletLoaded', 'getConsoleVisibleStatus'])
  }
};
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
