const defaultData = {
  perPage: 100,
  currentPage: 1
};

const state = function() {
  return {
    wallet: { ...defaultData },
    betHistory: { ...defaultData }
  };
};

const getters = {
  getPaginationState: state => view => {
    return state[view];
  },

  getPaginationParams: state => view => {
    let params = state[view];
    return { from: (params.currentPage - 1) * params.perPage, length: params.perPage };
  }
};

const mutations = {
  setPerPage(state, { view, perPage}) {
    state[view].perPage = perPage;
  },
  setCurrentPage(state, { view, currentPage}) {
    state[view].currentPage = currentPage;
  }
};

export default {
  state,
  getters,
  mutations
};
