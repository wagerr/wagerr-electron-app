import wagerrRPC from '@/services/api/wagerrRPC'

const state = function () {

    return {
        accountAddress: '',
        wgrTransactionList: [],
        plBetTransactionList: [],
        cgBetTransactionList: [],
    }

};

const getters = {

    accountAddress: (state) => {
        return state.accountAddress;
    },

    wgrTransactionList: (state) => {
        return state.wgrTransactionList;
    },

    plBetTransactionList: (state) => {
        return state.plBetTransactionList;
    },

    cgBetTransactionList: (state) => {
        return state.cgBetTransactionList;
    },

};

const actions = {

    getAccountAddress ({commit}) {
        let rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

        wagerrRPC.client.getAccountAddress(rand)
            .then(function (resp) {
                commit('setAccountAddress', resp.result);
            })
            .catch(function (err) {
                // TODO Handle `err` properly.
                console.error(err);
            })
    },

    getWGRTransactionList ({commit}, length) {
        wagerrRPC.client.listTransactions('*', length)
            .then(function (resp) {
                commit('setWGRTransactionList', resp.result.reverse());
            })
            .catch(function (err) {
                // TODO Handle error correctly.
                console.error(err);
            })
    },

    getPLBetTransactionList ({commit}, length) {
        wagerrRPC.client.listBets()
            .then(function (resp) {
                commit('setPLBetTransactionList', resp.result.reverse());
            })
            .catch(function (err) {
                // TODO Handle error correctly.
                console.error(err);
            })
    },

    getCGBetTransactionList ({commit}, length) {
        wagerrRPC.client.listChainGamesBets()
            .then(function (resp) {
                commit('setCGBetTransactionList', resp.result.reverse());
            })
            .catch(function (err) {
                // TODO Handle error correctly.
                console.error(err);
            })
    }

};

const mutations = {

    setAccountAddress (state, accountAddress) {
        state.accountAddress = accountAddress
    },

    setWGRTransactionList (state, txList) {
        state.wgrTransactionList = txList;
    },

    setPLBetTransactionList (state, txList) {
        state.plBetTransactionList = txList;
    },

    setCGBetTransactionList (state, txList) {
        state.cgBetTransactionList = txList;
    }

};

export default {
  state,
  getters,
  actions,
  mutations
}
