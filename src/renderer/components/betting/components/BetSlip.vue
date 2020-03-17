<template>
  <div id="bet-slip">
    <h4 v-if="betSlip.length > 0">
      Bet slip
      <button
        class="btn pull-right waves-effect waves-light"
        @click="clearBetSlip"
      >
        Clear Slip
      </button>
    </h4>
    <h4 v-else>Bet slip</h4>

    <div class="bet-list-scroll">
      <div class="bet-list" v-if="betSlip.length > 0">
        <ul>
          <li v-for="(bet, index) in betSlip" :key="bet.betId" class="card">
            <div class="bet-details">
              <div class="bet-slip-pair">
                {{ bet.eventDetails.teams.home }} vs
                {{ bet.eventDetails.teams.away }}
              </div>

              <a
                class="clear-bet pull-right"
                @click="removeBetFromSlip(bet.betId)"
              >
                <i>&times;</i>
              </a>

              <div class="clearfix"></div>

              <div class="selection">
                <h6>Your Pick:</h6>
                <span v-if="bet.betType != 'total'" class="winner">
                  {{ bet.winner }}
                </span>
                <span v-if="bet.betType == 'total'" class="odds pull-right">
                  {{ bet.totalValue }}
                </span>
                <span v-if="bet.betType == 'spread'" class="odds pull-right">
                  {{ bet.handicap }}
                </span>
                <span class="odds pull-right">{{ convertOdds(bet.odds) }}</span>
              </div>

              <div class="input-field bet-stake-container">
                <div class="stake-input">
                  <input
                    :id="bet.betId"
                    class="bet-stake validate"
                    name="Bet Id"
                    type="text"
                    maxlength="10"
                    :disabled="bet.availability === false"
                    v-on:input="calcPotentialWinnings($event, bet.odds, index)"
                    :placeholder="inputBetPlaceholder(bet)"
                  />
                  <span
                    class="helper-text"
                    data-error="Invalid Stake"
                    data-success
                  ></span>
                </div>
                <div class="stake-button">
                  <button
                    :disabled="isProcessingBet"
                    :id="'place-bet-button-' + index"
                    class="pull-right btn disabled"
                    @click="placeBet(bet.betId)"
                  >
                    Bet
                  </button>
                </div>
              </div>

              <div
                :id="'bet-warning-' + index"
                class="bet-warning display-none"
              ></div>

              <div class="bet-returns">
                <span class="pull-left potential-returns-headline">
                  Potential Returns:
                </span>

                <span
                  :id="'potential-returns-' + index"
                  class="potential-returns pull-right"
                >
                  0 {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
                </span>

                <div class="clear"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-else class="bet-list">
        <div class="empty-slip-message">
          <p>Your bet slip is empty.</p>

          <p>Please make one or more selections in order to place bets.</p>
        </div>
      </div>
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

export default {
  name: 'BetSlip',

  computed: {
    ...mapGetters([
      'balance',
      'immature',
      'pending',
      'betSlip',
      'getNumBets',
      'getNetworkType',
      'convertOdds',
      'getShowNetworkShare'
    ]),
    isProcessingBet() {
      return this.processingBet;
    }
  },

  data() {
    return {
      processingBet: false
    }
  },

  methods: {
    ...mapActions(['addToBetSlip', 'removeBetFromSlip', 'clearBetSlip']),

    inputBetPlaceholder: function(bet) {
      return bet.availability === true ? 'Enter Bet Stake' : 'Not Available';
    },

    // Calculate the potential winnings of a bet.
    calcPotentialWinnings: function(event, odds, index) {
      odds = odds / bettingParams.ODDS_DIVISOR;
      const betFeePercent = bettingParams.NETWORK_SHARE;
      const betStake = event.target.value;
      const grossWinnings = odds * betStake;
      const grossProfit = grossWinnings - betStake;
      const betFee = grossProfit * betFeePercent;
      const netWinnings = grossWinnings - betFee;
      const returnsElem = document.getElementById('potential-returns-' + index);
      const wagerrCode = this.getNetworkType === 'Testnet' ? ' tWGR' : ' WGR';

      // If the bet stake is more than the available balance, disable the bet button and show a warning.
      if (this.showBetWarning(betStake, index)) {
        returnsElem.innerText = 0 + ' ' + wagerrCode;
      } else {
        returnsElem.innerText = netWinnings.toFixed(8) + ' ' + wagerrCode;
      }
    },

    showBetWarning: function(betStake, index) {
      const placeBetButton = document.getElementById(
        'place-bet-button-' + index
      );
      const warningElem = document.getElementById('bet-warning-' + index);
      const wagerrCode = this.getNetworkType === 'Testnet' ? ' tWGR' : ' WGR';
      let showWarning = false;

      if (betStake.length === 0) {
        placeBetButton.classList.add('disabled');
        warningElem.classList.add('display-none');
        showWarning = true;
      } else if (isNaN(betStake)) {
        placeBetButton.classList.add('disabled');
        warningElem.classList.remove('display-none');
        warningElem.innerText = 'Bet stake must be a number.';
        showWarning = true;
      } else if (this.balance < betStake && this.pending > betStake) {
        placeBetButton.classList.add('disabled');
        warningElem.classList.remove('display-none');
        warningElem.innerText =
          'Available balance too low. Please wait for your pending balance of ' +
          this.pending +
          ' ' +
          wagerrCode +
          ' to be confirmed.';
        showWarning = true;
      } else if (this.balance < betStake && this.immature > betStake) {
        placeBetButton.classList.add('disabled');
        warningElem.classList.remove('display-none');
        warningElem.innerText =
          'Available balance too low. Please wait for your immature balance of ' +
          this.immature +
          ' ' +
          wagerrCode +
          ' to be confirmed.';
        showWarning = true;
      } else if (
        betStake < bettingParams.MIN_BET_AMOUNT ||
        betStake > bettingParams.MAX_BET_AMOUNT
      ) {
        placeBetButton.classList.add('disabled');
        warningElem.classList.remove('display-none');
        warningElem.innerText =
          'Incorrect bet amount. Please ensure your bet is between 25 - 10000 ' +
          wagerrCode +
          ' inclusive.';
        showWarning = true;
      } else if (this.balance < betStake) {
        placeBetButton.classList.add('disabled');
        warningElem.classList.remove('display-none');
        warningElem.innerText = 'Available balance too low.';
        showWarning = true;
      } else {
        placeBetButton.classList.remove('disabled');
        warningElem.classList.add('display-none');
        showWarning = false;
      }

      return showWarning;
    },

    async isSyncValid() {
      let durationBehind = await blockchainRPC.getBlockDurationBehind();
      return durationBehind.asMinutes() < 10;
    },

    // Place a bet on a given event and sent the tx to the Wagerr blockchain.
    async placeBet(betId) {
      this.processingBet = true;

      // Check if wallet is synced (10min behind max)
      if (!await this.isSyncValid()) {
        remote.dialog.showMessageBox(remote.BrowserWindow.getFocusedWindow(), {
          type: 'error',
          title: 'Error Placing Bet',
          message: `Your bet could not be placed because your wallet is out of sync`,
          detail: 'Your wallet will restart to sync',
          buttons: ['Ok, restart wallet'],
        });

        ipcRenderer.restartWalletForce();
        this.processingBet = false;

      } else {
        let betInfo, betAmount, eventId, self = this;

        betInfo = this.betSlip.find(item => item.betId === betId);
        betAmount = parseFloat(document.getElementById(betId).value);
        eventId = parseInt(betInfo.eventDetails.event_id);

        wagerrRPC.client
          .placeBet(eventId, betInfo.outcome, betAmount)
          .then(function(resp) {
            // If bet was successful then display bet TX-ID to the user.
            if (resp.error !== 'null') {
              M.toast({
                html:
                  '<span class="toast__bold-font">Success &nbsp;</span> your bet has been placed: ' +
                  resp.result,
                classes: 'green'
              });

              self.removeBetFromSlip(betId);
            }
            // If bet was unsuccessful then show error to the user.
            else {
              M.toast({
                html:
                  '<span class="toast__bold-font">Error &nbsp;</span> ' +
                  resp.result,
                classes: 'wagerr-red-bg'
              });
            }
          })
          .catch(function(err) {
            // TODO Parse the error from the response.
            M.toast({ html: err, classes: 'wagerr-red-bg' });
            console.error(err);
          })
          .finally(() => {
            self.processingBet = false;
          });
      }
    },

    handleScroll(event) {
      // Get the bet slip.
      let navbar = document.getElementById('bet-slip');

      // Get the offset position of the navbar.
      let sticky = navbar.offsetTop;

      if (window.pageYOffset >= sticky) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }
    }
  },

  watch: {
    betSlip: {
      handler(newBets, oldBets) {
        newBets.forEach(function(newBet, index) {
          if (newBet.availability === false) {
            document.getElementById(newBet.betId).value = '';
            document.getElementById('bet-warning-' + index).innerText =
              'Sorry, you can not make a bet within 12 minutes of the Event.';
            document
              .getElementById('bet-warning-' + index)
              .classList.remove('hide');
          }
        });
      },
      deep: true
    }
  },

  created() {
    window.addEventListener('scroll', this.handleScroll);
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/_variables.scss';

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
      font-family: 'Montserrat';
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
        font-family: 'Montserrat';
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
          background: transparent;
          color: $gray-900;
          padding: 0 0 10px;
          box-shadow: none;
          border: 2px solid $wagerr-red;
          margin: 0 0 15px;
          .bet-details {
            padding: 0;
            position: relative;
            .bet-slip-pair {
              color: $white;
              background: $wagerr-red;
              font-family: 'Montserrat';
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
              color: $gray-900;
              font-weight: 700;
              padding: 15px 10px 10px;
              font-size: 16px;
              line-height: 22px;
              font-family: 'Montserrat';
              color: $wagerr-red;
              h6 {
                color: #aaa;
                font-size: 9px;
                text-align: center;
                width: 100%;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-family: 'Open Sans';
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
                  font-family: 'Open Sans';
                  font-weight: 600;
                  text-align: center;
                  width: 100%;
                }
                input {
                  color: $gray-900;
                  font-family: 'Open Sans';
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
                font-family: 'Open Sans';
                font-weight: 700;
                margin-bottom: 2px;
              }
              .potential-returns {
                float: none;
                text-align: center;
                display: block;
                color: $wagerr-red;
                font-size: 12px;
                font-family: 'Open Sans';
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
</style>
