<template>
  <!-- Peerless bet List -->
  <div
    v-if="plBetTransactionList.length === 0"
    class="no-transactions z-depth-2 text-center"
  >
    <p>{{ $t('Looks like a new wallet, no betting transactions to list!') }}</p>

    <i18n path="Jump to the {tab} and start placing bets" tag="p">
      <template v-slot:tab>
        <router-link class="router-link" tag="a" to="/betting">
          {{ $t('betting tab') }}
        </router-link>
      </template>
    </i18n>
  </div>

  <div v-else>
    <table class="main-table card z-depth-2">
      <thead>
        <tr>
          <th class="hide-on-small-only">{{ $t('Event ID') }}</th>

          <th class="hide-on-med-and-down">{{ $t('Transaction ID') }}</th>

          <th class="">{{ $t('Start Time') }}</th>

          <th class="hide-on-med-and-down show-on-large">{{ $t('Bet Outcome') }}</th>

          <th class="">{{ $t('Home') }}</th>

          <th class="">{{ $t('Away') }}</th>

          <th class="">
            {{ getNetworkType === 'Testnet' ? $t('tWGR Amount') : $t('WGR Amount') }}
          </th>

          <th class="">{{ $t('Result') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="tx in plBetTransactionList" :key="tx.id">
          <td class="hide-on-small-only">{{ tx['event-id'] }}</td>

          <td class="hide-on-small-only">
            <a
              v-clipboard="tx['tx-id']"
              @click="copiedAlert()"
              class="transaction-list-link tooltipped"
              data-position="bottom"
              :data-tooltip="$t('Copy')"
            >
              <i class="far fa-copy"></i>
            </a>

            <a
              @click="blockExplorerUrl(tx['tx-id'])"
              class="transaction-list-link tooltipped"
              data-position="bottom"
              :data-tooltip="$t('Open in block explorer')"
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

          <td class="hide-on-small-only">{{ $t(tx['result']) }}</td>
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

export default {
  name: 'BetTransactionList',

  computed: {
    ...Vuex.mapGetters([
      'plBetTransactionList',
      'getNetworkType',
      'getTimezone'
    ])
  },

  methods: {
    ...Vuex.mapActions(['getAccountAddress', 'getPLBetTransactionList']),

    // Convert the interger
    outcomeToText: function(outcome) {
      switch (outcome) {
        case 1:
          return this.$t('Money Line Home');
        case 2:
          return this.$t('Money Line Away');
        case 3:
          return this.$t('Money Line Draw');
        case 4:
          return this.$t('Home to Cover Spread');
        case 5:
          return this.$t('Away to Cover Spread');
        case 6:
          return this.$t('Total Over');
        case 7:
          return this.$t('Total Under');
        default:
          return outcome;
      }
    },

    blockExplorerUrl(txId) {
      let shell = require('electron').shell;
      let explorerUrl =
        this.getNetworkType === 'Testnet'
          ? testnetParams.BLOCK_EXPLORER_URL
          : mainnetParams.BLOCK_EXPLORER_URL;

      shell.openExternal(explorerUrl + '/#/tx/' + txId);
    }
  },

  data() {
    return {
      timeout: 0
    };
  },

  mounted() {
    // Ping the get bets RPC method every 5 secs to show any new bet transactions.
    this.timeout = setInterval(
      async function() {
        this.getPLBetTransactionList(50);
      }.bind(this),
      5000
    );
  },

  destroyed() {
    clearInterval(this.timeout);
  }
};
</script>
