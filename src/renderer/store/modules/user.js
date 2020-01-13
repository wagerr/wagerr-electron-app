// Import the required libs.
import moment from 'moment';
import store from '../../../common/store/store';
import oddsConverter from '@/utils/oddsConverter';
import addressesRPC from '@/services/api/addresses_rpc';

// Current odds formats for Wagerr.
const OddsFormat = {
  fraction: 0,
  decimal: 1,
  american: 2
};

const state = function() {
  return {
    oddsFormat: OddsFormat.decimal,
    languageLocale: '',
    formatLocale: '',
    timezoneOption: 'auto',
    timezone: moment.tz.guess(),
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
  getLanguageLocale: state => {
    return state.languageLocale;
  },
  getFormatLocale: state => {
    return state.formatLocale;
  },
  getTimezoneOption: state => {
    return state.timezoneOption;
  },
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
  updateFormatLocale({ commit, state }, {formatLocale}) {
    moment.locale(formatLocale);
    commit('setFormatLocale', formatLocale);
    store.preferences.set('formatLocale', state.formatLocale);
  },

  updateLanguageLocale({ commit, state }, {languageLocale, vm}) {
    vm.$i18n.locale = languageLocale;
    commit('setLanguageLocale', languageLocale);
    store.preferences.set('languageLocale', state.languageLocale);
  },

  updateOddsFormat({ commit, state }, format) {
    commit('setOddsFormat', format);
    store.preferences.set('oddsFormat', state.oddsFormat);
  },

  updateTimezoneOption({ commit, state }, timezoneOption) {
    commit('setTimezoneOption', timezoneOption);
    store.preferences.set('timezoneOption', state.timezoneOption);
  },

  updateTimezone({ commit, state }, timezone) {
    commit('setTimezone', timezone);
    store.preferences.set('timezone', state.timezone);
  },

  // Loaded on Splash screen
  loadUserSettings({ dispatch, getters }, vm) {
    if (store.preferences.has('oddsFormat')) {
      dispatch('updateOddsFormat', Number(store.preferences.get('oddsFormat')));
    }
    if (store.preferences.has('formatLocale')) {
      dispatch('updateFormatLocale', {formatLocale: store.preferences.get('formatLocale')});
    }
    if (store.preferences.has('languageLocale')) {
      dispatch('updateLanguageLocale', {languageLocale: store.preferences.get('languageLocale'), vm});
    }
    if (store.preferences.has('timezone')) {
      dispatch('updateTimezone', store.preferences.get('timezone'));
    }
    if (store.preferences.has('timezoneOption')) {
      // On launch and after setting the timezone value from the preferences
      // file, check if the timezone option preference is set to 'auto'. If it
      // is update the timezone value with a new guess at which timezone the
      // user is in. This solves the problem of a laptop user moving across
      // timezones or DST starting/ending.
      let tzOption = store.preferences.get('timezoneOption');
      dispatch('updateTimezoneOption', tzOption);
      if (tzOption === 'auto') {
        dispatch('updateTimezone', moment.tz.guess());
      }
    }
    if (store.preferences.has('showNetworkShare')) {
      dispatch(
        'updateShowNetworkShare',
        Number(store.preferences.get('showNetworkShare'))
      );
    }
  },

  toggleShowNetworkShare({ commit, state }) {
    commit('setShowNetworkShare', !state.showNetworkShare);
  },

  updateShowNetworkShare({ commit, state }, value) {
    commit('setShowNetworkShare', value);
  },

  // Loaded on created
  loadAddressbook({ dispatch, getters }) {
    dispatch('getWGRAcountList');
    dispatch('getStoredSendingAddressList');
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
                  return { label: '', address: e };
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
          if (store.addressBook.has('receiving_addresses')) {
            commit(
              'setReceivingAddressList',
              store.addressBook.get('receiving_addresses')
            );
          }

          if (state.receivingAddressList.length == 0) {
            commit('setReceivingAddressList', result);
            store.addressBook.set('receiving_addresses', result);
          } else {
            // add addresses if missing
            commit('appendReceivingAddressList', result);
            store.addressBook.set(
              'receiving_addresses',
              state.receivingAddressList
            );
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
      store.addressBook.has('sending_addresses')
    ) {
      commit(
        'setSendingAddressList',
        store.addressBook.get('sending_addresses')
      );
    }
  },

  addSendingAddress({ commit }, payload) {
    commit('addSendingAddress', payload);
  },

  editSendingAddress({ commit }, { sendingAddress, labelVal, hashVal }) {
    commit('editSendingAddress', {
      sendingAddress,
      label: labelVal,
      address: hashVal
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
  setLanguageLocale(state, languageLocale) {
    state.languageLocale = languageLocale;
  },
  setFormatLocale(state, formatLocale) {
    state.formatLocale = formatLocale;
  },
  setTimezoneOption(state, timezoneOption) {
    state.timezoneOption = timezoneOption;
  },
  setTimezone(state, timezone) {
    state.timezone = timezone;
  },
  setShowNetworkShare(state, value) {
    state.showNetworkShare = value;
    store.preferences.set('showNetworkShare', state.showNetworkShare);
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

        if (i === -1) {
          // append address for account
          state.receivingAddressList[indexOfAccount].addresses.push({
            label: '',
            address: address.address
          });
        }
      });
    });
  },
  editReceivingAddressLabel(
    state,
    { receivingAddress, label = receivingAddress.label }
  ) {
    receivingAddress.label = label;
    store.addressBook.set('receiving_addresses', state.receivingAddressList);
  },

  setSendingAddressList(state, addresses) {
    state.sendingAddressList = addresses;
    store.addressBook.set('sending_addresses', state.sendingAddressList);
  },

  addSendingAddress(state, sendingAddress) {
    state.sendingAddressList.push(sendingAddress);
    store.addressBook.set('sending_addresses', state.sendingAddressList);
  },

  // editSendingaddress
  editSendingAddress(
    state,
    {
      sendingAddress,
      label = sendingAddress.label,
      address = sendingAddress.address
    }
  ) {
    sendingAddress.label = label;
    sendingAddress.address = address;
    store.addressBook.set('sending_addresses', state.sendingAddressList);
  },

  removeSendingAddress(state, sendingAddress) {
    state.sendingAddressList.splice(
      state.sendingAddressList.indexOf(sendingAddress),
      1
    );
    store.addressBook.set('sending_addresses', state.sendingAddressList);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
