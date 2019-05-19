// Vue components
import Vue from 'vue';
import Router from 'vue-router';
// Main Components
import Betting from '@/Betting';
import Wallet from '@/Wallet';
import Bets from '@/Bets';
import Tools from '@/Tools';
// Tool Components
import Information from '@/components/tools/Information';
import Network from '@/components/tools/Network';
import Peers from '@/components/tools/Peers.vue';
import WalletRepair from '@/components/tools/WalletRepair';
// Betting Components
import Peerless from '@/components/betting/Peerless';
import H2H from '@/components/betting/H2H';
import ChainGames from '@/components/betting/ChainGames';

// Inject the router into the app.
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Wallet },
    { path: '/betting', component: Betting },
    { path: '/chain_games', component: ChainGames },
    { path: '/bets', component: Bets },
    {
      path: '/tools/',
      component: Tools,
      children: [
        {
          path: 'info',
          component: Information
        },
        {
          path: 'network',
          component: Network
        },
        {
          path: 'peers',
          component: Peers
        },
        {
          path: 'wallet_repair',
          component: WalletRepair
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
