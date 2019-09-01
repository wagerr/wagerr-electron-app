import moment from 'moment';
import wagerrRPC from '@/services/api/wagerrRPC';

const state = function() {
  return {
    eventsSportFilter: '',
    eventsTournamentFilter: '',
    eventsList: {}
  };
};

const getters = {
  getEventsSportFilter: state => {
    return state.eventsSportFilter;
  },
  getEventsTournamentFilter: state => {
    return state.eventsTournamentFilter;
  },

  eventsList: state => {
    return state.eventsList;
  }
};

function filterListEvents(events, state) {
  // Filter events that are expired (15 mins before event start time)
  return events.filter(e => {
    // Prevent events that:
    // - start in less than 12 mins 
    // - and events starting outside the two weeks listed.
    // - events belonging to a tournament different to the filter
    return  e.starting - 12 * 60 > moment().unix() &&
            e.starting < moment().add(13, 'days').unix() &&
            (!state.eventsTournamentFilter || e.tournament === state.eventsTournamentFilter)

  }).sort((x, y) => { x.starting - y.starting });  
}

function treatListEventErr(err) {
  // TODO Handle `err` properly.
  console.error(err);
}

const actions = {
  updateEventsSportFilter({ commit, state }, sport) {
    commit('setEventsSportFilter', sport);
  },
  updateEventsTournamentFilter({ commit, state }, tournament) {
    commit('setEventsTournamentFilter', tournament);
  },
  
  //TODO it would be nice to be able to send empty/null parameters to the rpc api, now we have to call twice to the library like below (code duplication):
  // * One option is to modify wagerrd-rpc library so it ignores null/undefined parameters, the only caveat is that all parameters after a null have to be null as well
  // * Another option is to modify the endpoint so it can interpret some string as an empty value
  listEvents({ dispatch, commit, state }, filter) {
    return new Promise((resolve, reject) => {
      if (state.eventsSportFilter) {
        wagerrRPC.client
          .listEvents(state.eventsSportFilter)
          .then(function(resp) {
            let events = filterListEvents(resp.result, state);
            commit('setEventsList', events);
            dispatch('updateTournaments', events, { root: true });
            resolve();
          })
          .catch(function(err) {
            treatListEventErr(err, reject);
            reject(err);            
          });
      } else {
        wagerrRPC.client
          .listEvents()
          .then(function(resp) {
            let events = filterListEvents(resp.result, state);
            commit('setEventsList', events);
            dispatch('updateTournaments', events, { root: true });
            resolve();
          })
          .catch(function(err) {
            treatListEventErr(err, reject);
            reject(err);            
          });
      }
    });
  },
  // Todo: remove, used for testing atm, because, no tests
  testlistEvents({ commit, state, getters }) {
    // es = new ElectronStore()
    // preferences.set("eventsList", getters.eventsList);
    // commit('setEventsList',es.get("eventsList"));
  }
};

const mutations = {
  setEventsSportFilter(state, sport) {
    state.eventsSportFilter = sport;
    state.eventsTournamentFilter = '';
  },

  setEventsTournamentFilter(state, tournament) {
    state.eventsTournamentFilter = tournament;
  },

  setEventsList(state, eventsList) {
    state.eventsList = eventsList;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
