import wagerrRPC from '@/services/api/wagerrRPC';
import moment from 'moment';

const state = function() {
  return {
    eventsFilter: '',
    eventsList: {}
  };
};

const getters = {
  getEventsFilter: state => {
    return state.eventsFilter;
  },

  eventsList: state => {
    return state.eventsList;
  }
};

const actions = {
  updateEventsFilter({ commit, state }, filter) {
    commit('setEventsFilter', filter);
  },

  // Todo - marty: remove code duplication!
  listEvents({ commit, state }, filter) {
    return new Promise((resolve, reject) => {
      if (filter) {
        wagerrRPC.client
          .listEvents(filter)
          .then(function(resp) {
            // Filter events that are expired (15 mins before event start time)
            const filteredList = [];
            const numEvents = resp.result.length;

            for (let i = 0; i < numEvents; i++) {
              // Prevent events that are starting in less than 12 mins and events starting outside the two weeks listed.
              if (
                resp.result[i].starting - 12 * 60 > moment().unix() &&
                resp.result[i].starting <
                  moment()
                    .add(13, 'days')
                    .unix()
              ) {
                filteredList.push(resp.result[i]);
              }
            }

            // Sort events by start time.
            filteredList.sort(function(x, y) {
              return x.starting - y.starting;
            });

            commit('setEventsList', filteredList);
            resolve();
          })
          .catch(function(err) {
            // TODO Handle `err` properly.
            console.error(err);
            reject(err);
          });
      } else {
        wagerrRPC.client
          .listEvents()
          .then(function(resp) {
            // Filter events that are expired (15 mins before event start time)
            const filteredList = [];
            const numEvents = resp.result.length;

            for (let i = 0; i < numEvents; i++) {
              // Prevent events that are starting in less than 12 mins and events starting outside the two weeks listed.
              if (
                resp.result[i].starting - 12 * 60 > moment().unix() &&
                resp.result[i].starting <
                  moment()
                    .add(13, 'days')
                    .unix()
              ) {
                filteredList.push(resp.result[i]);
              }
            }

            // Sort events by start time.
            filteredList.sort(function(x, y) {
              return x.starting - y.starting;
            });

            commit('setEventsList', filteredList);
            resolve();
          })
          .catch(function(err) {
            // TODO Handle `err` properly.
            console.error(err);
            reject(err);
          });
      }
    });
  }
};

const mutations = {
  setEventsFilter(state, filter) {
    state.eventsFilter = filter;
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
