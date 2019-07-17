// Import the required libs.
import moment from 'moment';
import moment_timezone from 'moment-timezone';
import ElectronStore from 'electron-store';
import oddsConverter from '@/utils/oddsConverter.js';

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
    showFee: false
  };
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
  },
  getShowFee: state => {
    return state.showFee;
  }
};

const actions = {
  updateOddsFormat({ commit, state }, format) {
    commit('setOddsFormat', format);
    electronStore.set('oddsFormat', state.oddsFormat);
  },

  loadUserSettings({ dispatch }) {
    if (electronStore.has('oddsFormat')) {
      // just oddsFormat for now, could have list of keys
      dispatch('updateOddsFormat', Number(electronStore.get('oddsFormat')));
    }
  },

  toggleShowFee({ commit, state }) {
    commit('setShowFee', !state.showFee)
  }
};

const mutations = {
  setOddsFormat(state, format) {
    state.oddsFormat = format;
  },

  setShowFee(state, value) {
    state.showFee = value
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
