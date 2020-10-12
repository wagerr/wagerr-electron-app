<template>
  <!-- Peerless bet List -->
  <div
    v-if="myBetsTransactionList.length === 0"
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
            {{ eventIdCol(tx) }}
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
            <span
              v-if="tx.legs.length > 1"
              class="tooltipped"
              data-tooltip="Start time of earliest event"
            >
              {{ startingTime(tx) | moment('timezone', getTimezone, 'LLL') }} *
            </span>
            <span v-else>
              {{ startingTime(tx) | moment('timezone', getTimezone, 'LLL') }}
            </span>
          </td>

          <td>
            <div class="bet-col">
              <div>
                <div v-for="bet in tx.legs" :key="bet['event-id']">
                  <div>
                    {{ betToText(bet, tx.legs.length) }}
                  </div>
                </div>
              </div>
              <el-popover
                placement="bottom"
                width="570"
                popper-class="wgr-popover"
                trigger="hover">
                <div>
                  <div class="popover-header">
                    <strong>{{ eventIdPopover(tx) }}</strong>
                    <span class="pull-right">
                      <strong>{{ result(tx) }}</strong>
                    </span>
                  </div>
                  <div class="popover-body">

                    <div v-for="bet in tx.legs" :key="bet['event-id']">
                      <div class="bet-popover">
                        <div class="bet-header">
                          <div v-if="tx.legs.length > 1">
                            <strong>Event {{ bet['event-id'] }}</strong>
                          </div>
                          <div class="bet-tournament">
                            {{ bet.lockedEvent.tournament }}
                          </div>
                          <div v-if="tx.legs.length > 1" class="bet-result">
                            {{ bet.legResultType }}
                          </div>
                        </div>
                        <div class="bet-date">
                          <small>
                            {{ startingTime(tx) | moment('timezone', getTimezone, 'LLL') }}
                          </small>
                        </div>
                        <div class="bet-teams-score">
                          <div class="team" :title="bet.lockedEvent.home">
                            {{ bet.lockedEvent.home }}
                          </div>
                          <div class="bet-score">
                            <span>
                              <div class="score">
                                {{ score(bet.lockedEvent.homeScore) }}
                              </div>
                            </span>
                            <span>
                              <div class="score">
                                {{ score(bet.lockedEvent.awayScore) }}
                              </div>
                            </span>
                          </div>
                          <div class="team align-right" :title="bet.lockedEvent.away">
                            {{ bet.lockedEvent.away }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div slot="reference">
                  <i class="el-icon-info" />
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
      'myBetsTransactionList',
      'getNetworkType',
      'getTimezone',
      'convertOdds'
    ])
  },

  methods: {
    ...Vuex.mapActions(['getAccountAddress', 'getMyBetsTransactionList']),

    eventIdCol(tx) {
      if (tx.legs.length === 1) return tx.legs[0]['event-id'];
      return `#${tx.legs.length} events`;
    },

    eventIdPopover(tx) {
      if (tx.legs.length === 1) return 'Event ' + tx.legs[0]['event-id'];
      return `#${tx.legs.length} events`;
    },

    eventIdTooltip(tx) {
      if (tx.legs.length === 1) return tx.legs[0]['event-id'];
      return 'Events id: ' + tx.legs.map(l => l['event-id']).join(', ');
    },

    startingTime(tx) {
      return Math.min(...tx.legs.map(l => l.lockedEvent.starting));
    },

    score(score) {
      return score === 'undefined' ? '-' : score / 10;
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

    // Convert outcome integer and bet odds to text
    betToText: function(leg, numLegs) {
      let text;

      switch (leg.outcome) {
        case 1:
          text = `Home Win @${this.convertOdds(leg.lockedEvent.homeOdds)}`;
          break;
        case 2:
          text = `Away Win @${this.convertOdds(leg.lockedEvent.awayOdds)}`;
          break;
        case 3:
          text = `Draw @${this.convertOdds(leg.lockedEvent.drawOdds)}`;
          break;
        case 4:
          let oddsHome = leg.lockedEvent.spreadHomeOdds > leg.lockedEvent.spreadAwayOdds
                              ? '+'
                              : '-';
          oddsHome += leg.lockedEvent.spreadPoints / 10;
          text = `Home Spread ${oddsHome}@${this.convertOdds(leg.lockedEvent.spreadHomeOdds)}`;
          break;
        case 5:
          let oddsAway = leg.lockedEvent.spreadAwayOdds > leg.lockedEvent.spreadHomeOdds
                              ? '+'
                              : '-';
          oddsAway += leg.lockedEvent.spreadPoints / 10;
          text = `Away Spread ${oddsAway}@${this.convertOdds(leg.lockedEvent.spreadAwayOdds)}`;
          break;
        case 6:
          text = `Total Over ${leg.lockedEvent.totalPoints / 10}@${this.convertOdds(leg.lockedEvent.totalOverOdds)}`;
          break;
        case 7:
          text = `Total Under ${leg.lockedEvent.totalPoints / 10}@${this.convertOdds(leg.lockedEvent.totalUnderOdds)}`;
          break;
        default:
          text = leg.outcome;
          break;
      }

      if (numLegs > 1) {
        text += ` (Event ${leg['event-id']})`;
      }

      return text;
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
    this.$initMaterialize();

    this.getMyBetsTransactionList(50);

    // Ping the get bets RPC method every 30 secs to show any new bet transactions
    this.timeout = setInterval(
      async function() {
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

<style lang="scss">
@import '../../assets/scss/variables';
// Override default element-ui padding
.wgr-popover {
  padding: 0 !important;
}
.el-popper[x-placement^=bottom] .popper__arrow::after {
  border-bottom-color: $wagerr-red-dark !important;
}
</style>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

strong {
  font-weight: bold;
}
.align-right {
  text-align: right;
}

.bet-col {
  display: flex;
  align-items: center;

  .el-popover__reference {
    margin-left: 20px;
  }

  i.el-icon-info {
    color: $gray-600;

    &:hover {
      color: $gray-800;
    }
  }
}

.wgr-popover {
  .popover-header{
    color: white;
    background-color: $wagerr-red-dark;
    padding: 12px;
  }
  .popover-body {
    padding: 15px;
    padding-bottom: 0;
    .bet-popover {
      margin-bottom: 15px;
      .bet-header {
        display: flex;
        & > div {
          flex: 1 1 0px;
        }
        .bet-result {
          text-align: right;
          text-transform: capitalize;
        }
      }
      .bet-tournament {
        text-align: center;
      }
      .bet-date {
        text-align: center;
      }
      .bet-teams-score {
        display: flex;
        align-items: center;
        & > div {
          flex: 2 1 0px;
        }
        .bet-score {
          display: flex;
          text-align: center;
          flex: 1 2;
          & > span {
            flex: 1 1 0px;
          }

          .score {
            border: 1px solid #ccc;
            background-color: #f6f6f6;
            padding: 10px;
            width: 50px;
            margin: 10px 5px;
          }
        }
        .team {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .team-away {
          text-align: right;
        }
      }
    }
  }
}
</style>
