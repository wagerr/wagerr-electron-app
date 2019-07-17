// Import the required libs.
import moment from 'moment';
import moment_timezone from 'moment-timezone';
import ElectronStore from 'electron-store';
import oddsConverter from '@/utils/oddsConverter.js';

import constants from '../../../main/constants/constants';

// Current odds formats for Wagerr.
const OddsFormat = {
  fraction: 0,
  decimal: 1,
  american: 2
};

const electronStore = new ElectronStore();

const state = function() {
  return {
    timezone: moment.tz.guess(),
    oddsFormat: OddsFormat.decimal,
    showNetworkShare: false
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
  }
};

const mutations = {
  setOddsFormat(state, format) {
    state.oddsFormat = format;
  },

  setShowNetworkShare(state, value) {
    state.showNetworkShare = value;
    electronStore.set('showNetworkShare', state.showNetworkShare);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
