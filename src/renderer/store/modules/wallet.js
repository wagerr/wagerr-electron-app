import wagerrRPC from '@/services/api/wagerrRPC';
import walletRPC from '@/services/api/wallet_rpc';
import * as blockchain from '../../../main/blockchain/blockchain';
import {walletState} from '@/constants/constants';

const packageJSON = require('../../../../package.json');

const state = function() {
  return {
    loaded: false,
    balance: 0,
    immature: 0,
    pending: 0,
    lockedBalance: 0,
    zerocoin: 0,
    state: '',
    encrypted: false,
    synced: false,
    initWalletText: 'Initialising Electron App Wallet...',
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

  walletLocked: state => {
    return state.state === walletState.LOCKED;
  },

  walletUnlocked: (state, getters) => {
    return getters.walletUnlockedFully || getters.walletUnlockedOnlyStaking;
  },

  walletUnlockedFully: state => {
    return state.state === walletState.UNLOCKED;
  },

  walletUnlockedOnlyStaking: state => {
    return state.state === walletState.UNLOCKED_STAKING;
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
    return wagerrRPC.client
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

  unlockWallet({ dispatch, commit }, [passphrase, timeout, anonymizeonly]) {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .walletPassphrase(passphrase, timeout, anonymizeonly)
        .then(async function(resp) {
          await dispatch('walletInfo');
          M.toast({
            html:
              '<span class="toast__bold-font">Success &nbsp;</span> Wallet unlocked',
            classes: 'green'
          });

          resolve();
        })
        .catch(function(err) {
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
        commit('setWalletState', walletState.LOCKED);
        M.toast({
          html:
            '<span class="toast__bold-font">Success &nbsp;</span> Wallet locked',
          classes: 'green'
        });
      })
      .catch(function(err) {
        M.toast({ html: err, classes: 'wagerr-red-bg' });
        console.debug(err);
      });
  },

  walletInfo({ commit }) {
    // TODO once bug #198 in wagerr core has been resolved, call to getStakingStatus can be removed and just use walletinfo resp
    // Url bug: https://github.com/wagerr/wagerr/issues/198
    return Promise.all([walletRPC.getWalletInfo(), wagerrRPC.client.getStakingStatus()])
      .then((resp) => {
        const walletInfoResp = resp[0];
        const stakingStatusResp = resp[1];
        commit('setTXCount', walletInfoResp.txcount);

        if (walletInfoResp.encryption_status === 'unencrypted') {
          commit('setWalletEncrypted', false);
          commit('setWalletState', '');

        } else {
          commit('setWalletEncrypted', true);

          if (!stakingStatusResp.result.walletunlocked) {
            commit('setWalletState', walletState.LOCKED);

          } else {
            commit('setWalletState', walletInfoResp.encryption_status);
          }
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

  setWalletState(state, walletState)  {
    state.state = walletState;
  },

  setOnlyStaking(state, onlyStaking) {
    state.onlyStaking = onlyStaking;
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
