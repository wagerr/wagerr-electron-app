const state = {
  tournamentsBySport: new Map(),
  nEventsBySport: new Map()
};

const getters = {
  getTournaments: state => sport => {
    return [...state.tournamentsBySport.get(sport)];
  },
  hasTournaments: state => sport => {
    const tournamentsSet = state.tournamentsBySport.get(sport);
    return tournamentsSet && tournamentsSet.size > 0;
  },
  getNEvents: state => sport => {
    console.log('getNEVents', sport);
    const nEvents = state.nEventsBySport.get(sport);
    return nEvents === undefined ? 0 : nEvents;
  }
};

const actions = {
  updateEventsDataCache({commit}, events) {
    commit('updateEventsDataCache', events);
  }  
};

const mutations = {
  updateEventsDataCache(state, events) {
    let tournamentsBySport = new Map();
    let nEventsBySport = new Map();

    events.forEach(event => {
      treatTournament(event, tournamentsBySport);
      treatSport(event, nEventsBySport);
    });

    state.tournamentsBySport = new Map([...state.tournamentsBySport, ...tournamentsBySport]);
    state.nEventsBySport = new Map([...state.nEventsBySport, ...nEventsBySport]);
  }
};

function treatTournament(event, tournamentsBySport) {
  let tournaments = tournamentsBySport.get(event.sport);
      
  if (tournaments) {
    tournaments.add(event.tournament);
  } else {
    tournaments = new Set([event.tournament]);
  }

  tournamentsBySport.set(event.sport, new Set([...tournaments].sort()));      
}

function treatSport(event, nEventsBySport) {
  let nEvents = nEventsBySport.get(event.sport);
  let totalEvents = nEventsBySport.get('');
  
  nEvents = nEvents ? nEvents+1 : 1;
  totalEvents = totalEvents ? totalEvents+1 : 1;

  nEventsBySport.set(event.sport, nEvents);      
  nEventsBySport.set('', totalEvents);      
}

export default {
  state,
  getters,
  actions,
  mutations
};