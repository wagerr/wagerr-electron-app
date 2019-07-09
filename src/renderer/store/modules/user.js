// Import the required libs.
import moment from 'moment';
import oddsConverter from '@/utils/oddsConverter';
import addressesRPC from '@/services/api/addresses_rpc';
import { preferences, addressBook } from '@/services/api/preferences';

import constants from '../../../main/constants/constants';

// Current odds formats for Wagerr.
const OddsFormat = {
  fraction: 0,
  decimal: 1,
  american: 2
};

const state = function() {
  return {
    timezone: moment.tz.guess(),
    oddsFormat: OddsFormat.decimal,
    showNetworkShare: false,
    accountList: [],
    receivingAddressList: [],
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
  getReceivingAddressList: state => {
    return state.receivingAddressList;
  },
  getSendingAddressList: state => {
    return state.sendingAddressList;
  }
};

const actions = {
  updateOddsFormat({ commit, state }, format) {
    commit('setOddsFormat', format);
    preferences.set('oddsFormat', state.oddsFormat);
  },

  // Todo: check if need other user settings loaded
  loadUserSettings({ dispatch, getters }) {
    if (preferences.has('oddsFormat')) {
      dispatch('updateOddsFormat', Number(preferences.get('oddsFormat')));
    }
    if (preferences.has('showNetworkShare')) {
      dispatch(
        'updateShowNetworkShare',
        Number(preferences.get('showNetworkShare'))
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
      // eslint-disable-next-line func-names
      .then(function(resp) {
        const fa = [];
        Object.keys(resp).forEach(accountName => {
          fa.push(
            addressesRPC
              .getAddressesByAccount(accountName)
              .then(function(resp) {
                // initial setting of labels
                const ads = resp.map(e => {
                  return { label: '', hash: e };
                });
                return { account_name: accountName, addresses: ads };
              })
              .catch(function(err) {
                // TODO Handle error correctly.
                console.error(err);
              })
          );
        });
        const accountArray = Promise.all(fa).then(result => {
          // expects addresses to exist from result

          // on load before calling this mutating action perhaps
          if (addressBook.has('receiving_addresses')) {
            commit('setReceivingAddressList', addressBook.get('receiving_addresses'));
          }

          if (state.receivingAddressList.length == 0) {
            commit('setReceivingAddressList', result);
            addressBook.set('receiving_addresses', result);
          } else {
            // add addresses if missing
            commit('appendReceivingAddressList', result);
            addressBook.set('receiving_addresses', state.receivingAddressList);
          }
        });
        return accountArray;
      })
      .catch(function(err) {
        // TODO Handle error correctly.
        console.error(err);
      });
  },

  // update Receiving Address Label
  editReceivingAddressLabel({ commit }, { receivingAddress, label }) {
    commit('editReceivingAddressLabel', { receivingAddress, label });
  },

  getStoredSendingAddressList({ commit, getters }) {
    if (
      getters.getSendingAddressList.length === 0 &&
      addressBook.has('sending_addresses')
    ) {
      commit('setSendingAddressList', addressBook.get('sending_addresses'));
    }
  },

  addSendingAddress({ commit }, payload) {
    commit('addSendingAddress', payload);
  },

  editSendingAddress({ commit }, { sendingAddress, labelVal, hashVal }) {
    commit('editSendingAddress', {
      sendingAddress,
      hash: hashVal,
      label: labelVal
    });
  },

  removeSendingAddress({ commit }, sendingAddress) {
    commit('removeSendingAddress', sendingAddress);
  }
};

const mutations = {
  setOddsFormat(state, format) {
    state.oddsFormat = format;
  },

  setShowNetworkShare(state, value) {
    state.showNetworkShare = value;
    preferences.set('showNetworkShare', state.showNetworkShare);
  },
  setAccountList(state, list) {
    state.accountList = list;
  },
  setReceivingAddressList(state, list) {
    state.receivingAddressList = list;
  },
  appendReceivingAddressList(state, result) {
    result.forEach(account => {
      // add account if not there
      let indexOfAccount = state.receivingAddressList.findIndex(
        x => x.accountName === account.accountName
      );

      if (indexOfAccount == -1) {
        state.receivingAddressList.push({
          accountName: account.accountName,
          addresses: []
        });
        indexOfAccount = state.receivingAddressList.findIndex(
          x => x.accountName == account.accountName
        );
      }

      account.addresses.forEach(address => {
        const i = state.receivingAddressList[
          indexOfAccount
        ].addresses.findIndex(e => {
          return e.address === address.address;
        });

        if (i == -1) {
          // append address for account
          state.receivingAddressList[indexOfAccount].addresses.push({
            label: '',
            address: address.address
          });
        }
      });
    });
  },
  editReceivingAddressLabel(state, { receivingAddress, label = receivingAddress.label }) {
    receivingAddress.label = label;
    addressBook.set('receiving_addresses', state.receivingAddressList);
  },

  setSendingAddressList(state, addresses) {
    state.sendingAddressList = addresses;
    addressBook.set('sending_addresses', state.sendingAddressList);
  },

  addSendingAddress(state, sendingAddress) {
    state.sendingAddressList.push(sendingAddress);
    addressBook.set('sending_addresses', state.sendingAddressList);
  },

  // editSendingaddress
  editSendingAddress(state, { sendingAddress, label = sendingAddress.label, hash = sendingAddress.hash }) {
    sendingAddress.label = label;
    sendingAddress.hash = hash;
    addressBook.set('sending_addresses', state.sendingAddressList);
  },

  removeSendingAddress(state, sendingAddress) {
    state.sendingAddressList.splice(state.sendingAddressList.indexOf(sendingAddress),1);
    addressBook.set('sending_addresses', state.sendingAddressList);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
