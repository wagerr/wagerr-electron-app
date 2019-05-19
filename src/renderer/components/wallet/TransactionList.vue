<template>
  <!-- Transaction List -->
  <div
    v-if="wgrTransactionRecords.length === 0"
    class="no-transactions z-depth-2 text-center"
  >
    <p>Currently, your wallet has no Wagerr transactions to list...</p>
  </div>

  <div v-else>
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
        <tr v-for="tx in wgrTransactionRecords" :key="tx.id" class="tx-record">
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
import constants from '../../../main/constants/constants';

export default {
  name: 'TransactionList',

  computed: {
    ...Vuex.mapGetters([
      'getTimezone',
      'wgrTransactionList',
      'wgrTransactionRecords',
      'getNetworkType'
    ])
  },

  methods: {
    ...Vuex.mapActions(['']),

    blockExplorerUrl(txId) {
      let shell = require('electron').shell;
      let explorerUrl =
        this.getNetworkType === 'Testnet'
          ? constants.TESTNET_EXP_URL
          : constants.MAINNET_EXP_URL;

      shell.openExternal(explorerUrl + '/#/tx/' + txId);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables.scss';

.no-transactions p {
  font-size: 1.5em;
}

.no-transactions .fa-list-alt {
  color: $wagerr_dark_red;
  font-size: 10em;
}

.invalid {
  font-size: 1.1em;
  color: $wagerr_dark_red;
}

tbody tr {
  font-size: 1.1em;
}

.confirmations {
  padding: 15px 10px 10px 10px;
  font-size: 2.1em;
}

.confirmation-conflicted .tooltipped {
  color: $wagerr_red;
}

.confirmation-success .tooltipped {
  color: green;
}

.confirmation-pending .tooltipped {
  color: orangered;
}

.transaction-list-link {
  color: $dark_grey;
  cursor: pointer;
  font-size: 1.5em;
  padding: 17px;
}

.transaction-list-link:hover {
  color: $wagerr_dark_red;
  cursor: pointer;
}
</style>
