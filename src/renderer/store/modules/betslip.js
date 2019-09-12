import { stat } from 'fs';
import moment from 'moment';

const oddsForBet = {
  1: event => event.odds[0].mlHome,
  2: event => event.odds[0].mlAway,
  3: event => event.odds[0].mlDraw,
  4: event => event.odds[1].spreadHome,
  5: event => event.odds[1].spreadAway,
  6: event => event.odds[2].totalsOver,
  7: event => event.odds[2].totalsUnder
};

const state = {
  betSlip: []
};

const getters = {
  betSlip: state => {
    return state.betSlip;
  },

  getNumBets: state => {
    return state.betSlip ? state.betSlip.length : 0;
  }
};

const actions = {
  addBetToSlip({ commit }, betData) {
    commit('addBet', betData);
  },

  removeBetFromSlip({ commit, state }, betId) {
    commit('removeBet', betId);
  },

  clearBetSlip({ commit }) {
    commit('clearSlip');
  },

  updateBet({ commit }, { betItem, eventDetails }) {
    commit('updateBetSlipEventDetails', { betItem, eventDetails });
  }
};

const mutations = {
  addBet(state, betDetails) {
    state.betSlip.push(betDetails);
  },

  // Remove a single bet from the bet slip using hte betId.
  removeBet(state, betId) {
    const { betSlip } = state;
    const betIndex = betSlip.findIndex(p => p.betId === betId);

    if (betIndex >= 0) {
      betSlip.splice(betIndex, 1);
    } else {
      //TODO show a dialog error message and log the error
    }
  },

  // Clear all the bets from the bet slip.
  clearSlip(state) {
    state.betSlip = [];
  },

  updateBetSlipEventDetails({ state }, { betItem, eventDetails }) {
    // depending on bet outcome
    betItem.eventDetails = eventDetails;
    // prob move to another place listenign to changes
    const odds = oddsForBet[betItem.outcome](eventDetails);
    betItem.odds = odds;
    // Todo: from Eventlist, need refactoring
    if (betItem.betType === 'spread') {
      const handicap_calc = {
        4: event => (event.odds[0].mlHome > event.odds[0].mlAway ? '+' : '-'),
        5: event => (event.odds[0].mlAway > event.odds[0].mlHome ? '+' : '-')
      };
      const handicap = `Handicap ${handicap_calc[betItem.outcome](
        eventDetails
      )}${eventDetails.odds[1].spreadPoints / 10}`;
      betItem.handicap = handicap;
    }
    if (betItem.betType === 'total') {
      const total_calc = {
        6: `Over${eventDetails.odds[2].totalsPoints / 10}`,
        7: `Under${eventDetails.odds[2].totalsPoints / 10}`
      };
      betItem.totalValue = total_calc[betItem.outcome];
    }
    // copied from eventList filter
    //TODO centralize this code (also found on events store):
    if (
      eventDetails.starting - 12 * 60 > moment().unix() &&
      eventDetails.starting <
        moment()
          .add(13, 'days')
          .unix()
    ) {
    } else {
      betItem.availability = false;
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
