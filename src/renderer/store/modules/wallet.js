import wagerrRPC from '@/services/api/wagerrRPC';
import walletRPC from '@/services/api/wallet_rpc';
import i18n from '../../../common/i18n/i18n';
import * as blockchain from '../../../main/blockchain/blockchain';

const packageJSON = require('../../../../package.json');

const state = function() {
  return {
    loaded: false,
    balance: 0,
    immature: 0,
    pending: 0,
    lockedBalance: 0,
    zerocoin: 0,
    unlocked: false,
    encrypted: false,
    synced: false,
    initWalletText: '',
    walletVersion: `v${packageJSON.version}`,
    txCount: 0,
    dataDir: blockchain.getWagerrDataPath()
  };
};

const getters = {
  balance: state => {
    return state.balance;
  },

  immature: state => {
    return state.immature;
  },

  pending: state => {
    return state.pending;
  },

  lockedBalance: state => {
    return state.lockedBalance;
  },

  zerocoin: state => {
    return state.zerocoin;
  },

  walletLoaded: state => {
    return state.loaded;
  },

  walletUnlocked: state => {
    return state.unlocked;
  },

  walletEncrypted: state => {
    return state.encrypted;
  },

  walletSynced: state => {
    return state.synced;
  },

  initText: state => {
    return state.initWalletText;
  },

  walletVersion: state => {
    return state.walletVersion;
  },

  daemonVersion: state => {
    return state.daemonVersion;
  },

  getTxCount: state => {
    return state.txCount;
  },

  dataDir: state => {
    return state.dataDir;
  }
};

const actions = {
  updateWalletLoaded({ commit }, walletLoaded) {
    commit('setWalletLoaded', walletLoaded);
  },

  walletExtendedBalance({ commit }) {
    wagerrRPC.client
      .getExtendedBalance()
      .then(function(resp) {
        commit(
          'setBalance',
          resp.result.balance -
            resp.result.balance_immature -
            resp.result.balance_locked
        );
        commit('setImmature', resp.result.balance_immature);
        commit('setPending', resp.result.balance_unconfirmed);
        commit('setLockedBalance', resp.result.balance_locked);
        commit('setZerocoin', resp.result.zerocoin_balance);
      })
      .catch(function(err) {
        // TODO - Add better error handling.
        console.error(err);
      });
  },

  unlockWallet({ commit }, [passphrase, timeout, anonymizeonly]) {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .walletPassphrase(passphrase, timeout, anonymizeonly)
        .then(function(resp) {
          commit('setWalletUnlocked', true);
          M.toast({
            html:
              `<span class="toast__bold-font">${i18n.t('Success')} &nbsp;</span>
              ${i18n.t('Wallet unlocked')}`,
            classes: 'green'
          });

          resolve();
        })
        .catch(function(err) {
          commit('setWalletUnlocked', false);
          M.toast({ html: err, classes: 'wagerr-red-bg' });
          console.log(err);
          reject();
        });
    });
  },

  lockWallet({ commit }) {
    wagerrRPC.client
      .walletLock()
      .then(function(resp) {
        commit('setWalletUnlocked', false);
        M.toast({
          html:
            `<span class="toast__bold-font">${i18n.t('Success')} &nbsp;</span>
            ${i18n.t('Wallet locked')}`,
          classes: 'green'
        });
      })
      .catch(function(err) {
        M.toast({ html: err, classes: 'wagerr-red-bg' });
        console.debug(err);
      });
  },

  walletInfo({ commit }) {
    walletRPC
      .getWalletInfo()
      .then(function(resp) {
        commit('setTXCount', resp.txcount);

        switch (resp.encryption_status) {
          case 'unencrypted':
            commit('setWalletUnlocked', true);
            commit('setWalletEncrypted', false);
            break;
          case 'locked':
            commit('setWalletUnlocked', false);
            commit('setWalletEncrypted', true);
            break;
          case 'unlocked':
            commit('setWalletUnlocked', true);
            commit('setWalletEncrypted', true);
            break;
        }
      })
      .catch(function(err) {
        console.debug(err);
      });
  },

  updateInitText({ commit }, walletInitText) {
    commit('setInitText', walletInitText);
  }

  // Add other wallet functions here...
};

const mutations = {
  setBalance(state, balance) {
    state.balance = balance;
  },

  setImmature(state, immature) {
    state.immature = immature;
  },

  setPending(state, pending) {
    state.pending = pending;
  },

  setLockedBalance(state, lockedBalance) {
    state.lockedBalance = lockedBalance;
  },

  setZerocoin(state, zerocoin) {
    state.zerocoin = zerocoin;
  },

  setWalletLoaded(state) {
    state.loaded = true;
  },

  setWalletUnlocked(state, unlocked) {
    state.unlocked = unlocked;
  },

  setWalletEncrypted(state, encrypted) {
    state.encrypted = encrypted;
  },

  setWalletSynced(state, synced) {
    state.synced = synced;
  },

  setInitText(state, walletText) {
    state.initWalletText = walletText;
  },

  setTXCount(state, count) {
    state.txCount = count;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
