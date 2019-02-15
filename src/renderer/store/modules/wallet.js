import wagerrRPC from '@/services/api/wagerrRPC';
import walletRPC from '@/services/api/wallet_rpc';

const state = function () {

    return {
        loaded: false,
        balance: 0,
        immature: 0,
        pending: 0,
        zerocoin: 0,
        unlocked: false,
        synced: false,
        initWalletText: 'Initialising Wagerr Wallet...'
    }

};

const getters = {

    balance: (state) => {
        return state.balance;
    },

    immature: (state) => {
        return state.immature;
    },

    pending: (state) => {
        return state.pending;
    },

    zerocoin: (state) => {
        return state.zerocoin;
    },

    walletLoaded: (state) => {
        return state.loaded;
    },

    walletUnlocked: (state) => {
        return state.unlocked;
    },

    walletSynced: (state) => {
        return state.synced;
    },

    initText: (state) => {
        return state.initWalletText;
    },

    // Add other wallet getter functions here...

};

const actions = {

    updateWalletLoaded ({commit}, walletLoaded) {
        commit('setWalletLoaded', walletLoaded);
    },

    updateWalletSynced ({commit}) {
        wagerrRPC.client.getStakingStatus()
            .then(function (resp) {
                commit('setWalletSynced', resp.result.mnsync);
            })
            .catch(function (err) {
                commit('setWalletSynced', false);
                console.error(err);
            })
    },

    walletBalance ({commit}) {
        wagerrRPC.client.getBalance()
            .then(function (resp) {
                commit('setBalance', resp.result);
            })
            .catch(function (err) {
                commit('setBalance', 0);
                console.error(err);
            })
    },

    walletExtendedBalance ({commit}) {
        wagerrRPC.client.getExtendedBalance()
            .then(function (resp) {
                commit('setBalance', resp.result.balance);
                commit('setImmature', resp.result.balance_immature);
                commit('setPending', resp.result.balance_unconfirmed);
                commit('setZerocoin', resp.result.zerocoin_balance);

            })
            .catch(function (err) {
                // TODO - Add better error handling.
                console.error(err);
            })
    },

    unlockWallet ({commit}, password) {
        return new Promise((resolve, reject) => {
            wagerrRPC.client.walletPassphrase(password, 1000)
                .then(function (resp) {
                    commit('setWalletUnlocked', true);
                    M.toast({
                        html: '<span class="toast__bold-font">Success &nbsp;</span> Wallet unlocked',
                        classes: 'green'
                    });

                    resolve();
                })
                .catch(function (err) {
                    commit('setWalletUnlocked', false);
                    M.toast({html: err, classes: 'wagerr-red-bg'});
                    console.log(err);
                    reject();
                })

        });
    },

    lockWallet ({commit}) {
        wagerrRPC.client.walletLock()
            .then(function (resp) {
                commit('setWalletUnlocked', false);
                M.toast({ html: '<span class="toast__bold-font">Success &nbsp;</span> Wallet locked', classes: 'green' });
            })
            .catch(function (err) {
                 M.toast({html: err, classes: 'wagerr-red-bg'});
                console.debug(err);
            })
    },

    updateInitText ({commit}, walletInitText) {
        commit('setInitText', walletInitText);
    },

    // Add other wallet functions here...

};

const mutations = {

    setBalance (state, balance) {
        state.balance = balance;
    },

    setImmature (state, immature) {
        state.immature = immature;
    },

    setPending (state, pending) {
        state.pending = pending;
    },

    setZerocoin (state, zerocoin) {
        state.zerocoin = zerocoin;
    },

    setWalletLoaded (state) {
        state.loaded = true;
    },

    setWalletUnlocked (state, unlocked) {
        state.unlocked = unlocked;
    },

    setWalletSynced (state, synced) {
        state.synced = synced;
    },

    setInitText (state, walletText) {
        state.initWalletText = walletText;
    },

};

export default {
  state,
  getters,
  actions,
  mutations
}
