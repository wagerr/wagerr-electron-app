import Vue from 'vue';
import Vuex from 'vuex';
// Modules
import wallet from './modules/wallet';
import ui from './modules/ui';
import transactions from './modules/transactions';
import events from './modules/events';
import user from './modules/user';
import betSlip from './modules/betslip';
import cgBetSlip from './modules/cgbetslip';
import network from './modules/network';


Vue.use(Vuex)

export default new Vuex.Store({

    modules: {
        wallet,
        ui,
        events,
        user,
        betSlip,
        cgBetSlip,
        transactions,
        network
    },

    strict: true

})
