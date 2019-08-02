<template>
  <!-- Peerless bet List -->
  <div
v-if="plBetTransactionList.length === 0 && betTransactionsPaginated.length === 0"
class="no-transactions z-depth-2 text-center"
  >
  <p>Looks like a new wallet, no betting transactions to list!</p>
  
  <p>
  Jump to the
  <router-link class="router-link" tag="a" to="/betting"
  >betting tab</router-link
  >
  and start placing bets.
  </p>
  </div>
  
  <div v-else>
  <div class="row">
  <div class="input-field col s1">
  <select class="input-field"
v-model="limit"
  >
  <option :value="3">3</option>
  <option :value="6">6</option>
  <option :value="100">100</option>
  <option :value="10000">All</option>
  </select>
  <label>List</label>
  </div>
  <paginate
v-model="pageSelected"
:pageCount="pageCounted"
:pageRange="limit"
:clickHandler="setPage"
:prevText="'Prev'"
:nextText="'Next'"
:containerClass="'pagination'"
:pageClass="'waves-effect'"
:hide-prev-next="true">
  </paginate>
  <a v-if="transactionMax === -1 && (pageSelected === pageCount)"
@click="nextLot"
  >Next</a>
  </div>
  <table class="main-table card z-depth-2">
  <thead>
  <tr>
  <th class="hide-on-small-only">Event ID</th>
  
  <th class="hide-on-med-and-down">Transaction ID</th>
  
  <th class="">Start Time</th>
  
  <th class="hide-on-med-and-down show-on-large">Bet Outcome</th>
  
  <th class="">Home</th>
  
  <th class="">Away</th>
  
  <th class="">
  {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }} Amount
</th>
  
  <th class="">Result</th>
  </tr>
  </thead>
  
  <tbody>
  <tr v-for="tx in betTransactionsPaginated" :key="tx.id">
  <td class="hide-on-small-only">{{ tx['event-id'] }}</td>
  
  <td class="hide-on-small-only">
  <a
v-clipboard="tx['tx-id']"
@click="copiedAlert()"
class="transaction-list-link tooltipped"
data-position="bottom"
data-tooltip="Copy"
  >
  <i class="far fa-copy"></i>
  </a>
  
  <a
@click="blockExplorerUrl(tx['tx-id'])"
class="transaction-list-link tooltipped"
data-position="bottom"
data-tooltip="Open in block explorer"
  >
  <i class="fas fa-link"></i>
  </a>
  </td>
  
  <td class="hide-on-small-only">
  {{ Number(tx.starting) | moment('timezone', getTimezone, 'LLL') }}
</td>
  
  <td class="hide-on-med-and-down show-on-large">
  {{ outcomeToText(tx['team-to-win']) }}
</td>
  
  <td class="hide-on-small-only">{{ tx['home'] }}</td>
  
  <td class="hide-on-small-only">{{ tx['away'] }}</td>
  
  <td class="">{{ tx.amount }}</td>
  
  <td class="hide-on-small-only">{{ tx['result'] }}</td>
  </tr>
  </tbody>
  </table>
<<<<<<< HEAD:src/renderer/components/BetHistory/BetTransactionList.vue
</div>
</template>

<script>
import Vuex from 'vuex';
import {
  testnetParams,
  mainnetParams
} from '../../../main/constants/constants';
=======
  </div>
  </template>
  
  <script>
  import Vuex from 'vuex';
>>>>>>> wip handling async load for paginated bettransactions:src/renderer/components/bets/components/BetTransactionList.vue
import constants from '../../../../main/constants/constants';
// Test:
import ElectronStore from 'electron-store';
import Paginate from 'vuejs-paginate';

export default {
  name: 'BetTransactionList',
  
  components: { Paginate },
  
  computed: {
    ...Vuex.mapGetters([
      'plBetTransactionList',
      'getNetworkType',
      'getTimezone',
      'betTransactionsPaginated',
      'transactionMax'
    ]),
    pageCounted: function() {
      this.pageCount = Math.round(this.betTransactionsPaginated.length / this.limit);
      if ((this.pageCount * this.limit) < this.betTransactionsPaginated.length) this.pageCount += 1;
      return this.pageCount
    }
  },
  
  methods: {
    ...Vuex.mapActions([
      'getAccountAddress',
      'getPLBetTransactionList',
      'getBetTransactionListTest'
    ]),
    
    setPage: function(pageNum) {
      let start = 0;
      if (pageNum > 1) {
        start = this.limit * (pageNum);
        start -= this.limit;
      }
      console.log("transactions", this.betTransactionsPaginated)
      console.log("tlist", this.tlist)
      // this.tlist = this.betTransactionsPaginated.slice(start, start + this.limit)
    },
    
    // nextL: function() {
    //   console.log("go")
    //   this.loadPagination();
    //   if (this.transactionMax === -1 && (this.pageSelected === this.pageCount)) {
    //     this.pageSelected = this.pageCount + 1;
    //   } else {
    //     this.pageSelected = this.pageCount;
    //   }
    //   this.setPage(this.pageSelected);
    // },
    
    nextLot: function() {
      if (this.transactionMax === -1) {
        this.loadPagination();
        if (this.transactionMax === -1 && (this.pageSelected === this.pageCount)) {
          this.pageSelected = this.pageCount + 1;
        } else {
          this.pageSelected = this.pageCount;
        }
        this.setPage(this.pageSelected);
      }
    },
    
    // Convert the interger
    outcomeToText: function(outcome) {
      switch (outcome) {
      case 1:
        return 'Money Line Home';
      case 2:
        return 'Money Line Away';
      case 3:
        return 'Money Line Draw';
      case 4:
        return 'Home to Cover Spread';
      case 5:
        return 'Away to Cover Spread';
      case 6:
        return 'Total Over';
      case 7:
        return 'Total Under';
      default:
        return outcome;
      }
    },
    
    blockExplorerUrl(txId) {
      let shell = require('electron').shell;
      let explorerUrl =
<<<<<<< HEAD:src/renderer/components/BetHistory/BetTransactionList.vue
        this.getNetworkType === 'Testnet'
          ? testnetParams.BLOCK_EXPLORER_URL
          : mainnetParams.BLOCK_EXPLORER_URL;

=======
          this.getNetworkType === 'Testnet'
          ? constants.TESTNET_EXP_URL
          : constants.MAINNET_EXP_URL;
      
>>>>>>> wip handling async load for paginated bettransactions:src/renderer/components/bets/components/BetTransactionList.vue
      shell.openExternal(explorerUrl + '/#/tx/' + txId);
    },
    
    loadPagination: function() {
      let from = this.betTransactionsPaginated.length === 0 ? 0 : this.betTransactionsPaginated.length;
      let length = this.betTransactionlistLength
      this.getPLBetTransactionList({length: length, rexg: '*', from: from, filter: ''})
    }
  },

  data() {
    return {
      timeout: 0,
      // transactionsPaginated: [],
      // tlist: [],
      transactionLimit: 0,
      limit: 3,
      pageCount: 0,
      pageSelected: 1,
      betTransactionlistLength: 3,
      // transactionMax: -1
    };
  },

  watch: {
    limit: function(val) {
      this.pageSelected = 1;
      this.setPage(1)
      this.limit
    }
  },

  async created() {
    await this.loadPagination();
    await this.setPage(1);
  },
  
  mounted() {
    // Ping the get bets RPC method every 5 secs to show any new bet transactions.
    // let electronStore = new ElectronStore()
    // this.transactionsPaginated = electronStore.get('betTransactions');
    this.timeout = setInterval(
      async function() {
        // Todo: add filter and then retrieve
        // await this.loadPagination();
      }.bind(this),
      2000
    );
  },

  destroyed() {
    clearInterval(this.timeout);
  }
};
</script>
