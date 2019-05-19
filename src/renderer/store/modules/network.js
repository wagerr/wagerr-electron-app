import networkRPC from '@/services/api/network_rpc';
import masternodeRPC from '@/services/api/masternode_rpc';

const state = function() {
  return {
    network: '',
    connections: 0,
    peersList: {},
    masternodes: 0,
    blocks: 0,
    moneySupply: 0,
    protocolVersion: 0,
    networkVersion: '',
    stakingStatus: false,
    msyncStatus: false,
    chainSyncStatus: false,
    peerInfo: {},
    bannedInfo: {}
  };
};

const getters = {
  getNetworkType: state => {
    return state.network;
  },

  getNumConnections: state => {
    return state.connections;
  },

  getNumMasternodes: state => {
    return state.masternodes;
  },

  getBlocks: state => {
    return state.blocks;
  },

  getMoneySupply: state => {
    return state.moneySupply;
  },

  getProtocolVersion: state => {
    return state.protocolVersion;
  },

  getNetworkVersion: state => {
    return state.networkVersion;
  },

  getStakingStatus: state => {
    return state.stakingStatus;
  },

  getMsyncStatus: state => {
    return state.msyncStatus;
  },

  getChainSyncStatus: state => {
    return state.chainSyncStatus;
  },

  getPeerInfo: state => {
    return state.peerInfo;
  },

  getBannedInfo: state => {
    return state.bannedInfo;
  }
};

const actions = {
  updateNetworkType({ commit }, network) {
    commit('setNetworkType', network);
  },

  updateNumConnections({ commit }, connections) {
    commit('setNumConnections', connections);
  },

  updateNumMasternodes({ commit }) {
    networkRPC
      .getMasterNodeNum()
      .then(function(resp) {
        commit('setNumMasternodes', resp.total);
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  updateBlocks({ commit }, blocks) {
    commit('setBlocks', blocks);
  },

  updateInfo({ commit }) {
    networkRPC
      .getInfo()
      .then(function(resp) {
        commit('setBlocks', resp.result.blocks);
        commit('setNumConnections', resp.result.connections);
        commit('setMoneySupply', resp.result.moneysupply);
        commit('setProtocolVersion', resp.result.protocolversion);
        commit('setNetworkVersion', resp.result.version);
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  updateStakingStatus({ commit }) {
    networkRPC
      .getStakingStatus()
      .then(function(resp) {
        commit('setStakingStatus', resp['staking status']);
        commit('setMsyncStatus', resp.mnsync);
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  updatePeerInfo({ commit }) {
    networkRPC
      .getPeerInfo()
      .then(function(resp) {
        commit('setPeerInfo', resp);
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  updateBannedInfo({ commit }) {
    networkRPC
      .getBannedInfo()
      .then(function(resp) {
        commit('setBannedInfo', resp.result);
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  updateChainSyncStatus({ commit }) {
    masternodeRPC
      .getMNSyncStatus()
      .then(function(resp) {
        commit('setChainSynced', resp.IsBlockchainSynced);
      })
      .catch(function(err) {
        console.error(err);
      });
  }
};

const mutations = {
  setNetworkType(state, network) {
    state.network = network;
  },

  setNumConnections(state, connections) {
    state.connections = connections;
  },

  setNumMasternodes(state, masternodes) {
    state.masternodes = masternodes;
  },

  setBlocks(state, blocks) {
    state.blocks = blocks;
  },

  setMoneySupply(state, supply) {
    state.moneySupply = supply;
  },

  setProtocolVersion(state, pv) {
    state.protocolVersion = pv;
  },

  setNetworkVersion(state, version) {
    state.networkVersion = version;
  },

  setStakingStatus(state, staking) {
    state.stakingStatus = staking;
  },

  setMsyncStatus(state, msync) {
    state.msyncStatus = msync;
  },

  setPeerInfo(state, peers) {
    state.peerInfo = peers;
  },

  setBannedInfo(state, banned) {
    state.bannedInfo = banned;
  },

  setChainSynced(state, synced) {
    state.chainSyncStatus = synced;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
