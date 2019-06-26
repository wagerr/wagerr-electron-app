// Import the required libs.
import moment from 'moment';
import moment_timezone from 'moment-timezone';
import ElectronStore from "electron-store";

// Current odds formats for Wagerr.
const OddsFormat = {
  fraction: 0,
  decimal: 1
};

const electronStore = new ElectronStore();

const state = function() {
  return {
    timezone: moment.tz.guess(),
    oddsFormat: OddsFormat.decimal
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
  }
};

const actions = {
  updateOddsFormat({ commit, state }, format) {
    commit('setOddsFormat', format);
    electronStore.set('oddsFormat', state.oddsFormat);
  },

  loadUserSettings({ dispatch }) {
    if (electronStore.has('oddsFormat')) { // just oddsFormat for now, could have list of keys
      dispatch('updateOddsFormat', Number(electronStore.get('oddsFormat')));
    }
  }
};

const mutations = {
  setOddsFormat(state, format) {
    if (OddsFormat.fraction === format) {
      state.oddsFormat = OddsFormat.fraction;
    } else {
      state.oddsFormat = OddsFormat.decimal;
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
