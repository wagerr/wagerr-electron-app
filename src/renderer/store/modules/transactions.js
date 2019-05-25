import wagerrRPC from '@/services/api/wagerrRPC';
import walletRPC from '../../services/api/wallet_rpc';

const state = function() {
  return {
    accountAddress: '',
    wgrTransactionList: [],
    wgrTransactionRecords: [],
    plBetTransactionList: [],
    cgBetTransactionList: []
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
  }
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

  getPLBetTransactionList({ commit }, length) {
    wagerrRPC.client
      .listBets('*', length)
      .then(function(resp) {
        commit('setPLBetTransactionList', resp.result.reverse());
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
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
