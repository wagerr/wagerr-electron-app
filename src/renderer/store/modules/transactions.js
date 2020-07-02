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

  getWGRTransactionRecords({ commit }, {from, length}) {
    return wagerrRPC.client
      .listTransactionRecords('*', length, from)
      .then(async function(resp) {
        const txRecords = resp.result.reverse();
        const updatedTxList = { data: [], total: 0};

        // Get the extra tx details for each tx record.
        for (let tx of txRecords) {
          const transaction = await walletRPC.getTransaction(tx.transactionid);
          const merged = Object.assign({}, tx, transaction);

          updatedTxList.data.push(merged);
        }

        /* 
        * TODO update the line of code below according to the response from daemon
        * Daemon resp should return the total number of txs so we can paginate
        * Provisionally: 
        *  - we consider that total number is stored in 'total' response property (could be in a different property)
        *  - If property doesnt exist, we made up the total of 1000 (remove it once daemon response is implemented)
        */
        updatedTxList.total = resp.total ? resp.total : 1000;
        commit('setWGRTransactionRecords', updatedTxList);
        return updatedTxList;
      })
      .catch(function(err) {
        // TODO Handle error correctly.
        console.error(err);
      });
  },

  getPLBetTransactionList({ commit }, {from, length }) {
    return wagerrRPC.client
      .listBets('*', length, from)
      .then(function(resp) {
        commit('setPLBetTransactionList', resp.result.reverse());
      })
      .catch(function(err) {
        // TODO Handle error correctly.
        console.error(err);
      });
  },

  getCGBetTransactionList({ commit }, length) {
    return wagerrRPC.client
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
