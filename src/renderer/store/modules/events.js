import moment from 'moment';
import wagerrRPC from '@/services/api/wagerrRPC';

const initialState = {
  eventsSportFilter: '',
  eventsTournamentFilter: '',
  eventsList: {},
  eventsListFiltered: {}
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
  },

  eventsListFiltered: state => {
    return state.eventsListFiltered;
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
  updateEventsSportFilter({ commit }, sport) {
    commit('setEventsSportFilter', sport);
  },
  updateEventsTournamentFilter({ commit }, tournament) {
    commit('setEventsTournamentFilter', tournament);
  },

  // TODO it would be nice to be able to send empty/null parameters to the rpc api, now we have to call twice to the library like below (code duplication):
  // * One option is to modify wagerrd-rpc library so it ignores null/undefined parameters, the only caveat is that all parameters after a null have to be null as well
  // * Another option is to modify the endpoint so it can interpret some string as an empty value
  listEvents({ dispatch, commit, state }) {
    return new Promise((resolve, reject) => {
      // If there is a sport filter we make two calls to the daemon. 1) Fetch the filtered list so
      // the UI can show just the filtered list. 2) Fetch the full list, because we need to keep
      // the bet slip updated with the latest odds which could come from an event not in the
      // filtered list.
      if (state.eventsSportFilter) {
        wagerrRPC.client
          .listEvents(state.eventsSportFilter)
          .then((resp) => {
            // We filter events and update the cache
            let events = filterEventsForCache(resp.result);
            dispatch('updateEventsDataCache', events, { root: true });

            // We filter events that will be shown to the user
            events = filterEventsByTournament(events, state.eventsTournamentFilter);
            commit('setEventsListFiltered', events);

            resolve();
          })
          .catch((err) => {
            treatListEventErr(err, reject);
            reject(err);
          });
      }

      wagerrRPC.client
        .listEvents()
        .then((resp) => {
          // We filter events and update the cache
          let events = filterEventsForCache(resp.result);

          if (!state.eventsSportFilter) {
            dispatch('updateEventsDataCache', events, {root: true});
          }

          // We filter events that will be shown to the user
          events = filterEventsByTournament(events, state.eventsTournamentFilter);
          commit('setEventsList', events);

          if (!state.eventsSportFilter) {
            commit('setEventsListFiltered', events);
          }

          resolve();
        })
        .catch((err) => {
          treatListEventErr(err, reject);
          reject(err);
        });
    });
  },
  // TODO: remove, used for testing atm, because, no tests
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
  },

  setEventsListFiltered(state, eventsListFiltered) {
    state.eventsListFiltered = eventsListFiltered;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
