import wagerrRPC from '@/services/api/wagerrRPC'

const state = function () {

    return {
        network: '',
        connections: 0,
        peersList: {},
        masternodes: 0,
        blocks: 0
    }

};

const getters = {

    getNetworkType: (state) => {
        return state.network == 'test' ? 'Testnet' : 'Mainnet';
    },

    getNumConnections: (state) => {
        return state.connections;
    },

    getNumMasternodes: (state) => {
        return state.masternodes;
    },

    getBlocks: (state) => {
        return state.blocks;
    }

};

const actions = {

    updateNetworkType ({commit}, network) {
        commit('setNetworkType', network);
    },

    updateNumConnections ({commit}, connections) {
        commit('setNumConnections', connections);
    },

    updateNumMasternodes ({commit}, masternodes) {
        commit('setNumMasternodes', masternodes);
    },

    updateBlocks ({commit}, blocks) {
        commit('setBlocks', blocks);
    }

};

const mutations = {

    setNetworkType (state, network) {
        state.network = network;
    },

    setNumConnections (state, connections) {
        state.connections = connections;
    },

    setNumMasternodes (state, masternodes) {
        state.masternodes = masternodes;
    },

    setBlocks (state, blocks) {
        state.blocks = blocks;
    }

};

export default {
    state,
    getters,
    actions,
    mutations
}