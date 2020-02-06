<template>
  <div id="betting" class="content">
    <div class="row">
      <div class="betting-sidebar">
        <div class="betting-sidebar-container">
          <side-nav-bar @needsScroll="scrollToTop"></side-nav-bar>
        </div>
      </div>

      <div class="betting-main">
        <div class="col s12 betting-content">
          <transition name="fade" mode="out-in">
            <div id="peerless" class="row">
              <div class="col s1 m9">
                <event-list></event-list>
              </div>

              <div class="col s1 m3 bet-slip-div">
                <bet-slip></bet-slip>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

// import bettingNav from '@/components/betting/bettingNav.vue';
import SideNavBar from '@/components/SideNavBar.vue';
import BetSlip from '@/components/betting/components/BetSlip.vue';
import EventList from '@/components/betting/components/EventList.vue';

export default {
  name: 'Betting',
  components: { SideNavBar, /* bettingNav, */ EventList, BetSlip },
  computed: {
    ...mapGetters(['getOddsFormats', 'getOddsFormat'])
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  }
};
</script>
