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

function filterEventsForCache(events) {
  // Filter events that are expired (15 mins before event start time)
  return events
    .filter(e => {
      // Prevent events that:
      // - start in less than 12 mins
      // - and events starting outside the two weeks listed.
      return (
        e.starting - 12 * 60 > moment().unix() &&
        e.starting <
          moment()
            .add(13, 'days')
            .unix() &&
        // We also filter all events that have 0/0/0 for all three markets odds
        !(
          e.odds[0].mlAway === 0 &&
          e.odds[0].mlDraw === 0 &&
          e.odds[0].mlHome === 0 &&
          e.odds[1].spreadAway === 0 &&
          e.odds[1].spreadHome === 0 &&
          e.odds[1].spreadPoints === 0 &&
          e.odds[2].totalsOver === 0 &&
          e.odds[2].totalsPoints === 0 &&
          e.odds[2].totalsUnder === 0
        )
      );
    })
    .sort((x, y) => x.starting - y.starting);
}

function filterEventsByTournament(events, tournamentFilter) {
  if (!tournamentFilter) return events;

  return events.filter(e => {
    // In case there is a tournament selected, we filter by the tournament
    return e.tournament === tournamentFilter;
  });
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

  // TODO it would be nice to be able to send empty/null parameters to the rpc api, now we have to call twice to the library like below (code duplication):
  // * One option is to modify wagerrd-rpc library so it ignores null/undefined parameters, the only caveat is that all parameters after a null have to be null as well
  // * Another option is to modify the endpoint so it can interpret some string as an empty value
  listEvents({ dispatch, commit, state }, filter) {
    return new Promise((resolve, reject) => {
      if (state.eventsSportFilter) {
        wagerrRPC.client
          .listEvents(state.eventsSportFilter)
          .then(function(resp) {
            // We filter events and update the cache
            let events = filterEventsForCache(resp.result);
            dispatch('updateEventsDataCache', events, { root: true });
            // We filter events that will be shown to the user
            events = filterEventsByTournament(
              events,
              state.eventsTournamentFilter
            );
            commit('setEventsList', events);
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
            // We filter events jand update the cache
            let events = filterEventsForCache(resp.result);
            dispatch('updateEventsDataCache', events, { root: true });
            // We filter events that will be shown to the user
            events = filterEventsByTournament(
              events,
              state.eventsTournamentFilter
            );
            commit('setEventsList', events);
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
