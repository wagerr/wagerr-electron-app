<template>
  <div id="peerless" class="row">
    <div class="col s1 m9">
      <event-list></event-list>
    </div>

    <div class="col s1 m3 bet-slip-div">
      <bet-slip></bet-slip>
    </div>
  </div>
</template>

<script>
import BetSlip from '@/components/betting/components/BetSlip';
import EventList from '@/components/betting/components/EventList';

export default {
  name: 'Peerless',
  components: { EventList, BetSlip }
};
</script>
