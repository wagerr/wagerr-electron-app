// Import the required libs.
import moment from 'moment';
import moment_timezone from 'moment-timezone';
import ElectronStore from "electron-store";
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
  },
  convertOdds: state => (val) => {
    if (state.oddsFormat === OddsFormat.decimal){
      return oddsConverter.toDecimal(val);
    } else if (state.oddsFormat === OddsFormat.fraction){
      return oddsConverter.toFraction(val);
    } else if (state.oddsFormat === OddsFormat.american){
      return oddsConverter.toAmerican(val);
    } else {
      return oddsConverter.toDecimal(val);
    }
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
  },
  convertOdds({commit, dispatch}, val) {
    if (state.oddsFormat === OddsFormat.decimal){
      // return oddsConverter.toDecimal(val);
    } else if (state.oddsFormat === OddsFormat.fraction){
      // } else if (this.getOddsFormat === this.getOddsFormats.fraction){
      // return oddsConverter.toFraction(val);
    } else if (state.oddsFormat === OddsFormat.american){
      // } else if (this.getOddsFormat === this.getOddsFormats.american){
      // return oddsConverter.toAmerican(val);
    }
    return oddsConverter.toDecimal(15000);
  }

};

const mutations = {
  setOddsFormat(state, format) {
    state.oddsFormat = format;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
