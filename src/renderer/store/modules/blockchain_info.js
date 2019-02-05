import moment from 'moment'
import * as blockchain from '../../../main/blockchain/blockchain';

const state = function () {

    return {
        // General
        clientName: 'Wagerr Wallet v1.0.0',
        openSSLv: 'OpenSSL 1.1.0h  27 Mar 2018',
        berkeleyDBv: 'Berkeley DB 4.8.30: (April  9, 2010)',
        buildDate: moment('2018-09-27T00:00:00').format('MMM Do YYYY, h:mm:ss a'),
        startUpTime: moment().format('MMM Do YYYY, h:mm:ss a'),
        dataDir: blockchain.getWagerrDataPath(),
        // Other
        initWalletText: 'Initialising Wagerr Wallet...'
    }

};

const getters = {

    clientName: (state) => {
        return state.clientName;
    },

    clientVersion: (state) => {
        return state.clientVersion;
    },

    openSSLv: (state) => {
        return state.openSSLv;
    },

    berkeleyDBv: (state) => {
        return state.berkeleyDBv;
    },

    buildDate: (state) => {
        return state.buildDate;
    },

    startUpTime: (state) => {
        return state.startUpTime;
    },

    dataDir: (state) => {
        return state.dataDir;
    },

    getInitText: (state) => {
        return state.initWalletText;
    }

};

const actions = {

    updateInitText ({commit}, walletInitText) {
        commit('setInitText', walletInitText)
    }

};

const mutations = {

    setInitText (state, initWalletText) {
        state.initWalletText = initWalletText;
    },

};

export default {
    state,
    getters,
    actions,
    mutations
}
