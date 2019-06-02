<template>
  <div id="betting-slip">
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
                <span v-if="bet.betType != 'total'" class="winner">{{
                  bet.winner
                }}</span>
                <!-- Inserted Value !-->
                <span v-if="bet.betType == 'total'" class="odds pull-right">{{
                  bet.totalValue
                }}</span>
                <span v-if="bet.betType == 'spread'" class="odds pull-right">{{
                  bet.handicap
                }}</span>
                <span class="odds pull-right">{{ bet.odds / 10000 }}</span>
              </div>

              <div class="input-field bet-stake-container">
                <div class="stake-input">
                  <!--<label :for="bet.betId">Enter Bet Stake</label>-->
                  <input
                    :id="bet.betId"
                    class="bet-stake validate"
                    name="Bet Id"
                    type="text"
                    maxlength="10"
                    v-on:input="calcPotentialWinnings($event, bet.odds, index)"
                    placeholder="Enter Bet Stake"
                  />
                  <span
                    class="helper-text"
                    data-error="Invalid Stake"
                    data-success
                  ></span>
                </div>
                <div class="stake-button">
                  <button
                    :id="'place-bet-button-' + index"
                    class="pull-right btn disabled"
                    @click="placeBet(bet.betId)"
                  >
                    Bet
                  </button>
                </div>
              </div>

              <div :id="'bet-warning-' + index" class="bet-warning hide"></div>

              <div class="bet-returns">
                <span class="pull-left potential-returns-headline"
                  >Potential Returns:</span
                >

                <span
                  :id="'potential-returns-' + index"
                  class="potential-returns pull-right"
                  >0 {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}</span
                >

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
import Vuex from 'vuex';
import constants from '../../../../main/constants/constants';
import wagerrRPC from '@/services/api/wagerrRPC';

export default {
  name: 'BetSlip',

  computed: {
    ...Vuex.mapGetters([
      'balance',
      'pending',
      'betSlip',
      'getNumBets',
      'getNetworkType'
    ])
  },

  methods: {
    ...Vuex.mapActions(['addToBetSlip', 'removeBetFromSlip', 'clearBetSlip']),

    // Calculate the potential winnings of a bet.
    calcPotentialWinnings: function(event, odds, index) {
      odds = odds / constants.ODDS_DIVISOR;
      let betFeePercent = 0.06;
      let betStake = event.target.value;
      let grossWinnings = odds * betStake;
      let grossProfit = grossWinnings - betStake;
      let betFee = grossProfit * betFeePercent;
      let netWinnings = grossWinnings - betFee;

      // Set the potential winnings on the UI.
      document.getElementById('potential-returns-' + index).innerText =
        netWinnings.toFixed(8) +
        (this.getNetworkType === 'Testnet' ? ' tWGR' : ' WGR');

      // If the bet stake is more than the available balance, disable the bet button and show a warning.
      if (
        this.balance < betStake ||
        betStake < constants.MIN_BET_AMOUNT ||
        betStake > constants.MAX_BET_AMOUNT
      ) {
        document
          .getElementById('place-bet-button-' + index)
          .classList.add('disabled');
        this.showBetWarning(betStake, index);
      } else if (this.balance > betStake) {
        document
          .getElementById('place-bet-button-' + index)
          .classList.remove('disabled');
        this.showBetWarning(betStake, index);
      }
    },

    showBetWarning: function(betStake, index) {
      if (this.balance < betStake && this.pending > betStake) {
        document
          .getElementById('bet-warning-' + index)
          .classList.remove('hide');
        document.getElementById('bet-warning-' + index).innerText =
          'Available balance too low. Please wait for your pending balance of ' +
          this.pending +
          ' ' +
          (this.getNetworkType === 'Testnet' ? ' tWGR' : ' WGR') +
          ' to be confirmed.';
      } else if (betStake < 25 || betStake > 10000) {
        document
          .getElementById('bet-warning-' + index)
          .classList.remove('hide');
        document.getElementById('bet-warning-' + index).innerText =
          'Incorrect bet amount. Please ensure your bet is between 25 - 10000 ' +
          (this.getNetworkType === 'Testnet' ? ' tWGR' : ' WGR') +
          ' inclusive.';
      } else if (this.balance < betStake) {
        document
          .getElementById('bet-warning-' + index)
          .classList.remove('hide');
        document.getElementById('bet-warning-' + index).innerText =
          'Available balance too low.';
      } else {
        document.getElementById('bet-warning-' + index).classList.add('hide');
        document.getElementById('bet-warning-' + index).innerText = '';
      }
    },

    // Place a bet on a given event and sent the tx to the Wagerr blockchain.
    placeBet: function(betId) {
      let betInfo = this.betSlip.find(item => item.betId === betId);
      let betAmount = parseFloat(document.getElementById(betId).value);
      let eventId = parseInt(betInfo.eventDetails.event_id);
      let self = this;

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
        });
    },

    handleScroll(event) {
      // Get the bet slip.
      let navbar = document.getElementById('betting-slip');

      // Get the offset position of the navbar.
      let sticky = navbar.offsetTop;

      if (window.pageYOffset >= sticky) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }
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

.bet-warning {
  background: $dark_grey;
  border-radius: 5px;
  color: $white;
  font-size: 12px;
  margin: 5px;
  padding: 10px;
}
</style>
