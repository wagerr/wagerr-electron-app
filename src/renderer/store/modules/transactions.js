import addressesRPC from '@/services/api/addresses_rpc';
import transactionsRPC from '@/services/api/transactions_rpc';

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

  async getPLBetTransactionList({ commit }, length) {
    commit(
      'setPLBetTransactionList',
      await transactionsRPC.listBets(length)
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
