<template>
  <div id="betting" class="content">
    <div class="row">
      <div class="betting-sidebar">
        <div class="betting-sidebar-container">
          <div class="sidebar-branding"></div>

          <side-nav-bar></side-nav-bar>
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
import bettingNav from './components/betting/bettingNav';
import SideNavBar from './components/SideNavBar';
import BetSlip from '@/components/betting/components/BetSlip';
import EventList from '@/components/betting/components/EventList';

export default {
  name: 'Betting',
  components: { SideNavBar, bettingNav, EventList, BetSlip }
};
</script>
