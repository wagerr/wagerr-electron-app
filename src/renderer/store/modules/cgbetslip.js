import wagerrRPC from '@/services/api/wagerrRPC';
import moment from 'moment';

/**
 * Contains all the methods to store users bet slip state and add/remove bets from the bet slip.
 *
 * @module BetSlip
 * @package Wagerr Electron App
 */
const state = function() {
  return {
    loadingCGEvent: true,
    loadingCGDetails: true,
    noOfEntrants: 0,
    entryFee: 0,
    gameID: 0,
    potSize: 0,
    gameStartBlock: 0,
    gameStartTime: '',
    gameEndTime: 0,
    cgBetList: []
  };
};

const getters = {
  loadingCGEvent: state => {
    return state.loadingCGEvent;
  },

  loadingCGDetails: state => {
    return state.loadingCGDetails;
  },

  noOfEntrants: state => {
    return state.noOfEntrants;
  },

  entryFee: state => {
    return state.entryFee;
  },

  gameID: state => {
    return state.gameID;
  },

  potSize: state => {
    return state.potSize;
  },

  gameStartBlock: state => {
    return state.gameStartBlock;
  },

  gameStartTime: state => {
    return state.gameStartTime;
  },

  gameEndTime: state => {
    return state.gameEndTime;
  },

  cgBetList: state => {
    return state.cgBetList;
  }
};

const actions = {
  listChainGamesEvents({ commit, dispatch }) {
    wagerrRPC.client
      .listChainGamesEvents()
      .then(function(resp) {
        const allEvts = resp.result;
        let latestGame = 0;

        for (let b = 0; b < allEvts.length; b++) {
          if (parseInt(allEvts[b]['event-id']) > latestGame) {
            latestGame = parseInt(allEvts[b]['event-id']);
          }
        }

        if (latestGame > 0) {
          commit('setGameID', latestGame);
          dispatch('getChainGamesInfo', latestGame);
        }
      })
      .catch(function(err) {
        // TODO Handle error correctly.
        commit('setLoadingCGEvent', true);
        console.error(err);
      });
  },

  getChainGamesInfo({ commit, state }) {
    wagerrRPC.client
      .getChainGamesInfo(state.gameID)
      .then(function(resp) {
        // Calculate the lotto end date. Add one day for testnet and seven days for mainnet.
        const endDate = moment
          .unix(resp.result['start-time'])
          .add(resp.result.network === 1 ? 1 : 7, 'days');

        commit('setEntryFee', `${resp.result['entry-fee']}`);
        commit('setPotSize', `${resp.result['pot-size']}`);
        commit('setGameStartBlock', resp.result['start-block']);
        commit('setNoOfEntrants', resp.result['total-bets']);
        commit('setGameStartTime', resp.result['start-time']);
        commit('setGameEndTime', endDate);
        commit('setLoadingCGEvent', false);
        commit('setLoadingCGDetails', false);
      })
      .catch(function(err) {
        // TODO Handle error correctly.
        console.error(err);
        commit('setLoadingCGEvent', true);
        commit('setLoadingCGDetails', true);
      });
  }
};

const mutations = {
  setLoadingCGEvent(state, isLoading) {
    state.loadingCGEvent = isLoading;
  },

  setLoadingCGDetails(state, isLoading) {
    state.loadingCGDetails = isLoading;
  },

  setNoOfEntrants(state, noOfEntrants) {
    state.noOfEntrants = noOfEntrants;
  },

  setEntryFee(state, entryFee) {
    state.entryFee = entryFee;
  },

  setGameID(state, gameID) {
    state.gameID = gameID;
  },

  setPotSize(state, potSize) {
    state.potSize = potSize;
  },

  setGameStartBlock(state, gameStartBlock) {
    state.gameStartBlock = gameStartBlock;
  },

  setGameStartTime(state, gameStartTime) {
    state.gameStartTime = gameStartTime;
  },

  setGameEndTime(state, gameEndTime) {
    state.gameEndTime = gameEndTime;
  },
};

export default {
  moment,
  state,
  getters,
  actions,
  mutations
};
