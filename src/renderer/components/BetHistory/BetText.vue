<template>
  <span>
    {{ betToText(bet) }}
  </span>
</template>

<script>
import Vuex from 'vuex';

export default {
  name: 'BetText',
  props: ['bet'],
  computed: {
    ...Vuex.mapGetters([
      'convertOdds'
    ])
  },

  methods: {
    // Convert the interger and odds
    betToText: function(leg) {
      switch (leg.outcome) {
        case 1:
          return 'Home Win @' + this.convertOdds(leg.lockedEvent.homeOdds);
        case 2:
          return 'Away Win @' + this.convertOdds(leg.lockedEvent.awayOdds);
        case 3:
          return 'Draw @' + this.convertOdds(leg.lockedEvent.drawOdds);
        case 4:
          let oddsHome = leg.lockedEvent.spreadHomeOdds > leg.lockedEvent.spreadAwayOdds
                              ? '+'
                              : '-';
                              oddsHome += leg.lockedEvent.spreadPoints / 10;
          return 'Home Spread ' + oddsHome + '@' + this.convertOdds(leg.lockedEvent.spreadHomeOdds);
        case 5:
          let oddsAway = leg.lockedEvent.spreadAwayOdds > leg.lockedEvent.spreadHomeOdds
                              ? '+'
                              : '-';
                              oddsAway += leg.lockedEvent.spreadPoints / 10;
          return 'Away Spread ' + oddsAway + '@' + this.convertOdds(leg.lockedEvent.spreadAwayOdds);
        case 6:
          return 'Total Over ' + leg.lockedEvent.totalPoints / 10 + '@' + this.convertOdds(leg.lockedEvent.totalOverOdds);
        case 7:
          return 'Total Under ' + leg.lockedEvent.totalPoints / 10 + '@' + this.convertOdds(leg.lockedEvent.totalUnderOdds);
        default:
          return leg.outcome;
      }
    }
  }  
};
</script>
