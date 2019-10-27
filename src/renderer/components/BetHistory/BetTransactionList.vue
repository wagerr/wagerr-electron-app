<template>
  <!-- Peerless bet List -->
  <div
    v-if="plBetTransactionList.length === 0 && betTransactionsPaginated.length === 0"
    class="no-transactions z-depth-2 text-center"
  >
    <p>Looks like a new wallet, no betting transactions to list!</p>

    <p>
      Jump to the
      <router-link class="router-link" tag="a" to="/betting">betting tab</router-link>and start placing bets.
    </p>
  </div>

  <div v-else>
    <div class="row">
      <div class="input-field col s1">
        <select v-model="limit">
          <option v-for="limitt in limits" v-bind:value="parseInt(limitt.value)">{{ limitt.text }}</option>
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
        :hide-prev-next="true"
      ></paginate>
      <div class="input-field col s1">
        <input v-model="search" v-on:keyup.enter="searchTransactionList" type="text" />
        <label>Search</label>
      </div>
    </div>
    <table class="main-table card z-depth-2">
      <thead>
        <tr>
          <th class="hide-on-small-only">Event ID</th>

          <th class="hide-on-med-and-down">Transaction ID</th>

          <th class>Start Time</th>

          <th class="hide-on-med-and-down show-on-large">Bet Outcome</th>

          <th class>Home</th>

          <th class>Away</th>

          <th class>{{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }} Amount</th>

          <th class>Result</th>
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

          <td
            class="hide-on-small-only"
          >{{ Number(tx.starting) | moment('timezone', getTimezone, 'LLL') }}</td>

          <td class="hide-on-med-and-down show-on-large">{{ outcomeToText(tx['team-to-win']) }}</td>

          <td class="hide-on-small-only">{{ tx['home'] }}</td>

          <td class="hide-on-small-only">{{ tx['away'] }}</td>

          <td class>{{ tx.amount }}</td>

          <td class="hide-on-small-only">{{ tx['result'] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vuex from "vuex";
import {
  testnetParams,
  mainnetParams
} from "../../../main/constants/constants";

import Paginate from "vuejs-paginate";

export default {
  name: "BetTransactionList",

  components: { Paginate },

  computed: {
    ...Vuex.mapGetters([
      "plBetTransactionList",
      "getNetworkType",
      "getTimezone",
      "betTransactionsPaginated",
      "transactionMax"
    ]),
    pageCounted: function() {
      this.pageCount = Math.round(this.bt.length / this.limit);
      if (this.bt.length > this.pageCount * this.limit) this.pageCount += 1;
      if (this.pageCount === 1) this.setPage(1);
      return this.pageCount;
    },
    pagedList: function() {
      const re = new RegExp(this.search, "i");
      let start = 0;
      start = this.limit * this.pageSelected;
      start -= this.limit;

      this.bt = this.betTransactionsPaginated
        .filter(betTrans => betTrans.home.match(re))
        .concat(
          this.betTransactionsPaginated.filter(betTrans =>
            betTrans.away.match(re)
          )
        )
        .concat(
          this.betTransactionsPaginated.filter(betTrans =>
            betTrans["tx-id"].match(re)
          )
        )
        // .concat(this.betTransactionsPaginated.filter(
        //     betTrans => betTrans["event-id"].match(re)))
        .concat(
          this.betTransactionsPaginated.filter(betTrans =>
            betTrans.tournament.match(re)
          )
        )
        .concat(
          this.betTransactionsPaginated.filter(betTrans =>
            betTrans.result.match(re)
          )
        );
      this.bt = [...new Set(this.bt)];

      return this.bt.slice(start, start + this.limit);
    }
  },

  methods: {
    ...Vuex.mapActions(["getAccountAddress", "getPLBetTransactionList"]),

    setPage: function(pageNum) {
      this.pageSelected = pageNum;
    },

    // Convert the interger
    outcomeToText: function(outcome) {
      switch (outcome) {
        case 1:
          return "Money Line Home";
        case 2:
          return "Money Line Away";
        case 3:
          return "Money Line Draw";
        case 4:
          return "Home to Cover Spread";
        case 5:
          return "Away to Cover Spread";
        case 6:
          return "Total Over";
        case 7:
          return "Total Under";
        default:
          return outcome;
      }
    },

    blockExplorerUrl(txId) {
      let shell = require("electron").shell;
      let explorerUrl =
        this.getNetworkType === "Testnet"
          ? constants.TESTNET_EXP_URL
          : constants.MAINNET_EXP_URL;

      shell.openExternal(explorerUrl + "/#/tx/" + txId);
    },

    // for initial load and further page retrievals
    loadPagination: function() {
      this.getPLBetTransactionList({
        length: this.initialLoad,
        regx: "*",
        from: 0,
        filter: ""
      });
    }
  },

  data() {
    return {
      timeout: 0,
      limit: 10,
      bt: [],
      limits: [
        { text: "10", value: "10" },
        { text: "50", value: "50" },
        { text: "100", value: "100" },
        { text: "500", value: "500" }
      ],
      pageCount: 0,
      pageSelected: 1,
      initialLoad: 4000, // Hard limit for list viewable transactions, still able to search
      search: ""
    };
  },

  watch: {
    limit: function(val) {
      // show first page for change of pages limit
      this.pageSelected = 1;
      this.setPage(1);
      this.limit;
    }
  },

  async created() {
    this.loadPagination();
  },

  mounted() {
    window.setTimeout(function() {
      M.AutoInit();
    }, 400);

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
