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
    ...Vuex.mapGetters(['convertOdds'])
  },

  methods: {
    // Convert the interger and odds
    betToText(leg) {
      switch (leg.outcome) {
        case 1:
          return `Home Win @ ${this.convertOdds(leg.lockedEvent.homeOdds)}`;
        case 2:
          return `Away Win @ ${this.convertOdds(leg.lockedEvent.awayOdds)}`;
        case 3:
          return `Draw @ ${this.convertOdds(leg.lockedEvent.drawOdds)}`;
        case 4:
          return `Home Spread ${this.spreadCalc(true, leg.lockedEvent)}@${this.convertOdds(leg.lockedEvent.spreadHomeOdds)}`;
        case 5:
          return `Away Spread ${this.spreadCalc(false, leg.lockedEvent)}@${this.convertOdds(leg.lockedEvent.spreadAwayOdds)}`;
        case 6:
          return `Total Over ${leg.lockedEvent.totalPoints / 100}@${this.convertOdds(
            leg.lockedEvent.totalOverOdds
          )}`;
        case 7:
          return `Total Under ${leg.lockedEvent.totalPoints / 100}@${this.convertOdds(
            leg.lockedEvent.totalUnderOdds
          )}`;
        default:
          return leg.outcome;
      }
    },

    spreadCalc(homeTeam, event) {
      let homeTeamSpread;
      let awayTeamSpread;

      if (event.spreadPoints > 0) {
        homeTeamSpread = event.spreadPoints / 100;
        awayTeamSpread = (event.spreadPoints * -1) / 100;
      } else {
        homeTeamSpread = event.spreadPoints / 100;
        awayTeamSpread = (event.spreadPoints * -1) / 100;
      }

      if (homeTeam) {
        return homeTeamSpread;
      }

      if (!homeTeam) {
        return awayTeamSpread;
      }
    }
  }
};
</script>
