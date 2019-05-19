// import networkRPC from "@/services/api/network_rpc";
// import masternodeRPC from "@/services/api/masternode_rpc";

const state = {
  recHistoryList: [],
  isConsoleVisible: false
};

const getters = {
  getrecHistoryList: state => {
    return state.recHistoryList;
  },
  getConsoleVisibleStatus: state => {
    return state.isConsoleVisible;
  }
};

const mutations = {
  setCommand(state, commandJson) {
    state.recHistoryList.push(commandJson);
  },
  setConsoleVisible(state) {
    state.isConsoleVisible = !state.isConsoleVisible;
  },
  clearRecHistoryList(state) {
    state.recHistoryList = [];
  }
};
const actions = {
  updateCommands({ commit }, commandJson) {
    commit('setCommand', commandJson);
  },
  updadteConsoleVisible({ commit }) {
    commit('setConsoleVisible');
  },
  clearRecHistoryList({ commit }) {
    commit('clearRecHistoryList');
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
