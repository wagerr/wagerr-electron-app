<template>
  <!-- Transaction List -->
  <div
    v-if="wgrTransactionRecords.length === 0 && wgrTransactionRecordsPaginated.length === 0"
    class="no-transactions z-depth-2 text-center"
  >
  <p>Currently, your wallet has no Wagerr transactions to list...</p>
</div>

<div v-else>
  <div class="row">
    <div class="input-field col s2">
      <select
        v-model="limit"
        >
        <option v-for="limitt in limits" v-bind:value="parseInt(limitt.value)">
          {{ limitt.text }}
        </option>
   </select>
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
  </div>

  <div v-else>
    <div class="row">
      <div class="input-field col s2">
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
    </div>
    <table class="main-table card z-depth-2">
      <thead>
        <tr>
          <th></th>

          <th class="hide-on-med-and-down">Date</th>

          <th class="hide-on-small-only">
            Trans
            <span>action</span> ID
          </th>

          <th class="hide-on-small-only">Type</th>

          <!--<th class="hide-on-med-and-down show-on-large">Blockhash</th>-->

          <th class>Address</th>

          <th class>Amount</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="tx in pagedList" :key="tx.id" class="tx-record">
          <td v-if="tx.confirmations === -1" class="confirmations confirmation-conflicted">
            <a
              class="tooltipped"
              data-position="bottom"
              :data-tooltip="tx.confirmations + ' confirmations'"
            >
              <i class="far fa-times-circle"></i>
            </a>
          </td>

          <td v-else-if="tx.confirmations === 0" class="confirmations confirmation-pending">
            <a
              class="tooltipped"
              data-position="bottom"
              :data-tooltip="tx.confirmations + ' confirmations'"
            >
              <i class="far fa-question-circle"></i>
            </a>
          </td>

          <td v-else-if="tx.confirmations > 0 && tx.confirmations < 6" class="confirmations">
            <a
              class="tooltipped"
              data-position="bottom"
              :data-tooltip="tx.confirmations + ' confirmations'"
            >
              <div class="timer-loader"></div>
            </a>
          </td>

          <td v-else class="confirmations confirmation-success">
            <a
              class="tooltipped"
              data-position="bottom"
              :data-tooltip="tx.confirmations + ' confirmations'"
            >
              <i class="far fa-check-circle"></i>
            </a>
          </td>

          <td
            class="hide-on-med-and-down"
            :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >{{ Number(tx.time) | moment('timezone', getTimezone, 'LLL') }}</td>

          <td
            class="hide-on-small-only"
            :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >
            <a
              v-clipboard="tx.transactionid"
              @click="copiedAlert()"
              class="transaction-list-link tooltipped"
              data-position="bottom"
              data-tooltip="Copy"
            >
              <i class="far fa-copy"></i>
            </a>

            <a
              @click="blockExplorerUrl(tx.transactionid)"
              class="transaction-list-link tooltipped"
              data-position="bottom"
              data-tooltip="Open in block explorer"
            >
              <i class="fas fa-link"></i>
            </a>
          </td>

          <td
            class="hide-on-small-only"
            :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >{{ tx.type }}</td>

          <!--<td class="hide-on-med-and-down show-on-large">{{tx.blockhash}}</td>-->

          <td
            class
            :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >{{ tx.details[0] ? tx.details[0].address : '' }}</td>

          <td
            v-if="tx.debit < 0"
            class
            :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >{{ tx.debit }} {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}</td>

          <td
            v-else-if="tx.credit > 0"
            class
            :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >{{ tx.credit }} {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}</td>

          <td v-else class :class="{ 'confirmation-conflicted': tx.confirmations === -1 }">
            <small>Error: Could not determine amount.</small>
          </td>
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
import constants from "../../../main/constants/constants";

import Paginate from "vuejs-paginate";

export default {
  name: "TransactionList",

  data() {
    return {
      materializeInit: false
    };
  },

  components: { Paginate },

  computed: {
    ...Vuex.mapGetters([
      "getTimezone",
      "wgrTransactionList",
      "wgrTransactionRecords",
      "getNetworkType",
      "wgrTransactionRecords",
      "wgrTransactionRecordsPaginated",
      "transactionMax"
    ]),

    pageCounted: function() {
      this.pageCount = Math.round(this.wgrTransactionRecordsPaginated.length / this.limit);
      if (this.pageCount * this.limit < this.wgrTransactionRecordsPaginated.length) this.pageCount += 1;
      if (this.pageCount === 1) this.setPage(1);
      return this.pageCount;
    },

    pagedList: function() {
      let start = 0;
      start = this.limit * this.pageSelected;
      start -= this.limit;

      return this.wgrTransactionRecordsPaginated.slice(start, start + this.limit);
    }
  },

  watch: {
    wgrTransactionRecords: function(newValue, oldValue) {
      if (!this.materializeInit) {
        this.materializeInit = true;
        this.$nextTick(() => {
          // Initialise the Material JS so modals, drop down menus etc function.
          M.AutoInit();
        });
      }
    }
  },

  methods: {
    ...Vuex.mapActions(["getWGRTransactionRecords"]),

    blockExplorerUrl(txId) {
      let shell = require("electron").shell;
      let explorerUrl =
        this.getNetworkType === "Testnet"
          ? testnetParams.BLOCK_EXPLORER_URL
          : mainnetParams.BLOCK_EXPLORER_URL;

      shell.openExternal(explorerUrl + "/#/tx/" + txId);
    },

    setPage: function(pageNum) {
      this.pageSelected = pageNum;
    },

    loadPagination: function(pageNum = -1) {
      this.getWGRTransactionRecords({
        length:  this.initialLoad,
        rexg: '*',
        from: 0,
        filter: ''
      })
    },
  },

  data() {
    return {
      timeout: 0,
      tlist: [],
      limit: 10,
      limits: [
        {text: '10', value: '10'},
        {text: '50', value: '50'},
        {text: '100', value: '100'},
        {text: '500', value: '500'}
      ],
      pageCount: 0,
      pageSelected: 0,
      initialLoad: 4000 // Hard limit for list viewable transactions, still able to search
    };
  },

  watch: {
    limit: function(val) {
      // show first page for change of pages limit
      this.pageSelected = 0;
      this.setPage(1)
      this.limit
    },
  },

  async created() {
    await this.loadPagination(0);
  },

  mounted() {
    window.setTimeout(function() {
      M.AutoInit();
    }, 600);

    this.timeout = setInterval(
      function() {
        // this.getWGRTransactionRecords(100);
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
@import "../../assets/scss/_variables.scss";

.no-transactions p {
  font-size: 1.5em;
}

.no-transactions .fa-list-alt {
  color: $wagerr-red-dark;
  font-size: 10em;
}

.invalid {
  font-size: 1.1em;
  color: $wagerr-red-dark;
}

tbody tr {
  font-size: 1.1em;
}

.confirmations {
  padding: 15px 10px 10px 10px;
  font-size: 2.1em;
}

.confirmation-conflicted .tooltipped {
  color: $wagerr-red;
}

.confirmation-success .tooltipped {
  color: green;
}

.confirmation-pending .tooltipped {
  color: orangered;
}

.transaction-list-link {
  color: $gray-900;
  cursor: pointer;
  font-size: 1.5em;
  padding: 17px;
}

.transaction-list-link:hover {
  color: $wagerr-red-dark;
  cursor: pointer;
}

ul.pagination {
  display: inline-block;
}
ul.pagination {
  display: inline-block;
}
ul.pagination {
    display: inline-block;
}
</style>
<template>
<!-- Transaction List -->
<div
  v-if="wgrTransactionRecords.length === 0 && wgrTransactionRecordsPaginated.length === 0"
  class="no-transactions z-depth-2 text-center"
  >
  <p>Currently, your wallet has no Wagerr transactions to list...</p>
</div>

<div v-else>
  <div class="row">
    <div class="input-field col s2">
      <select
        v-model="limit"
        >
        <option v-for="limitt in limits" v-bind:value="parseInt(limitt.value)">
          {{ limitt.text }}
        </option>
   </select>
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
  </div>
  <table class="main-table card z-depth-2">
    <thead>
      <tr>
        <th></th>

        <th class="hide-on-med-and-down">Date</th>

        <th class="hide-on-small-only">Trans<span>action</span> ID</th>

        <th class="hide-on-small-only">Type</th>

        <!--<th class="hide-on-med-and-down show-on-large">Blockhash</th>-->

        <th class="">Address</th>

        <th class="">Amount</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="tx in pagedList" :key="tx.id" class="tx-record">
        <td
          v-if="tx.confirmations === -1"
          class="confirmations confirmation-conflicted"
          >
          <a
            class="tooltipped"
            data-position="bottom"
            :data-tooltip="tx.confirmations + ' confirmations'"
            >
            <i class="far fa-times-circle"></i>
          </a>
        </td>

        <td
          v-else-if="tx.confirmations === 0"
          class="confirmations confirmation-pending"
          >
          <a
            class="tooltipped"
            data-position="bottom"
            :data-tooltip="tx.confirmations + ' confirmations'"
            >
            <i class="far fa-question-circle"></i>
          </a>
        </td>

        <td
          v-else-if="tx.confirmations > 0 && tx.confirmations < 6"
          class="confirmations"
          >
          <a
            class="tooltipped"
            data-position="bottom"
            :data-tooltip="tx.confirmations + ' confirmations'"
            >
            <div class="timer-loader"></div>
          </a>
        </td>

        <td v-else class="confirmations confirmation-success">
          <a
            class="tooltipped"
            data-position="bottom"
            :data-tooltip="tx.confirmations + ' confirmations'"
            >
            <i class="far fa-check-circle"></i>
          </a>
        </td>

        <td
          class="hide-on-med-and-down"
          :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >
          {{ Number(tx.time) | moment('timezone', getTimezone, 'LLL') }}
        </td>

        <td
          class="hide-on-small-only"
          :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >
          <a
            v-clipboard="tx.transactionid"
            @click="copiedAlert()"
            class="transaction-list-link tooltipped"
            data-position="bottom"
            data-tooltip="Copy"
            >
            <i class="far fa-copy"></i>
          </a>

          <a
            @click="blockExplorerUrl(tx.transactionid)"
            class="transaction-list-link tooltipped"
            data-position="bottom"
            data-tooltip="Open in block explorer"
            >
            <i class="fas fa-link"></i>
          </a>
        </td>

        <td
          class="hide-on-small-only"
          :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >
          {{ tx.type }}
        </td>

        <!--<td class="hide-on-med-and-down show-on-large">{{tx.blockhash}}</td>-->

        <td
          class=""
          :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >
          {{ tx.details[0] ? tx.details[0].address : '' }}
        </td>

        <td
          v-if="tx.debit < 0"
          class=""
          :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >
          {{ tx.debit }} {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
        </td>

        <td
          v-else-if="tx.credit > 0"
          class=""
          :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >
          {{ tx.credit }} {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
        </td>

        <td
          v-else
          class=""
          :class="{ 'confirmation-conflicted': tx.confirmations === -1 }"
          >
          <small>Error: Could not determine amount.</small>
        </td>
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
import constants from '../../../main/constants/constants';
// Test:
import ElectronStore from 'electron-store';
import Paginate from 'vuejs-paginate';

export default {
  name: 'TransactionList',

  components: { Paginate },

  computed: {
    ...Vuex.mapGetters([
      'getTimezone',
      'wgrTransactionList',
      'wgrTransactionRecords',
      'getNetworkType',
      'wgrTransactionRecords',
      'wgrTransactionRecordsPaginated',
      'transactionMax'
    ]),

    pageCounted: function() {
      this.pageCount = Math.round(this.wgrTransactionRecordsPaginated.length / this.limit);
      if ((this.pageCount * this.limit) < this.wgrTransactionRecordsPaginated.length) this.pageCount += 1;
      return this.pageCount
    },

    pagedList: function() {
      if (this.pageSelected === 0) {
        return this.wgrTransactionRecordsPaginated
      } else {
        let start = 0;
        start = this.limit * (this.pageSelected);
        start -= this.limit;
        return this.wgrTransactionRecordsPaginated.slice(start, start + this.limit)
      }
    }

  },

  methods: {
    ...Vuex.mapActions([
      'getWGRTransactionRecords'
    ]),

    blockExplorerUrl(txId) {
      let shell = require('electron').shell;
      let explorerUrl =
          this.getNetworkType === 'Testnet'
          ? testnetParams.BLOCK_EXPLORER_URL
          : mainnetParams.BLOCK_EXPLORER_URL;

      shell.openExternal(explorerUrl + '/#/tx/' + txId);
    },

    setPage: function(pageNum) {
      this.pageSelected = pageNum;
    },
                                          
    loadPagination: function(pageNum = -1) {
      this.getWGRTransactionRecords({
        length:  this.initialLoad,
        rexg: '*',
        from: 0,
        filter: ''
      })
    },
  },

  data() {
    return {
      timeout: 0,
      tlist: [],
      limit: 10,
      limits: [
        {text: '10', value: '10'},
        {text: '50', value: '50'},
        {text: '100', value: '100'},
        {text: '500', value: '500'}
      ],
      pageCount: 0,
      pageSelected: 0,
      initialLoad: 4000 // Hard limit for list viewable transactions, still able to search
    };
  },

  watch: {
    limit: function(val) {
      // show first page for change of pages limit
      this.pageSelected = 0;
      this.setPage(1)
      this.limit
    },
  },

  async created() {
    await this.loadPagination(0);
  },

  mounted() {
    window.setTimeout(
      function() {
        M.AutoInit();
      },
      600
    );

    this.timeout = setInterval(
      function() {
        // this.getWGRTransactionRecords(100);
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
@import '../../assets/scss/_variables.scss';

.no-transactions p {
    font-size: 1.5em;
}

.no-transactions .fa-list-alt {
    color: $wagerr-red-dark;
    font-size: 10em;
}

.invalid {
    font-size: 1.1em;
    color: $wagerr-red-dark;
}

tbody tr {
    font-size: 1.1em;
}

.confirmations {
    padding: 15px 10px 10px 10px;
    font-size: 2.1em;
}

.confirmation-conflicted .tooltipped {
    color: $wagerr-red;
}

.confirmation-success .tooltipped {
    color: green;
}

.confirmation-pending .tooltipped {
    color: orangered;
}

.transaction-list-link {
    color: $gray-900;
    cursor: pointer;
    font-size: 1.5em;
    padding: 17px;
}

.transaction-list-link:hover {
    color: $wagerr-red-dark;
    cursor: pointer;
}

ul.pagination {
    display: inline-block;
}
ul.pagination {
    display: inline-block;
}
</style>
