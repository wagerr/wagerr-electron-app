<template>
  <div v-if="cgBetList.length === 0" class="no-transactions text-center">
    <p>No Chain Games transactions to list. Buy a ticket to enter the lotto.</p>
  </div>

  <div v-else>
    <table class="main-table card z-depth-2">
      <thead>
        <tr>
          <th class="col s10">Transaction ID</th>

          <th class="col s2">Event ID</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="tx in cgBetList" :key="tx.id">
          <td class="col s10">
            <a @click="blockExplorerUrl(tx['tx-id'])" class="transaction-link">
              {{ tx['tx-id'] }}
            </a>
          </td>

          <td class="col s2">{{ tx['event-id'] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vuex from 'vuex';
import constants from '../../../../main/constants/constants';

export default {
  name: 'CGLottoBetTransactionList',

  computed: {
    ...Vuex.mapGetters([
      'timezone',
      'gameID',
      'currentGameBets',
      'cgBetList',
      'getNetworkType'
    ])
  },

  methods: {
    ...Vuex.mapActions(['listCGLottoBets']),

    blockExplorerUrl(txId) {
      let shell = require('electron').shell;
      let explorerUrl =
        this.getNetworkType === 'Testnet'
          ? constants.TESTNET_EXP_URL
          : constants.MAINNET_EXP_URL;

      shell.openExternal(explorerUrl + '/#/tx/' + txId);
    }
  },

  data() {
    return {
      timeout: 0
    };
  },

  mounted() {
    this.listCGLottoBets();

    this.timeout = setInterval(
      function() {
        this.listCGLottoBets();
      }.bind(this),
      2000
    );

    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit();
  },

  destroyed() {
    clearInterval(this.timeout);
  }
};
</script>
