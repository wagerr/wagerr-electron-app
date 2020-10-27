<template>
  <!-- Peerless bet List -->
  <div
    v-if="plBetTransactionList.length === 0"
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
    <table class="main-table card z-depth-2">
      <thead>
        <tr>
          <th class="hide-on-small-only">Event ID</th>

          <th class="hide-on-med-and-down">Transaction ID</th>

          <th class="">Start Time</th>

          <th>Bets</th>

          <th class="">
            {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }} Amount
          </th>

          <th class="">Result</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="tx in myBetsTransactionList" :key="tx.id">
          <td class="hide-on-small-only">
            <div v-for="bet in tx.legs">
            {{ bet['event-id'] }}
            </div>
          </td>

          <td class="hide-on-small-only">
            <el-tooltip
              content="Copy"
              v-clipboard="tx.betTxHash"
              class="transaction-list-link"
            >
              <i class="far fa-copy" @click="copiedAlert()"></i>
            </el-tooltip>

            <el-tooltip
              content="Open in block explorer"
              class="transaction-list-link"
            >
              <i class="fas fa-link" @click="blockExplorerUrl(tx.betTxHash)"></i>
            </el-tooltip>
          </td>

          <td class="hide-on-small-only">
            {{ startingTime(tx) | moment('timezone', getTimezone, 'LLL') }}
            <span
              v-if="tx.legs.length > 1"
              class="tooltipped"
              data-tooltip="Start time of first event"
            >
              *
            </span>
          </td>

          <td>
            <div v-for="bet in tx.legs">
              <el-popover
                placement="bottom"
                width="500"
                trigger="hover">

                <div class="bet-outcome" slot="reference">
                  {{ betToText(bet) }}
                </div>
                <div>
                  <div>
                    <strong>Event Id: </strong> {{ bet['event-id'] }}
                    <span class="pull-right">
                      <strong>Start Time: </strong>
                      {{ startingTime(tx) | moment('timezone', getTimezone, 'LLL') }}
                    </span>
                  </div>
                  <div class="popover-body">
                    <div class="popover-teams-result">
                      <div class="tournament"><strong>{{ bet.lockedEvent.tournament }}</strong></div>
                      <div>{{ bet.lockedEvent.home }}</div>
                      <div class="team-score">
                        {{ bet.lockedEvent.homeScore === "undefined" ? "-" : bet.lockedEvent.homeScore }}
                      </div>
                      <div class="team-score">
                        {{ bet.lockedEvent.awayScore === "undefined" ? "-" : bet.lockedEvent.awayScore }}
                      </div>
                      <div>{{ bet.lockedEvent.away}} </div>
                    </div>
                  </div>
                  <div class="popover-footer">
                    <strong>
                      {{ bet.legResultType }}
                    </strong>
                  </div>
                </div>
              </el-popover>
            </div>
          </td>

          <td class="">{{ tx.amount }}</td>

          <td class="hide-on-small-only">
            {{ result(tx) }}
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

export default {
  name: 'BetTransactionList',

  computed: {
    ...Vuex.mapGetters([
      'plBetTransactionList',
      'myBetsTransactionList',
      'getNetworkType',
      'getTimezone',
      'convertOdds'
    ])
  },

  methods: {
    ...Vuex.mapActions(['getAccountAddress', 'getPLBetTransactionList', 'getMyBetsTransactionList']),

    eventIdCol(tx) {
      if (tx.legs.length === 1) return tx.legs[0]['event-id'];
      return `#${tx.legs.length} events`;
    },

    eventIdTooltip(tx) {
      if (tx.legs.length === 1) return tx.legs[0]['event-id'];
      return 'Events id: ' + tx.legs.map(l => l['event-id']).join(', ');
    },

    startingTime(tx) {
      return Math.min(...tx.legs.map(l => l.lockedEvent.starting));
    },

    startingTimeTooltip(tx) {
      if(tx.legs.length > 1) {
        return `<span>* <span>`;
      }
    },

    result(tx) {
      let results = new Set(tx.legs.map(l => l.legResultType));
      if (results.has('lose')) return 'Lose';
      if (results.has('pending')) return 'Pending';
      return 'Win';
    },

    copiedAlert() {
      M.toast({
        html:
          '<span class="toast__bold-font">Success &nbsp;</span> Transaction Id copied to clipboard.',
        classes: 'green'
      });
    },

    // Convert the interger and odds
    betToText: function(leg) {
      switch (leg.outcome) {
        case 1:
          return 'Home Win @' + this.convertOdds(leg.lockedEvent.homeOdds);
        case 2:
          return 'Away Win @' + this.convertOdds(leg.lockedEvent.awayOdds);
        case 3:
          return 'Draw @' + this.convertOdds(leg.lockedEvent.drawOdds);
        case 4:
          let oddsHome = leg.lockedEvent.spreadHomeOdds > leg.lockedEvent.spreadAwayOdds
                              ? '+'
                              : '-';
                              oddsHome += leg.lockedEvent.spreadPoints / 10;
          return 'Home Spread ' + oddsHome + '@' + this.convertOdds(leg.lockedEvent.spreadHomeOdds);
        case 5:
          let oddsAway = leg.lockedEvent.spreadAwayOdds > leg.lockedEvent.spreadHomeOdds
                              ? '+'
                              : '-';
                              oddsAway += leg.lockedEvent.spreadPoints / 10;
          return 'Away Spread ' + oddsAway + '@' + this.convertOdds(leg.lockedEvent.spreadAwayOdds);
        case 6:
          return 'Total Over ' + leg.lockedEvent.totalPoints / 10 + '@' + this.convertOdds(leg.lockedEvent.totalOverOdds);
        case 7:
          return 'Total Under ' + leg.lockedEvent.totalPoints / 10 + '@' + this.convertOdds(leg.lockedEvent.totalUnderOdds);
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
    this.$initMaterialize(['plBetTransactionList']);

    this.getMyBetsTransactionList(50);

    // Ping the get bets RPC method every 30 secs to show any new bet transactions
    this.timeout = setInterval(
      async function() {
        this.getPLBetTransactionList(50);
        this.getMyBetsTransactionList(50);
      }.bind(this),
      30000
    );
  },

  destroyed() {
    clearInterval(this.timeout);
  }
};
</script>

<style lang="scss" scoped>
strong {
  font-weight: bold;
}
.popover-teams-result {
  text-align: center;
}

.popover-body {
  padding: 30px 0;
}

.popover-footer {
  text-transform: capitalize;
  text-align: right;
}

.tournament {
  margin-bottom: 10px;
}
.team-score {
  border: 1px solid #ccc;
  background-color: #f6f6f6;
  padding: 10px;
  width: 75px;
  margin: 10px auto;
}
.bet-outcome:hover {
  font-weight: bold;
}
</style>
