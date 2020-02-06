<template>
  <div id="events" class="events">
    <div class="row search-row">
      <div class="col s4 offset-s4">
        <p class="n-events pull-right">Showing {{ nEvents }} events</p>
      </div>
      <div class="col s4">
        <input v-model="searchTermInput" type="text" placeholder="Search..." />
      </div>
    </div>

    <div v-if="events.length > 0">
      <ul class="events__list">
        <li
          is="event"
          v-for="event in events"
          :key="event.event_id"
          :event="event"
        ></li>
      </ul>
    </div>

    <div v-else class="text-center no-events no-transactions">
      <p>Currently, there are no events available for betting for this sport.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import _ from 'lodash';
import { shell } from 'electron';
import { betsmartParams } from '../../../../main/constants/constants';
import Event from '@/components/betting/components/Event.vue';

export default {
  name: 'EventList',

  components: { Event },

  data() {
    return {
      intervalHandle: 0,
      searchTermInput: '',
      searchTerm: ''
    };
  },

  computed: {
    ...mapGetters([
      'getEventsSportFilter',
      'eventsList',
      'getTimezone',
      'convertOdds',
      'betSlip'
    ]),
    nEvents() {
      return this.events.length;
    },
    events() {
      return !Array.isArray(this.eventsList)
        ? []
        : this.eventsList.reduce((acc, e) => {
            const event = { ...e };
            event.teams = { ...e.teams };
            event.odds = [...e.odds];
            event.show = {
              eventId: e.event_id.toString(),
              sport: e.sport,
              tournament: e.tournament,
              starting: moment(Number(e.starting) * 1000)
                .tz(this.getTimezone)
                .format('ddd, MMM Do h:mm A (Z z)'),
              homeTeam: e.teams.home,
              awayTeam: e.teams.away,
              mlHomeOdds: this.convertOdds(e.odds[0].mlHome),
              mlAwayOdds: this.convertOdds(e.odds[0].mlAway),
              mlDrawOdds: this.convertOdds(e.odds[0].mlDraw),
              spreadHomeOdds: this.convertOdds(e.odds[1].spreadHome),
              spreadAwayOdds: this.convertOdds(e.odds[1].spreadAway),
              spreadPointsOdds: e.odds[1].spreadPoints / 10,
              totalsOverOdds: this.convertOdds(e.odds[2].totalsOver),
              totalsUnderOdds: this.convertOdds(e.odds[2].totalsUnder),
              totalsPointsOdds: e.odds[2].totalsPoints / 10
            };

            if (!this.searchTerm) {
              acc.push(event);
            } else {
              const result = this._checkContainsSearchTermAndMark(event);
              if (result.hasSearchTerm) {
                event.show = result.show;
                acc.push(event);
              }
            }

            return acc;
          }, []);
    }
  },

  // use watcher on the EventsList if it changes, then update the betslip odds
  watch: {
    eventsList() {
      this.updateBetSlip();
    },
    searchTermInput(val, oldVal) {
      this._debouncedSearch.call(this, val, oldVal);
    }
  },

  mounted() {
    this.listEvents(this.getEventsSportFilter);

    // ping listevents every 5 secs for new and updated events.
    let isRunning = false;
    this.intervalHandle = setInterval(async () => {
      if (!isRunning) {
        isRunning = true;
        await this.listEvents(this.getEventsSportFilter);
        isRunning = false;
      }
    }, 5000);
  },

  beforeDestroy() {
    clearInterval(this.intervalHandle);
  },

  methods: {
    ...mapActions([
      'listEvents',
      'addBetToSlip',
      // 'testlistEvents',
      'updateBet'
    ]),

    _checkContainsSearchTermAndMark(event) {
      return Object.entries(event.show).reduce(
        (acc, [key, value]) => {
          let text = value.toString();
          const index = text
            .toLowerCase()
            .indexOf(this.searchTerm.toLowerCase());

          if (index >= 0) {
            const endSearchTerm = index + this.searchTerm.length;
            text = `${text.slice(0, index)}<mark>${text.slice(
              index,
              endSearchTerm
            )}</mark>${text.slice(endSearchTerm)}`;
            acc.hasSearchTerm = true;
          }

          acc.show[key] = text;
          return acc;
        },
        { hasSearchTerm: false, show: { ...events.show } }
      );
    },

    updateBetSlip() {
      // Todo: check if the bets are still available
      // For each item in betslip - set to unavailable if time restricted
      // and update odds
      // console.log("number of betslip",this.betSlip.length);
      // console.log("number of betslip", this.betSlip)

      for (const betItem of this.betSlip) {
        const eventDetails = this.eventsList.find(
          item => item.event_id === betItem.eventDetails.event_id
        );
        this.updateBet({ betItem, eventDetails });
      }
    },

    _debouncedSearch: _.debounce(function(val, oldVal) {
      if (val !== oldVal) {
        this.searchTerm = val;
      }
    }, 300)
  }
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.events {
  &__list {
    margin-top: 10px;
  }
}

input::placeholder {
  color: #555;
}

.n-events {
  color: #999;
  font-size: 14px;
}

.options div {
  width: 33.3%;
  float: left;
}

.no-events p {
  font-size: 1.5em;
}

.fa-calendar-times {
  font-size: 150px;
  color: $wagerr-red-dark;
  margin-bottom: 29%;
}

.no-transactions {
  margin-top: 10px;
}

input[type='text']:not(.browser-default):focus:not([readonly]) {
  border-bottom: 1px solid $wagerr-red;
  box-shadow: 0 1px 0 0 $wagerr-red;
}
</style>
