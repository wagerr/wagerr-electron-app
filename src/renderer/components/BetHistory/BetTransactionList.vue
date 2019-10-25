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
      <select
        v-model="limit"
        >
        <option v-for="limitt in limits" v-bind:value="parseInt(limitt.value)">
          {{ limitt.text }}
        </option>
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
    <ul class="pagination">
      <li>
        <a v-if="transactionMax === -1 && (pageSelected === pageCount)"
           tabIndex="0"
           @click="nextLot"
           >Next</a>
      </li>
    </ul>
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
      <tr v-for="tx in pagedList" :key="tx.id">
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
</div>
</template>

<script>
import Vuex from 'vuex';
import {
  testnetParams,
  mainnetParams
} from '../../../main/constants/constants';

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
      if (this.betTransactionsPaginated.length > (this.pageCount * this.limit)) this.pageCount += 1;
      return this.pageCount
    },
    pagedList: function() {
      // didn't go in on init
      if (this.pageSelected === 0) { // on init
        console.log("first page")
        return this.betTransactionsPaginated
      } else {
        let start = 0;
        start = this.limit * (this.pageSelected);
        start -= this.limit;
        return this.betTransactionsPaginated.slice(start, start + this.limit)
      }
    }
  },

  methods: {
    ...Vuex.mapActions([
      'getAccountAddress',
      'getPLBetTransactionList'
    ]),

    setPage: function(pageNum) {
      this.pageSelected = pageNum;
    },

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
          this.getNetworkType === 'Testnet'
          ? constants.TESTNET_EXP_URL
          : constants.MAINNET_EXP_URL;

      shell.openExternal(explorerUrl + '/#/tx/' + txId);
    },

    // for initial load and further page retrievals
      loadPagination: function(pageNum = -1) {
        let from = 0;
        if (pageNum > -1) {
        from = pageNum; // asumming pagenum 3,6,100+
        }

      this.getPLBetTransactionList({
        length: this.limit,
        rexg: '*',
        from: (from),
        filter: '',
        betTransactionlistLength: this.limit
      })
        this.setPage(pageNum)
    }
  },

  data() {
    return {
      timeout: 0,
      tlist: [],
      limit: 3,
      limits: [
        {text: '3', value: '3'},
        {text: '6', value: '6'},
        {text: '100', value: '100'},
        {text: '10000', value: '10000'}
      ],
      pageCount: 0,
      pageSelected: 0
    };
  },

  watch: {
    limit: function(val) {
      // fix selected page
      console.log("limit change", val)
      this.pageSelected = 0;
      this.setPage(1)
      this.limit
    },
    transactionMax: function(val) {
      if (val !== -1) {
        if (this.plBetTransactionList.length === 0 )
          this.pageSelected = this.pageCount;
        else {
          this.pageSelected = this.pageCount + 1;
        }
      }
    }
  },

  async created() {
    await this.loadPagination(0)
    console.log("created this set page")
    await this.setPage(1);
  },

  // mounted: function() {
  //   M.AutoInit();
  // },

  mounted() {
    window.setTimeout(
      function() {
        M.AutoInit();
      },
      400
    );

    // Ping the get bets RPC method every 5 secs to show any new bet transactions.
    // let electronStore = new ElectronStore()
    // this.transactionsPaginated = electronStore.get('betTransactions');
    // Initialise the Material JS so modals, drop down menus etc function.
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

  <style lang="scss" scoped>
    ul.pagination {
    display: inline-block;
    }
  </style>
