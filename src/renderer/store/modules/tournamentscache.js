const state = {
  tournamentsBySport: new Map()
};

const getters = {
  getTournaments: state => sport => {
    return [...state.tournamentsBySport.get(sport)];
  },
  hasTournaments: state => sport => {
    const tournamentsSet = state.tournamentsBySport.get(sport);
    return tournamentsSet && tournamentsSet.size > 0;
  }
};

const actions = {
  updateTournaments({commit}, events) {
    commit('updateTournaments', events);
  }  
};

const mutations = {
  updateTournaments(state, events) {
    let tournamentsBySport = new Map();

    events.forEach(event => {
      let tournaments = tournamentsBySport.get(event.sport);
      
      if (tournaments) {
        tournaments.add(event.tournament);
      } else {
        tournaments = new Set([event.tournament]);
      }

      tournamentsBySport.set(event.sport, new Set([...tournaments].sort()));      
    });

    state.tournamentsBySport = new Map([...tournamentsBySport, ...state.tournamentsBySport]);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};