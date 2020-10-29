import addressesRPC from '@/services/api/addresses_rpc';
import transactionsRPC from '@/services/api/transactions_rpc';

const state = {
  accountAddress: '',
  myBetsTransactionList: [],
  cgBetTransactionList: []
};

const getters = {
  accountAddress: state => {
    return state.accountAddress;
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
