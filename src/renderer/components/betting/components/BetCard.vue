<template>
  <li class="bet-card">
    <div class="bet-card__header">
      <span class="bet-card__header-text">
        {{ bet.eventDetails.teams.home }} vs
        {{ bet.eventDetails.teams.away }}
      </span>

      <div class="bet-card__clear-btn" @click="removeBetFromSlip(bet.betId)">
        <i>&times;</i>
      </div>
    </div>

    <div class="bet-card__selection">
      <div class="bet-card__selection-title">Your Pick:</div>
      <span v-if="bet.betType !== 'total'" class="bet-card__selection-winner">
        {{ bet.winner }}
      </span>
      <span v-if="bet.betType === 'total'" class="bet-card__selection-odds">
        {{ bet.totalValue }}
      </span>
      <span v-if="bet.betType === 'spread'" class="bet-card__selection-odds">
        {{ bet.handicap }}
      </span>
      <span class="bet-card__selection-odds">
        {{ convertOdds(bet.odds) }}
      </span>
    </div>

    <template v-if="betType === 'single'">
      <div class="input-field bet-card__input-field">
        <div class="stake-input bet-card__input-field-wrapper">
          <input
            :id="bet.betId"
            v-model="betValue"
            :disabled="bet.availability === false"
            :placeholder="betPlaceholder"
            class="bet-card__input validate"
            name="Bet Id"
            type="text"
            maxlength="10"
          />
        </div>

        <button
          class="btn bet-card__input-field-btn"
          :class="{
            disabled: warningMessage.length !== 0 || betValueNum === 0
          }"
          @click.prevent="placeBetHandler"
        >
          Bet
        </button>
      </div>

      <div
        :class="[
          'bet-slip__warning',
          { 'display-none': warningMessage.length === 0 }
        ]"
      >
        {{ warningMessage }}
      </div>

      <div class="bet-card__return bet-returns">
        <span class="bet-card__return-title">
          Potential Returns:
        </span>

        <span class="bet-card__return-value">
          {{ potentialWinnings }} {{ wagerrCode }}
        </span>
      </div>
    </template>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { bettingParams } from 'src/main/constants/constants';

export default {
  name: 'BetCard',

  props: {
    bet: {
      required: true,
      type: Object
    },
    wagerrCode: {
      required: true,
      type: String
    },
    placeBet: {
      required: true,
      type: Function
    }
  },

  data() {
    return {
      betValue: ''
    };
  },

  computed: {
    ...mapGetters(['convertOdds', 'betType', 'balance', 'pending', 'immature']),
    betValueNum() {
      return this.betValue ? parseInt(this.betValue, 10) : 0;
    },

    betPlaceholder() {
      return this.bet.availability === true
        ? 'Enter Bet Stake'
        : 'Not Available';
    },

    warningMessage() {
      if (this.bet.availability === false) {
        return 'Sorry, you can not make a bet within 12 minutes of the Event.';
      }

      if (this.betValueNum === 0) {
        return '';
      }

      if (this.balance < this.betValueNum && this.pending > this.betValueNum) {
        return `Available balance too low. Please wait for your pending balance of ${this.pending} ${this.wagerrCode} to be confirmed.`;
      }

      if (this.balance < this.betValueNum && this.immature > this.betValueNum) {
        return `Available balance too low. Please wait for your immature balance of ${this.immature} ${this.wagerrCode} to be confirmed.`;
      }

      if (
        this.betValueNum < bettingParams.MIN_BET_AMOUNT ||
        this.betValueNum > bettingParams.MAX_BET_AMOUNT
      ) {
        return `Incorrect bet amount. Please ensure your bet is between 25 - 10000 ${this.wagerrCode} inclusive.`;
      }

      if (this.balance < this.betValueNum) {
        return 'Available balance too low.';
      }

      return '';
    },

    // TODO: put in utilities
    potentialWinnings() {
      if (this.warningMessage.length !== 0) {
        return (0).toFixed(8);
      }

      const grossWinnings =
        (this.bet.odds / bettingParams.ODDS_DIVISOR) * this.betValueNum;
      const grossProfit = grossWinnings - this.betValueNum;
      const betFee = grossProfit * bettingParams.NETWORK_SHARE;

      return (grossWinnings - betFee).toFixed(8);
    }
  },

  watch: {
    betValue: function watchBetValue(value, oldValue) {
      if (value !== oldValue && /^\d{0,10}$/g.test(value)) {
        this.betValue = value;
      } else {
        this.betValue = oldValue;
      }
    }
  },

  methods: {
    ...mapActions(['removeBetFromSlip']),
    placeBetHandler() {
      const {
        betId,
        outcome,
        eventDetails: { event_id: eventId }
      } = this.bet;
      const nEventId = parseInt(eventId, 10);

      this.placeBet(
        betId,
        [
          {
            eventId: nEventId,
            outcome
          }
        ],
        this.betValueNum
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.bet-card {
  background: transparent;
  color: $gray-900;
  padding: 0 0 10px;
  border: 2px solid $wagerr-red;
  margin: 0 0 10px;

  &__header {
    color: $white;
    background: $wagerr-red;
    border-bottom: 2px solid $wagerr-red;
    display: flex;
    justify-content: space-between;
    font-family: 'Montserrat', monospace;
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    padding-left: 10px;
  }

  &__header-text {
    margin-top: 6px;
    margin-right: 10px;
  }

  &__clear-btn {
    cursor: pointer;
    min-width: 30px;
    min-height: 30px;
    max-height: 30px;
    flex-grow: 0;
    text-align: center;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-style: normal;
    }

    &:hover {
      background: $wagerr-red-dark;
    }
  }

  &__selection {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
    padding: 15px 10px 10px;
    text-align: center;
  }

  &__selection-title {
    color: $gray-550;
    font-family: 'Open Sans', sans-serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1px;
    line-height: 18px;
    text-transform: uppercase;
    width: 100%;
  }

  &__selection-winner {
    color: $wagerr-red;
    font-size: 18px;
    line-height: 20px;
    padding-bottom: 5px;
  }

  &__selection-odds {
    color: $gray-900;
    background: $gray-200;
    border-radius: 4px;
    display: inline-block;
    margin: 5px 20% 0;
    letter-spacing: 1px;
    padding: 4px 0;
    width: 60%;
  }

  &__input-field {
    display: flex;
    justify-content: center;
    padding: 0;
  }

  &__input-field-wrapper {
    width: 120px;

    & input:not(.browser-default) {
      color: $black;
      background: $gray-200;
      box-shadow: 0 1px 0 0 $gray-600;
      font-size: 18px;
      height: 33px;
      margin-bottom: 0;

      &:focus {
        color: inherit !important; // have no any other cases
      }
    }
  }

  &__input {
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    text-align: center;

    &::placeholder {
      font-size: 13px;
      font-weight: 600;
    }

    // TODO: replace vendors by postcss auto-prefixer

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

    // ---------------------
  }

  &__input-field-btn {
    border-radius: 0;
    box-shadow: none;
    font-weight: 700;
    height: 35px;
    line-height: 35px;
    padding-top: 2px;
  }

  &__return {
    color: $gray-900;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    padding: 5px 10px;
    text-align: center;
  }

  &__return-title {
    color: inherit;
    display: block;
    font-size: 13px;
    margin-bottom: 2px;
  }

  &__return-value {
    color: $wagerr-red;
    display: block;
    font-size: 12px;
    letter-spacing: 0.5px;
  }
}
</style>
