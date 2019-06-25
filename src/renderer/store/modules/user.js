// Import the required libs.
import moment from 'moment';
import moment_timezone from 'moment-timezone';

// Current odds formats for Wagerr.
const OddsFormat = {
  fraction: 0,
  decimal: 1
};

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
  updateOddsFormat({ commit }, format) {
    commit('setOddsFormat', format);
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
