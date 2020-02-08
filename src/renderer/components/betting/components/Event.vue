<template>
  <li class="card event">
    <div class="event__tournament">
      <span>
        {{ `${event.show.tournament} (Event ID: ${event.show.eventId})` }}
      </span>
      <span>
        {{ event.show.starting }}
      </span>
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
        <div class="event__team">
          {{ event.show.homeTeam }}
        </div>

        <div class="event__team">
          {{ event.show.awayTeam }}
        </div>

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
                :disabled="event.odds[0].mlHome === 0 || disabledButtons.has(1)"
                @click="
                  createBet(
                    event.event_id,
                    1,
                    event.teams.home,
                    event.odds[0].mlHome
                  )
                "
              >
                {{ event.odds[0].mlHome === 0 ? '-' : event.show.mlHomeOdds }}
              </button>
            </div>

            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="event.odds[0].mlAway === 0 || disabledButtons.has(2)"
                @click="
                  createBet(
                    event.event_id,
                    2,
                    event.teams.away,
                    event.odds[0].mlAway
                  )
                "
              >
                {{ event.odds[0].mlAway === 0 ? '-' : event.show.mlAwayOdds }}
              </button>
            </div>

            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="event.odds[0].mlDraw === 0 || disabledButtons.has(3)"
                @click="
                  createBet(event.event_id, 3, 'Draw', event.odds[0].mlDraw)
                "
              >
                {{ event.odds[0].mlDraw === 0 ? '-' : event.show.mlDrawOdds }}
              </button>
            </div>
          </div>

          <!-- Show Spread odds if market is open for current event. -->
          <div class="col s12 m4">
            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="
                  event.odds[1].spreadHome === 0 || disabledButtons.has(4)
                "
                @click="
                  createBet(
                    event.event_id,
                    4,
                    event.teams.home,
                    event.odds[1].spreadHome,
                    'spread',
                    `Handicap ${mlWinner === 'home' ? '+' : '-'}${event.odds[1]
                      .spreadPoints / 10}`,
                    null
                  )
                "
              >
                <template v-if="event.odds[1].spreadHome === 0">
                  -
                </template>
                <template v-else>
                  <span class="pull-left">
                    {{
                      `${mlWinner === 'home' ? '+' : '-'} ${
                        event.show.spreadPointsOdds
                      }`
                    }}
                  </span>

                  <span class="pull-right">
                    {{ event.show.spreadHomeOdds }}
                  </span>
                </template>
              </button>
            </div>

            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="
                  event.odds[1].spreadAway === 0 || disabledButtons.has(5)
                "
                @click="
                  createBet(
                    event.event_id,
                    5,
                    event.teams.away,
                    event.odds[1].spreadAway,
                    'spread',
                    `Handicap ${mlWinner === 'away' ? '+' : '-'}${event.odds[1]
                      .spreadPoints / 10}`,
                    null
                  )
                "
              >
                <template v-if="event.odds[1].spreadAway === 0">
                  -
                </template>
                <template v-else>
                  <span class="pull-left">
                    {{
                      `${mlWinner === 'away' ? '+' : '-'} ${
                        event.show.spreadPointsOdds
                      }`
                    }}
                  </span>

                  <span class="pull-right">
                    {{ event.show.spreadAwayOdds }}
                  </span>
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
                  event.odds[2].totalsOver === 0 || disabledButtons.has(6)
                "
                @click="
                  createBet(
                    event.event_id,
                    6,
                    event.teams.home,
                    event.odds[2].totalsOver,
                    'total',
                    null,
                    `Over${event.odds[2].totalsPoints / 10}`
                  )
                "
              >
                <template v-if="event.odds[2].totalsOver === 0">
                  -
                </template>
                <template v-else>
                  <span class="event__button-totalnum">
                    {{ `(0${event.show.totalsPointsOdds})` }}
                  </span>
                  {{ event.show.totalsOverOdds }}
                </template>
              </button>
            </div>

            <div class="event__odd">
              <button
                class="btn event__button"
                :disabled="
                  event.odds[2].totalsUnder === 0 || disabledButtons.has(7)
                "
                @click="
                  createBet(
                    event.event_id,
                    7,
                    event.teams.home,
                    event.odds[2].totalsUnder,
                    'total',
                    null,
                    `Under${event.odds[2].totalsPoints / 10}`
                  )
                "
              >
                <template v-if="event.odds[2].totalsUnder === 0">
                  -
                </template>
                <template v-else>
                  <span class="event__button-totalnum">
                    {{ `(U${event.show.totalsPointsOdds})` }}
                  </span>
                  {{ event.show.totalsUnderOdds }}
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

const multiDisabled = {
  1: [1, 2, 3],
  2: [1, 2, 3],
  3: [1, 2, 3, 4, 5],
  4: [4, 5],
  5: [4, 5],
  6: [6, 7],
  7: [6, 7]
};

export default {
  name: 'Event',

  props: {
    event: {
      required: true,
      type: Object
    }
  },

  computed: {
    ...mapGetters(['betType', 'betSlip', 'eventsList']),
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
    disabledButtons() {
      if (this.betType === 'single' || this.betSlip.length === 0) {
        return new Set();
      }

      const result = this.betSlip.reduce((set, bet) => {
        if (bet.eventDetails.event_id === this.event.event_id) {
          set.push(...multiDisabled[bet.outcome]);

          if (bet.outcome === 1 && this.mlWinner === 'home') {
            set.push(5);
          }

          if (bet.outcome === 2 && this.mlWinner === 'away') {
            set.push(4);
          }
        }

        return set;
      }, []);

      return new Set(result);
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
      const eventDetails = this.eventsList.find(
        item => item.event_id === eventId
      );

      const betData = {
        betId: uniqueId(),
        outcome,
        winner,
        odds,
        eventDetails,
        betType,
        handicap,
        totalValue,
        availability: true
      };
      console.log('----------Going to create bet placer----------', betData);
      this.addBetToSlip(betData);
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
