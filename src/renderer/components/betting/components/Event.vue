<template>
  <li class="card event">
    <div class="event__tournament">
      <span
        v-html="`${event.show.tournament} (Event ID: ${event.show.eventId})`"
      >
      </span>
      <span v-html="event.show.starting"></span>
    </div>

    <div class="event__details">
      <div class="col s12 m4"></div>
      <div class="col s12 m8">
        <div class="row event__header">
          <div class="col s12 m4 text-center">
            <div>Money Line</div>
          </div>

          <div class="col s12 m4 text-center">
            <div>Spread</div>
          </div>

          <div class="col s12 m4 text-center">
            <div>Total</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row event__pair">
      <div class="col s12 m4">
        <div class="event__team" v-html="event.show.homeTeam"></div>

        <div class="event__team" v-html="event.show.awayTeam"></div>

        <div class="event__team">
          Draw
        </div>
      </div>

      <div class="col s12 m8">
        <div class="row event__odds">
          <!-- Show Money line odds if market is open for current event. -->
          <div class="col s12 m4">
            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="event.odds[0].mlHome === 0 || disableButton"
                @click="
                  createBet(
                    event.event_id,
                    1,
                    event.teams.home,
                    event.odds[0].mlHome
                  )
                "
                v-html="
                  event.odds[0].mlHome === 0 ? '-' : event.show.mlHomeOdds
                "
              ></button>
            </div>

            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="event.odds[0].mlAway === 0 || disableButton"
                @click="
                  createBet(
                    event.event_id,
                    2,
                    event.teams.away,
                    event.odds[0].mlAway
                  )
                "
                v-html="
                  event.odds[0].mlAway === 0 ? '-' : event.show.mlAwayOdds
                "
              ></button>
            </div>

            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="event.odds[0].mlDraw === 0 || disableButton"
                @click="
                  createBet(event.event_id, 3, 'Draw', event.odds[0].mlDraw)
                "
                v-html="
                  event.odds[0].mlDraw === 0 ? '-' : event.show.mlDrawOdds
                "
              ></button>
            </div>
          </div>

          <!-- Show Spread odds if market is open for current event. -->
          <div class="col s12 m4">
            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="
                  event.odds[1].spreadHome === 0 || disableButton
                "
                @click="
                  createBet(
                    event.event_id,
                    4,
                    event.teams.home,
                    event.odds[1].spreadHome,
                    'spread',
                    `Handicap ${handicapCalc(true, event)}${event.odds[1].spreadPoints / 100}`,
                    null
                  )
                "
              >
                <template v-if="event.odds[1].spreadHome === 0">
                  -
                </template>
                <template v-else>
                  <span
                    class="pull-left"
                    v-html="`${handicapCalc(true, event)}${event.odds[1].spreadPoints / 100}`"
                  ></span>
                  <span
                    class="pull-right"
                    v-html="event.show.spreadHomeOdds"
                  ></span>
                </template>
              </button>
            </div>

            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="
                  event.odds[1].spreadAway === 0 || disableButton
                "
                @click="
                  createBet(
                    event.event_id,
                    5,
                    event.teams.away,
                    event.odds[1].spreadAway,
                    'spread',
                    `Handicap ${handicapCalc(false, event)}${(event.odds[1].spreadPoints / 100) * -1}`,
                    null
                  )
                "
              >
                <template v-if="event.odds[1].spreadAway === 0">
                  -
                </template>
                <template v-else>
                  <span
                    class="pull-left"
                    v-html="`${handicapCalc(false, event)}${(event.odds[1].spreadPoints / 100) * -1}`"
                  ></span>
                  <span
                    class="pull-right"
                    v-html="event.show.spreadAwayOdds"
                  ></span>
                </template>
              </button>
            </div>
          </div>

          <!-- Show Totals odds if market is open for current event. -->
          <div class="col s12 m4">
            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="
                  event.odds[2].totalsOver === 0 || disableButton
                "
                @click="
                  createBet(
                    event.event_id,
                    6,
                    event.teams.home,
                    event.odds[2].totalsOver,
                    'total',
                    null,
                    `Over${event.odds[2].totalsPoints / 100}`
                  )
                "
              >
                <template v-if="event.odds[2].totalsOver === 0">
                  -
                </template>
                <template v-else>
                  <span
                    class="event__button-totalnum"
                    v-html="`(0${event.show.totalsPointsOdds / 10})`"
                  ></span>
                  <span v-html="event.show.totalsOverOdds"></span>
                </template>
              </button>
            </div>

            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="
                  event.odds[2].totalsUnder === 0 || disableButton
                "
                @click="
                  createBet(
                    event.event_id,
                    7,
                    event.teams.home,
                    event.odds[2].totalsUnder,
                    'total',
                    null,
                    `Under${event.odds[2].totalsPoints / 100}`
                  )
                "
              >
                <template v-if="event.odds[2].totalsUnder === 0">
                  -
                </template>
                <template v-else>
                  <span
                    class="event__button-totalnum"
                    v-html="`(U${event.show.totalsPointsOdds / 10})`"
                  ></span>
                  <span v-html="event.show.totalsUnderOdds"></span>
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- event-odds ends -->
    </div>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import uniqueId from 'lodash/uniqueId';

export default {
  name: 'Event',

  props: {
    event: {
      required: true,
      type: Object
    }
  },

  computed: {
    ...mapGetters(['betType', 'betSlip', 'eventsList', 'getNumBets']),
    mlWinner() {
      const {
        odds: [{ mlHome, mlAway }]
      } = this.event;

      if (mlHome > mlAway) {
        return 'home';
      }

      if (mlAway > mlHome) {
        return 'away';
      }

      return 'equal';
    },

    // When betting on a parlay you cannot add two bets from the same event. The daemon also blocks
    // this, but better to stop it on the UI first.
    disableButton() {
      let disable = false;
      if (this.betType === 'single' || this.betSlip.length === 0) {
        return disable;
      }

      this.betSlip.forEach((bet) => {
        if (bet.eventDetails.event_id === this.event.event_id) {
          disable = true;
        }
      });

      return disable;
    }
  },

  methods: {
    ...mapActions(['addBetToSlip']),
    createBet(
      eventId,
      outcome,
      winner,
      odds,
      betType = null,
      handicap = null,
      totalValue = null
    ) {
      if (this.betType === 'multi' && this.getNumBets === 5) {
        M.toast({
          html: `<span class="toast__bold-font">Error &nbsp;</span> you can't add more than 5 legs to one parlay bet`,
          classes: 'wagerr-red-bg'
        });

        return;
      }

      const betData = {
        betId: uniqueId('bet-id_'),
        outcome,
        winner,
        odds,
        eventDetails: this.event,
        betType,
        handicap,
        totalValue,
        availability: true
      };
      console.log('----------Going to create bet placer----------', betData);
      this.addBetToSlip(betData);
    },

    handicapCalc(homeTeam, event) {
      let homeTeamModifier;
      let awayTeamModifier;
      console.log(event);
      if (event.odds[1].spreadPoints > 0) {
        homeTeamModifier = '+';
        awayTeamModifier = '';
      } else {
        homeTeamModifier = '';
        awayTeamModifier = '+';
      }

      if (homeTeam) {
        return homeTeamModifier;
      }

      if (!homeTeam) {
        return awayTeamModifier;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.event {
  border-radius: 4px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  overflow: hidden;

  &__tournament {
    background: $wagerr-red;
    color: $white;
    display: flex;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 700;
    justify-content: space-between;
    line-height: 20px;
    padding: 10px 10px 8px;
  }

  &__details {
    color: $white;
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 600;
    line-height: 20px;

    & > * {
      background-color: $wagerr-red-dark;
      height: 28px;
    }
  }

  &__header {
    padding: 4px 0;
    margin-bottom: 0;
  }

  &__pair {
    margin: 0;
    padding: 0 0.75rem;

    & > * {
      margin: 10px 0;
      padding: 0;
    }
  }

  &__team {
    color: $gray-900;
    font-size: 17.5px;
    font-weight: 700;
    line-height: 50px;
    margin: 0;
    width: 100%;
  }

  &__odds {
    margin: 0;
  }

  &__odd {
    height: 50px;
    margin: 0;
    display: inline-block;
    width: 100%;
  }

  &__button {
    color: #555;
    background-color: #e9e9e9;
    border: 1px solid #bebebe;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.5);
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.5px;
    margin: 10px 0;
    height: 40px;
    width: 100%;

    &::before {
      content: '';
      background-image: url('~@/assets/images/bumps.svg');
      background-position: center center;
      background-repeat: no-repeat;
      width: 0;
      height: 26px;
      position: absolute;
      left: 3px;
      top: 7px;
      opacity: 0.1;
    }

    &::after {
      content: '';
      background-image: url('~@/assets/images/bumps.svg');
      background-position: center center;
      background-repeat: no-repeat;
      width: 0;
      height: 26px;
      position: absolute;
      right: 3px;
      top: 7px;
      opacity: 0.1;
    }

    &:focus {
      background-color: #e9e9e9;
    }

    &:hover {
      color: $white;
      border: 1px solid $wagerr-red-dark;
      background-color: $wagerr-red-light;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2),
        inset 0 0 0 1px rgba(255, 255, 255, 0.2);
      &::before {
        opacity: 0.3;
      }
      &::after {
        opacity: 0.3;
      }
    }

    &:active {
      background-color: $wagerr-red-dark;
    }

    &[disabled='disabled'] {
      box-shadow: none;
      background-color: #f3f3f3 !important;
      border: none;

      &::before {
        opacity: 0;
      }

      &::after {
        opacity: 0;
      }
    }
  }

  &__button-totalnum {
    font-weight: 700;
  }
}
</style>
