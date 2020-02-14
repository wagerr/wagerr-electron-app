<template>
  <div id="bet-slip" class="bet-slip">
    <h4>
      <span
        :class="[
          'bet-slip__bet-type-btn',
          { 'bet-slip__bet-type-btn--active': betType === 'single' }
        ]"
        @click="setBetType('single')"
      >
        Single
      </span>
      |
      <span
        :class="[
          'bet-slip__bet-type-btn',
          { 'bet-slip__bet-type-btn--active': betType === 'multi' }
        ]"
        @click="setBetType('multi')"
      >
        Multi
      </span>

      <button
        v-if="getNumBets > 0"
        class="btn pull-right waves-effect waves-light"
        @click="clearBetSlip"
      >
        Clear Slip
      </button>
    </h4>

    <div class="bet-list-scroll">
      <div v-if="getNumBets > 0" class="bet-list">
        <ul>
          <li
            is="bet-card"
            v-for="bet in betSlip"
            :key="bet.betId"
            :bet="bet"
            :place-bet="placeBet"
            :wagerr-code="wagerrCode"
          ></li>
        </ul>
      </div>

      <div v-else class="bet-list">
        <div class="empty-slip-message">
          <p>Your bet slip is empty.</p>

          <p>Please make one or more selections in order to place bets.</p>
        </div>
      </div>
    </div>

    <div v-if="betType === 'multi'" class="bet-slip__multi-summary">
      <div>Total Legs: {{ getNumBets }}</div>
      <div class="input-field">
        <div class="bet-slip__multi-summary-bet">
          <label class="bet-slip__multi-summary-bet-label" for="multi-bet">
            Bet
          </label>
          <input
            id="multi-bet"
            v-model="multiBet"
            class="bet-stake validate"
            name="Bet Id"
            type="text"
            maxlength="10"
            placeholder="Enter Bet"
          />
        </div>
      </div>

      <div
        :class="[
          'bet-slip__warning',
          'bet-slip__warning--light',
          { 'display-none': showMultiBetWarning.length === 0 }
        ]"
      >
        {{ showMultiBetWarning }}
      </div>

      <div class="bet-slip__multi-summary-return">
        To Win: {{ multiPotentialWinnings }} {{ wagerrCode }}
      </div>

      <button
        class="btn waves-effect waves-light"
        :class="{
          disabled: showMultiBetWarning.length !== 0 || multiBetNumber === 0
        }"
        @click.prevent="placeParlayBet"
      >
        Place Bet
      </button>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron';
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import wagerrRPC from '@/services/api/wagerrRPC';
import blockchainRPC from '@/services/api/blockchain_rpc';
import ipcRenderer from '../../../../common/ipc/ipcRenderer';
import { bettingParams } from '../../../../main/constants/constants';
import BetCard from '@/components/betting/components/BetCard.vue';

export default {
  name: 'BetSlip',

  components: { BetCard },

  data() {
    return {
      multiBet: ''
    };
  },

  computed: {
    ...mapGetters([
      'balance',
      'immature',
      'pending',
      'betSlip',
      'getNumBets',
      'getNetworkType',
      'convertOdds',
      'betType'
    ])
  },

  data() {
    return {
      processingBet: false
    }
  },

    wagerrCode() {
      return this.getNetworkType === 'Testnet' ? ' tWGR' : ' WGR';
    },

    multiBetNumber() {
      return this.multiBet.length > 0 ? parseInt(this.multiBet, 10) : 0;
    },

    showMultiBetWarning() {
      if (this.betSlip.some(bet => bet.availability === false)) {
        return 'Sorry, you can not make a bet within 12 minutes of the Event.';
      }

      if (this.multiBetNumber === 0) {
        return '';
      }

      if (
        this.balance < this.multiBetNumber &&
        this.pending > this.multiBetNumber
      ) {
        return `Available balance too low. Please wait for your pending balance of ${this.pending} ${this.wagerrCode} to be confirmed.`;
      }

      if (
        this.balance < this.multiBetNumber &&
        this.immature > this.multiBetNumber
      ) {
        return `Available balance too low. Please wait for your immature balance of ${this.immature} ${this.wagerrCode} to be confirmed.`;
      }

      if (
        this.multiBetNumber < bettingParams.MIN_BET_AMOUNT ||
        this.multiBetNumber > bettingParams.MAX_BET_AMOUNT
      ) {
        return `Incorrect bet amount. Please ensure your bet is between 25 - 10000 ${this.wagerrCode} inclusive.`;
      }

      if (this.balance < this.multiBetNumber) {
        return 'Available balance too low.';
      }

      return '';
    },

    multiPotentialWinnings() {
      if (this.showMultiBetWarning.length !== 0 || this.betSlip.length === 0) {
        return (0).toFixed(8);
      }

      const odds = this.betSlip.reduce(
        (acc, bet) => acc * (bet.odds / bettingParams.ODDS_DIVISOR),
        1
      );
      const grossWinnings = odds * this.multiBetNumber;
      const grossProfit = grossWinnings - this.multiBetNumber;
      const betFee = grossProfit * bettingParams.NETWORK_SHARE;

      return (grossWinnings - betFee).toFixed(8);
    },

  watch: {
    multiBet: function multiBetWatch(value, oldValue) {
      if (value !== oldValue && /^\d{0,10}$/g.test(value)) {
        this.multiBet = value;
      } else {
        this.multiBet = oldValue;
      }
    }
  },

  created() {
    window.addEventListener('scroll', this.handleScroll);
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    ...mapActions(['removeBetFromSlip', 'clearBetSlip', 'setBetType']),

    placeParlayBet() {
      const events = this.betSlip.map(bet => ({
        eventId: bet.eventDetails.event_id,
        outcome: bet.outcome
      }));

      this.placeBet(null, events, this.multiBetNumber);
    },

    async isSyncValid() {
      let durationBehind = await blockchainRPC.getBlockDurationBehind();
      return durationBehind.asMinutes() < 10;
    },

    // Place a bet on a given event and sent the tx to the Wagerr blockchain.
    async placeBet(betId, events, betAmount) {
      const self = this;

      // Check if wallet is synced (10min behind max)
      if (!await this.isSyncValid()) {
        remote.dialog.showMessageBox(remote.BrowserWindow.getFocusedWindow(), {
          type: 'error',
          title: 'Error Placing Bet',
          message: `Your bet could not be placed because your wallet is out of sync`,
          detail: 'Your wallet will restart to sync',
          buttons: ['Ok, restart wallet']
        });
      } else {
        try {
          let response;

          if (betId) {
            const [{ eventId, outcome }] = events;
            response = await wagerrRPC.client.placeBet(
              eventId,
              outcome,
              betAmount
            );
          } else {
            response = await wagerrRPC.client.placeParlayBet(events, betAmount);
          }

          if (response.error !== 'null') {
            M.toast({
              html: `<span class="toast__bold-font">Success &nbsp;</span> your bet has been placed: ${response.result}`,
              classes: 'green'
            });

            if (betId) {
              self.removeBetFromSlip(betId);
            } else {
              self.clearBetSlip();
            }

            return true;
          }
          // If bet was unsuccessful then show error to the user.
          M.toast({
            html: `<span class="toast__bold-font">Error &nbsp;</span> ${response.result}`,
            classes: 'wagerr-red-bg'
          });

          return false;
        } catch (e) {
          M.toast({ html: e, classes: 'wagerr-red-bg' });
          console.error(e);

          return false;
        }
      }
    },

    handleScroll() {
      // Get the bet slip.
      const navbar = document.getElementById('bet-slip');

      // Get the offset position of the navbar.
      const sticky = navbar.offsetTop;

      if (window.pageYOffset >= sticky) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.bet-slip-div {
  margin-top: 25px;
  #bet-slip {
    background: $white;
    position: fixed;
    top: 120px;
    width: calc(25% - 3.5rem);
    height: calc(100vh - 120px);
    right: 0;
    .bet-list-scroll {
      height: calc(100% - 25px);
      overflow-y: scroll;
    }
    h4 {
      margin-bottom: 0;
      margin-top: 0;
      background: $gray-900;
      color: $white;
      border: none;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      padding: 10px 10px 8px;
      font-size: 15px;
      line-height: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      button {
        background: $wagerr-red;
        color: $white;
        height: 24px;
        line-height: 24px;
        position: absolute;
        top: 7px;
        right: 10px;
        font-size: 11px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        padding: 0 10px;
        &:hover {
          background: $wagerr-red-dark;
        }
      }
    }

    .bet-list {
      background: $white;
      padding: 10px;
      ul {
        margin: 0;
        padding: 0;
        li.card {
          .bet-details {
            padding: 0;
            position: relative;
            .bet-slip-pair {
              color: $white;
              background: $wagerr-red;
              font-family: 'Montserrat', sans-serif;
              font-weight: 700;
              text-align: left;
              padding: 6px 40px 6px 10px;
              width: 100%;
              font-size: 12px;
              line-height: 16px;
            }
            .clear-bet {
              color: $white;
              position: absolute;
              top: -2px;
              right: -2px;
              width: 30px;
              height: 30px;
              display: block;
              background: $wagerr-red;
              text-align: center;
              line-height: 30px;
              &:hover {
                background: $wagerr-red-dark;
              }
              i {
                font-weight: 700;
                cursor: pointer;
                font-size: 24px;
              }
            }
            .selection {
              font-weight: 700;
              padding: 15px 10px 10px;
              font-size: 16px;
              line-height: 22px;
              font-family: 'Montserrat', sans-serif;
              color: $wagerr-red;
              h6 {
                color: #aaa;
                font-size: 9px;
                text-align: center;
                width: 100%;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-family: 'Open Sans', sans-serif;
                font-weight: 600;
                margin: 0;
                line-height: 18px;
              }
              .winner {
                display: block;
                text-align: center;
                float: none;
                font-size: 18px;
                line-height: 20px;
                padding-bottom: 5px;
              }
              .odds {
                display: inline-block;
                text-align: center;
                float: none;
                width: 60%;
                background: #eee;
                margin: 5px 20% 0;
                padding: 4px 0;
                border-radius: 4px;
                letter-spacing: 1px;
                color: $gray-900;
              }
            }
            .bet-stake-container {
              color: $gray-900;
              padding: 0;
              display: flex;
              justify-content: center;
              margin-bottom: 0;
              .stake-input {
                width: 120px;
                position: relative;
                margin-right: 0;
                label {
                  left: 0;
                  top: 0;
                  position: absolute;
                  color: $gray-900;
                  font-size: 14px;
                  font-family: 'Open Sans', sans-serif;
                  font-weight: 600;
                  text-align: center;
                  width: 100%;
                }
                input {
                  color: $gray-900;
                  font-family: 'Open Sans', sans-serif;
                  font-size: 18px;
                  font-weight: 700;
                  text-align: center;
                  width: 120px;
                  background: #eee;
                  margin-bottom: 0;
                  height: 33px;
                  box-shadow: 0 1px 0 0 $gray-600;
                  &::-webkit-input-placeholder {
                    /* Chrome/Opera/Safari */
                    font-size: 13px;
                    font-weight: 600;
                  }
                  &::-moz-placeholder {
                    /* Firefox 19+ */
                    font-size: 13px;
                    font-weight: 600;
                  }
                  &:-ms-input-placeholder {
                    /* IE 10+ */
                    font-size: 13px;
                    font-weight: 600;
                  }
                  &:-moz-placeholder {
                    /* Firefox 18- */
                    font-size: 13px;
                    font-weight: 600;
                  }
                }
              }
              .stake-button {
                button {
                  border-radius: 0;
                  height: 35px;
                  line-height: 35px;
                  box-shadow: none;
                  padding-top: 2px;
                  font-weight: 700;
                }
              }
            }
            .bet-returns {
              color: $gray-900;
              padding: 5px 10px;
              .potential-returns-headline {
                float: none;
                text-align: center;
                display: block;
                color: $gray-900;
                font-size: 13px;
                font-family: 'Open Sans', sans-serif;
                font-weight: 700;
                margin-bottom: 2px;
              }
              .potential-returns {
                float: none;
                text-align: center;
                display: block;
                color: $wagerr-red;
                font-size: 12px;
                font-family: 'Open Sans', sans-serif;
                font-weight: 700;
                letter-spacing: 0.5px;
              }
            }
          }
        }
      }
    }
  }
}

.empty-slip-message {
  padding: 10px;
  text-align: center;
}

.bet-warning {
  background: $gray-900;
  border-radius: 5px;
  color: $white;
  font-size: 12px;
  margin: 5px;
  padding: 10px;
}

.bet-slip {
  display: flex;
  flex-direction: column;

  &__bet-type-btn {
    cursor: pointer;

    &--active {
      color: $wagerr-red-light;
    }
  }

  &__multi-summary {
    background: $gray-900;
    color: $white;
    display: flex;
    flex-direction: column;
    font-family: 'Montserrat', monospace;
    font-size: 16px;
    font-weight: 700;
    padding: 10px;
  }

  &__multi-summary-bet {
    display: flex;
    align-items: baseline;
  }

  &__multi-summary-bet-label {
    margin-right: 1rem;
  }

  &__multi-summary-return {
    margin-bottom: 1rem;
  }

  & /deep/ &__warning {
    color: $white;
    background: $gray-900;
    border-radius: 5px;
    font-size: 12px;
    margin: 5px;
    padding: 10px;

    &--light {
      color: inherit;
      background-color: $wagerr-red;
    }
  }
}
</style>
