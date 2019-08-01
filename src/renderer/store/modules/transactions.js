import wagerrRPC from '@/services/api/wagerrRPC';
import walletRPC from '../../services/api/wallet_rpc';

const state = function() {
  return {
    accountAddress: '',
    wgrTransactionList: [],
    wgrTransactionRecords: [],
    plBetTransactionList: [],
    cgBetTransactionList: [],
    transactionMax: -1,
    betTransactionsPaginated: []
  };
};

const getters = {
  accountAddress: state => {
    return state.accountAddress;
  },

  wgrTransactionList: state => {
    return state.wgrTransactionList;
  },

  wgrTransactionRecords: state => {
    return state.wgrTransactionRecords;
  },

  plBetTransactionList: state => {
    return state.plBetTransactionList;
  },

  cgBetTransactionList: state => {
    return state.cgBetTransactionList;
  },

  transactionMax: state => {
    return state.transactionMax;
  },

  betTransactionsPaginated: state => {
    return state.betTransactionsPaginated;
  },
};

const actions = {
  getAccountAddress({ commit }) {
    wagerrRPC.client
      .getNewAddress()
      .then(function(resp) {
        commit('setAccountAddress', resp.result);
      })
      .catch(function(err) {
        // TODO Handle `err` properly.
        console.error(err);
      });
  },

  getWGRTransactionList({ commit }, length) {
    wagerrRPC.client
      .listTransactions('*', length)
      .then(function(resp) {
        commit('setWGRTransactionList', resp.result.reverse());
      })
      .catch(function(err) {
        // TODO Handle error correctly.
        console.error(err);
      });
  },

  getWGRTransactionRecords({ commit }, length) {
    wagerrRPC.client
      .listTransactionRecords('*', length)
      .then(async function(resp) {
        const txRecords = resp.result.reverse();
        const updatedTxList = [];

        // Get the extra tx details for each tx record.
        for (let i = 0; i < txRecords.length; i++) {
          const transactionRec = txRecords[i];
          const transaction = await walletRPC.getTransaction(
            transactionRec.transactionid
          );
          const merged = Object.assign({}, transactionRec, transaction);

          updatedTxList.push(merged);
        }

        commit('setWGRTransactionRecords', updatedTxList);
      })
      .catch(function(err) {
        // TODO Handle error correctly.
        console.error(err);
      });
  },

  // :TEST
  setTransactionRecordsTest({ commit }, list) {
    commit('setWGRTransactionRecords', list);
  },

  getBetTransactionListTest({ commit }, list) {
    commit('setPLBetTransactionList', list);
  },

  getPLBetTransactionList({ commit }, {length, rexg, from}) {
    console.log("from ", from)
    wagerrRPC.client
      .listBets(rexg, length, from)
      .then(function(resp) {
        commit('setPLBetTransactionList', resp.result.reverse());
      })
      .then(function() {
        if (getters.plBetTransactionList.length === 0 || getters.plBetTransactionList.length < betTransactionlistLength) commit('setTransactionMax', getters.betTransactionsPaginated.length + getters.plBetTransactionList.length);
        // Update the first page of bets.
        // Assuming no more bets made from first page since. Update rest of bets?
        if ((from === 0) && (getters.plBetTransactionList.length >= length)) {
          commit('setFirstPageBetTransactionsPaginated', length);
        } else {
          commit('setBetTransactionsPaginated', getters.betTransactionsPaginated.concat(getters.plBetTransactionList));
        }
      })
      .catch(function(err) {
        // TODO Handle error correctly.
        console.error(err);
      });
  },

  getCGBetTransactionList({ commit }, length) {
    wagerrRPC.client
      .listChainGamesBets('*', length)
      .then(function(resp) {
        commit('setCGBetTransactionList', resp.result.reverse());
      })
      .catch(function(err) {
        // TODO Handle error correctly.
        console.error(err);
      });
  }
};

const mutations = {
  setAccountAddress(state, accountAddress) {
    state.accountAddress = accountAddress;
  },

  setWGRTransactionList(state, txList) {
    state.wgrTransactionList = txList;
  },

  setWGRTransactionRecords(state, txList) {
    state.wgrTransactionRecords = txList;
  },

  setPLBetTransactionList(state, txList) {
    state.plBetTransactionList = txList;
  },

  setCGBetTransactionList(state, txList) {
    state.cgBetTransactionList = txList;
  },

  setTransactionMax(state, max) {
    state.transactionMax = max;
  },

  setBetTransactionsPaginated(state, paginated) {
    state.betTransactionsPaginated = paginated;
  },
  setFirstPageBetTransactionsPaginated(state, length) {
    state.betTransactionsPaginated.splice(0, length, ...state.plBetTransactionList);
    state.betTransactionsPaginated;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
