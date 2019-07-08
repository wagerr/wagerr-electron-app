// Import the required libs.
import moment from 'moment';
import ElectronStore from 'electron-store';
import oddsConverter from '@/utils/oddsConverter';
import addressesRPC from '@/services/api/addresses_rpc';

import constants from '../../../main/constants/constants';

// Current odds formats for Wagerr.
const OddsFormat = {
  fraction: 0,
  decimal: 1,
  american: 2
};

const electronStore = new ElectronStore();

const state = function () {
  return {
    timezone: moment.tz.guess(),
    oddsFormat: OddsFormat.decimal,
    showNetworkShare: false,
    accountList: [],
    accountAddressList: [],
    sendingAddressList: []
  };
};

const displayOdds = function(state, val) {
  if (state.oddsFormat === OddsFormat.decimal) {
    return oddsConverter.toDecimal(val);
  }
  if (state.oddsFormat === OddsFormat.fraction) {
    return oddsConverter.toFraction(val);
  }
  if (state.oddsFormat === OddsFormat.american) {
    return oddsConverter.toAmerican(val);
  }
  return oddsConverter.toDecimal(val);
};

const getters = {
  getTimezone: state => {
    return state.timezone;
  },
  getOddsFormat: state => {
    return state.oddsFormat;
  },
  getOddsFormats: state => {
    return OddsFormat;
  },
  convertOdds: state => val => {
    // Add/remove network share from odds. Default is to not display the 6%
    // network share taken from the winnings.
    if (!state.showNetworkShare) {
      val -= 10000; // -1
      val = val * 0.94 + 10000; // to correct decimal
    }
    return displayOdds(state, val);
  },
  getShowNetworkShare: state => {
    return state.showNetworkShare;
  },
  getAccountList: state => {
    return state.accountList;
  },
  getAccountAddressList: state => {
    return state.accountAddressList;
  },
  getSendingAddressList: state => {
    return state.sendingAddressList;
  }
};

const actions = {
  updateOddsFormat({ commit, state }, format) {
    commit('setOddsFormat', format);
    electronStore.set('oddsFormat', state.oddsFormat);
  },

  loadUserSettings({ dispatch }) {
    if (electronStore.has('oddsFormat')) {
      dispatch('updateOddsFormat', Number(electronStore.get('oddsFormat')));
    }
    if (electronStore.has('showNetworkShare')) {
      dispatch(
        'updateShowNetworkShare',
        Number(electronStore.get('showNetworkShare'))
      );
    }
  },

  toggleShowNetworkShare({ commit, state }) {
    commit('setShowNetworkShare', !state.showNetworkShare);
  },

  updateShowNetworkShare({ commit, state }, value) {
    commit('setShowNetworkShare', value);
  },

  getWGRAcountList({ commit, state }) {
    addressesRPC
      .getListAccounts()
      .then(function(resp) {
        commit('setAccountList', resp);
        return resp;
      })
      .then(function(resp) {
        let accounts = {};
        let fa = [];
        Object.keys(resp).forEach((accountName) => {
          fa.push(addressesRPC.getAddressesByAccount(accountName)
                  .then(function (resp) {
                    // initial setting of labels
                    let ads = resp.map((e) => {
                      return { label: '', hash: e };
                    });
                    return { accountName: accountName, addresses: ads };
                  })
                  .catch(function (err) {
                    // TODO Handle error correctly.
                    console.error(err);
                  })
                 );
        });
        let accountArray = Promise.all(fa)
            .then((result) => {
              // expects addresses to exist from result

              // on load before calling this mutating action perhaps
              if (electronStore.has('Accounts')) {
                commit('setAccountAddressList', electronStore.get('Accounts'));
              }

              if (state.accountAddressList.length == 0) {
                commit('setAccountAddressList', result);
                electronStore.set('Accounts', result);
              } else { // add addresses if missing
                commit('appendAccountAddressList', result);
                electronStore.set('Accounts', state.accountAddressList);
              }

            });
        return accountArray;
      })
      .catch(function (err) {
        // TODO Handle error correctly.
        console.error(err);
      });
  },

  // update Receiving Address Label
  editReceivingAddressLabel({ commit }, { receivingAddress, label}) {
    commit('editReceivingAddressLabel', { receivingAddress, label });
  },

  getStoredSendingAddressList( { commit, getters }) {
    if ( getters.getSendingAddressList.length === 0 ) {
      commit('setSendingAddressList', electronStore.get('SendingAddressList'));
    }
  },

  addSendingAddress( { commit }, payload ) {
    commit('addSendingaddress', payload);
  },

  editSendingAddress( { commit }, { sendingAddress, labelVal, hashVal } ) {
    commit('editSendingAddress', { sendingAddress, hash: hashVal, label: labelVal});
  },

  removeSendingAddress( { commit }, sendingAddress ) {
    commit('removeSendingAddress', sendingAddress)
  }

};

const mutations = {
  setOddsFormat(state, format) {
    state.oddsFormat = format;
  },

  setShowNetworkShare(state, value) {
    state.showNetworkShare = value;
    electronStore.set('showNetworkShare', state.showNetworkShare);
  },
  setAccountList(state, list) {
    state.accountList = list;
  },
  setAccountAddressList(state, list) {
    state.accountAddressList = list;
  },
  appendAccountAddressList(state, result) {
    result.forEach(account => {
      // add account if not there
      let indexOfAccount = state.accountAddressList.findIndex(
        x => x.accountName === account.accountName
      );

      if (indexOfAccount == -1) {
        state.accountAddressList.push({
          accountName: account.accountName,
          addresses: []
        });
        indexOfAccount = state.accountAddressList.findIndex(
          x => x.accountName == account.accountName
        );
      }

      account.addresses.forEach(address => {
        const i = state.accountAddressList[indexOfAccount].addresses.findIndex(
          e => {
            return e.address === address.address;
          }
        );

        if (i == -1) {
          // append address for account
          state.accountAddressList[indexOfAccount].addresses.push({
            label: '',
            address: address.address
          });
        }
      });
    });
  },
  editReceivingAddressLabel(state, { receivingAddress, label = receivingAddress.label }) {
    receivingAddress.label = label
    electronStore.set('Accounts', state.accountAddressList);
  },

  setSendingAddressList(state, addresses) {
    state.sendingAddressList = addresses;
    electronStore.set('SendingAddressList', state.sendingAddressList);
  },

  addSendingaddress(state, sendingAddress) {
    state.sendingAddressList.push(sendingAddress)
    electronStore.set('SendingAddressList', state.sendingAddressList);
  },

  //editSendingaddress
  editSendingAddress(state, {sendingAddress, label = sendingAddress.label, hash = sendingAddress.hash}) {
    sendingAddress.label = label
    sendingAddress.hash = hash
    electronStore.set('SendingAddressList', state.sendingAddressList);
  },
  removeSendingAddress(state, sendingAddress ) {
    state.sendingAddressList.splice(state.sendingAddressList.indexOf(sendingAddress), 1)
    electronStore.set('SendingAddressList', state.sendingAddressList);
  }

};

export default {
  state,
  getters,
  actions,
  mutations
};
