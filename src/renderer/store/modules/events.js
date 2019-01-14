import wagerrRPC from '@/services/api/wagerrRPC'

const state = function () {

    return {
        eventsList: {}
    }

};

const getters = {

    eventsList: (state) => {
        return state.eventsList
    }

};

const actions = {

    listEvents ({ commit, state }, filter) {
        if (filter) {
            wagerrRPC.client.listEvents(filter)
                .then(function (resp) {
                    commit('setEventsList', resp.result)
                })
                .catch(function (err) {
                    // TODO Handle `err` properly.
                    console.error(err)
                })
        }
        else {
            wagerrRPC.client.listEvents()
                .then(function (resp) {
                    //alert(JSON.stringify(resp[0].event_id))

                    commit('setEventsList', resp.result)
                })
                .catch(function (err) {
                    // TODO Handle `err` properly.
                    console.error(err)
                })
        }
    }

};

const mutations = {

    setEventsList (state, eventsList) {
        state.eventsList = eventsList
    }

};

export default {
    state,
    getters,
    actions,
    mutations
}
