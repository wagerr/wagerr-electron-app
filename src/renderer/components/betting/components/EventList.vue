<template>
  <div id="events">
    <div v-if="eventsList.length > 0">
      <ul class="events-list">
        <li v-for="event in eventsList" :key="event.event_id" class="card">
          <div class="event-tournament">
            <span class="sport">{{ event.tournament }} (Event ID: {{ event.event_id }})</span>
            <span class="date pull-right">{{
              Number(event.starting) | moment('timezone', getTimezone, 'LLL')
            }}</span>
          </div>

          <div class="event-details">
            <div class="col s12 m4">
              <span></span>
            </div>
            <div class="col s12 m8 event-headers">
              <div class="row event-header">
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

          <div class="event-pair row">
            <div class="col s12 m4 event-teams">
              <div class="teams">
                <div class="team-name">{{ event.teams.home }}</div>
              </div>

              <div class="teams">
                <div class="team-name">{{ event.teams.away }}</div>
              </div>

              <div class="teams">
                <div class="team-name">Draw</div>
              </div>
            </div>
            <div class="col s12 m8 event-odds">
              <div class="row event-odds-row">
                <!-- Show Money line odds if market is open for current event. -->
                <div v-if="isEventMLOddsSet(event)" class="col s12 m4 odds">
                  <div class="odd">
                    <button
                      v-if="event.odds[0].mlHome !== 0"
                      class="waves-effect waves-light btn"
                      @click="
                        createBet(
                          event.event_id,
                          1,
                          event.teams.home,
                          event.odds[0].mlHome
                        )
                      "
                    >
                      {{ event.odds[0].mlHome / oddsDivisor }}
                    </button>

                    <button
                      v-else
                      class="waves-effect waves-light btn"
                      disabled
                    >
                      N/A
                    </button>
                  </div>
                  <div class="odd">
                    <button
                      v-if="event.odds[0].mlAway !== 0"
                      class="waves-effect waves-light btn"
                      @click="
                        createBet(
                          event.event_id,
                          2,
                          event.teams.away,
                          event.odds[0].mlAway
                        )
                      "
                    >
                      {{ event.odds[0].mlAway / oddsDivisor }}
                    </button>

                    <button
                      v-else
                      class="waves-effect waves-light btn"
                      disabled
                    >
                      N/A
                    </button>
                  </div>
                  <div class="odd">
                    <button
                      v-if="event.odds[0].mlDraw !== 0"
                      class="waves-effect waves-light btn"
                      @click="
                        createBet(
                          event.event_id,
                          3,
                          'Draw',
                          event.odds[0].mlDraw
                        )
                      "
                    >
                      {{ event.odds[0].mlDraw / oddsDivisor }}
                    </button>

                    <button
                      v-else
                      class="waves-effect waves-light btn"
                      disabled
                    >
                      N/A
                    </button>
                  </div>
                </div>

                <!-- Show money line market closed -->
                <div v-else class="col s12 m4 odds">
                  <div class="ml">
                    <button class="waves-effect waves-light btn" disabled>
                      N/A
                    </button>
                  </div>
                  <div class="ml">
                    <button class="waves-effect waves-light btn" disabled>
                      N/A
                    </button>
                  </div>
                </div>

                <!-- Show Spread odds if market is open for current event. -->
                <div
                  v-if="isEventSpreadsOddsSet(event)"
                  class="col s12 m4 odds"
                >
                  <div class="spread">
                    <button
                      class="waves-effect waves-light btn"
                      @click="
                        createBet(
                          event.event_id,
                          4,
                          event.teams.home,
                          event.odds[1].spreadHome,
                          'spread',
                          `Handicap ${
                            event.odds[0].mlHome > event.odds[0].mlAway
                              ? '+'
                              : '-'
                          }${event.odds[1].spreadPoints / 10}`,
                          null
                        )
                      "
                    >
                      <span class="pull-left"
                        >{{
                          event.odds[0].mlHome > event.odds[0].mlAway
                            ? '+'
                            : '-'
                        }}{{ event.odds[1].spreadPoints / 10 }}</span
                      >

                      <span class="pull-right">{{
                        event.odds[1].spreadHome / oddsDivisor
                      }}</span>
                    </button>
                  </div>
                  <div class="spread">
                    <button
                      class="waves-effect waves-light btn"
                      @click="
                        createBet(
                          event.event_id,
                          5,
                          event.teams.away,
                          event.odds[1].spreadAway,
                          'spread',
                          `Handicap ${
                            event.odds[0].mlAway > event.odds[0].mlHome
                              ? '+'
                              : '-'
                          }${event.odds[1].spreadPoints / 10}`,
                          null
                        )
                      "
                    >
                      <span class="pull-left"
                        >{{
                          event.odds[0].mlAway > event.odds[0].mlHome
                            ? '+'
                            : '-'
                        }}{{ event.odds[1].spreadPoints / 10 }}</span
                      >

                      <span class="pull-right">{{
                        event.odds[1].spreadAway / oddsDivisor
                      }}</span>
                    </button>
                  </div>
                </div>

                <!-- Show Spread market closed -->
                <div v-else class="col s12 m4 odds">
                  <div class="spread">
                    <button class="waves-effect waves-light btn" disabled>
                      N/A
                    </button>
                  </div>
                  <div class="spread">
                    <button class="waves-effect waves-light btn" disabled>
                      N/A
                    </button>
                  </div>
                </div>

                <!-- Show Totals odds if market is open for current event. -->
                <div v-if="isEventTotalsOddsSet(event)" class="col s12 m4 odds">
                  <div class="total">
                    <button
                      class="waves-effect waves-light btn"
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
                      <span class="pull-left"
                        >O{{ event.odds[2].totalsPoints / 10 }}</span
                      >

                      <span class="pull-right">{{
                        event.odds[2].totalsOver / oddsDivisor
                      }}</span>
                    </button>
                  </div>
                  <div class="total">
                    <button
                      class="waves-effect waves-light btn"
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
                      <span class="pull-left"
                        >U{{ event.odds[2].totalsPoints / 10 }}</span
                      >

                      <span class="pull-right">{{
                        event.odds[2].totalsUnder / oddsDivisor
                      }}</span>
                    </button>
                  </div>
                </div>

                <!-- Show Totals market closed -->
                <div v-else class="col s12 m4 odds">
                  <div class="total">
                    <button class="waves-effect waves-light btn" disabled>
                      N/A
                    </button>
                  </div>
                  <div class="total">
                    <button class="waves-effect waves-light btn" disabled>
                      N/A
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- event-odds ends -->
          </div>
        </li>
      </ul>
    </div>

    <div v-else class="text-center no-events no-transactions">
      <p>
        Currently, there are no events available for betting for this sport.
      </p>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import moment from 'moment';
import constants from '../../../../main/constants/constants';

export default {
  name: 'EventList',

  computed: {
    ...Vuex.mapGetters(['getEventsFilter', 'eventsList', 'getTimezone'])
  },

  methods: {
    ...Vuex.mapActions(['listEvents', 'addBetToSlip', 'clearBetSlip']),

    moment: function() {
      return moment();
    },

    // Create a unique bet ID.
    createBetId: function() {
      return (
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15)
      );
    },

    // Creates bet data and adds to the betslip.
    createBet: function(
      eventId,
      outcome,
      winner,
      odds,
      betType = null,
      handicap = null,
      totalValue = null
    ) {
      console.log(this.eventsList);
      let eventDetails = this.eventsList.find(
        item => item.event_id === eventId
      );
      let betId = this.createBetId();

      let betData = {
        betId: betId,
        outcome: outcome,
        winner: winner,
        odds: odds,
        eventDetails: eventDetails,
        betType: betType,
        handicap: handicap,
        totalValue: totalValue
      };
      console.log('----------Going to create bet placer----------', betData);
      this.addBetToSlip(betData);
    },

    // Check if money line odds are available for a given event.
    isEventMLOddsSet: function(event) {
      return !(
        event.odds[0].mlHome === 0 &&
        event.odds[0].mlAway === 0 &&
        event.odds[0].mlDraw === 0
      );
    },

    // Check if spreads odds are available for a given event.
    isEventSpreadsOddsSet: function(event) {
      return !(
        event.odds[1].spreadHome === 0 && event.odds[1].spreadAway === 0
      );
    },

    // Check if the totals odds are available for a given event.
    isEventTotalsOddsSet: function(event) {
      return !(
        event.odds[2].totalsOver === 0 && event.odds[2].totalsUnder === 0
      );
    },

    isPulledEvent: function(event) {
      let mlOddsSet = this.isEventMLOddsSet();
      let spreadOddsSet = this.isEventSpreadsOddsSet();
      let totalsOdds = this.isEventTotalsOddsSet();

      return mlOddsSet && spreadOddsSet && totalsOdds;
    }
  },

  data() {
    return {
      oddsDivisor: constants.ODDS_DIVISOR,
      timeout: 0
    };
  },

  created() {
    this.listEvents(this.getEventsFilter);

    // ping listevents every 5 secs for new and updated events.
    this.timeout = setInterval(
      async function() {
        this.listEvents(this.getEventsFilter);
      }.bind(this),
      5000
    );
  },

  destroyed() {
    clearInterval(this.timeout);
  }
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/_variables.scss';

.events-list li {
  border: 1px solid #414141;
}

.options div {
  width: 33.3%;
  float: left;
}

.event-tournament {
  background-color: $dark_grey;
  border-bottom-width: 1px;
  border-bottom-color: $light_grey;
  border-bottom-style: solid;
  color: #eeeeee;
  font-weight: bold;
  padding: 5px;
}

.event-details {
  margin-right: -0.75px;
}

.event-details div {
  background-color: $dark_grey;
  color: $white;
  font-size: 12px;
  padding: 0px 5px 0px 5px;
}

.event-details span {
  margin-right: 5%;
}

.event-pair {
  margin-left: 0%;
}

.event-teams {
  margin-top: 10px;
}

.event-teams span {
  font-size: 1.1em;
  padding-top: 40px;
}

.event-pair .odds {
  margin-top: 1%;
  margin-bottom: 1%;
}

.event-pair .odds button {
  width: 100%;
}

.event-pair .odds .btn {
  color: #fd2626;
  background-color: #414141;
}

.event-pair .odds .btn:visited {
  background-color: #414141;
}

.event-pair .odds .btn:hover {
  background-color: #757575;
}

.event-pair .odds .btn:active {
  background-color: #757575;
}

.event-pair .odds .btn:focus {
  background-color: #414141;
}

.odds {
  margin-right: -0.5%;
}

.odds button {
  width: 100%;
  margin-bottom: 2px;
  font-size: 0.9em;
}

.event-teams div {
  font-size: 1.1em;
  margin-top: 12px;
}

.no-events p {
  font-size: 1.5em;
}

.fa-calendar-times {
  font-size: 150px;
  color: $wagerr_dark_red;
  margin-bottom: 29%;
}

.no-transactions {
  margin-top: 10px;
}
</style>
