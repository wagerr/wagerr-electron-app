// Vue components
import Vue from 'vue';
import Router from 'vue-router';
// Main Components
import Wallet from './views/Wallet.vue';
import BetHistory from './views/BetHistory.vue';
import Betting from './views/Betting.vue';
import ChainGames from '@/components/betting/ChainGames';
import Tools from './views/Tools.vue';
import Preferences from './views/Preferences.vue';
// Tool Components
import Information from '@/components/tools/Information';
import AddressBook from '@/components/tools/AddressBook';
import SignVerifyMessage from '@/components/tools/SignVerifyMessage';
import Network from '@/components/tools/Network';
import Peers from '@/components/tools/Peers.vue';
import WalletRepair from '@/components/tools/WalletRepair';

// Inject the router into the app.
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Wallet },
    { path: '/bet_history', component: BetHistory },
    { path: '/betting', component: Betting },
    { path: '/chain_games', component: ChainGames },
    {
      path: '/tools/',
      component: Tools,
      children: [
        { path: 'info', component: Information },
        { path: 'network', component: Network },
        { path: 'address_book', component: AddressBook },
        { path: 'sign_verify_message', component: SignVerifyMessage },
        { path: 'peers', component: Peers },
        { path: 'wallet_repair', component: WalletRepair }
      ]
    },
    { path: '/preferences', component: Preferences },
    { path: '*', redirect: '/' }
  ]
});
