import { stat } from 'fs';

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
  }
};

const mutations = {
  addBet(state, betDetails) {
    if (state.betSlip.length > 1) return;
    state.betSlip.push(betDetails);
  },

  // Remove a single bet from the bet slip using hte betId.
  removeBet(state, betId) {
    const { betSlip } = state;
    const bet = betSlip.find(p => p.betId === betId);

    // If a bet with the given ID is in the bet slip.
    if (bet) {
      // Iterate over bet slip and remove the bet with the matching betId.
      for (let i = 0; i < betSlip.length; i++) {
        const obj = betSlip[i];

        if (obj.betId === betId) {
          betSlip.splice(i, 1);
        }
      }
    }
  },

  // Clear all the bets from the bet slip.
  clearSlip(state) {
    state.betSlip = [];
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
