import addressesRPC from '@/services/api/addresses_rpc';
import transactionsRPC from '@/services/api/transactions_rpc';

const state = function() {
  return {
    accountAddress: '',
    wgrTransactionList: [],
    wgrTransactionRecords: [],
    myBetsTransactionList: [],
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

  myBetsTransactionList: state => {
    return state.myBetsTransactionList;
  },

  cgBetTransactionList: state => {
    return state.cgBetTransactionList;
  }
};

const actions = {
  async getAccountAddress({ commit }) {
    commit(
      'setAccountAddress',
      await addressesRPC.getNewAddress()
    );
  },

  async getWGRTransactionList({ commit }, length) {
    commit(
      'setWGRTransactionList',
      await transactionsRPC.listTransactions(length)
    );
  },

  async getWGRTransactionRecords({ commit }, length) {
    commit(
      'setWGRTransactionRecords',
      await transactionsRPC.listTransactionRecords(length)
    );
  },

  async getMyBetsTransactionList({ commit }, length) {
    commit(
      'setMyBetsTransactionList',
      await transactionsRPC.getMyBets(length)
    );
  },

  async getCGBetTransactionList({ commit }, length) {
    commit(
      'setCGBetTransactionList',
      await transactionsRPC.listChainGameBets(length)
    );
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

  setMyBetsTransactionList(state, txList) {
    state.myBetsTransactionList = txList;
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
