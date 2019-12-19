<template>
  <nav>
    <h5>Top Sports</h5>
    <ul class="side-nav">
      <li
        v-for="sport in topSports"
        :key="sport.name"
        v-bind:class="{ on: getEventsSportFilter === resolveSportId(sport) }"
      >
        <div class="parent">
          <a @click="filterEventsBySport(resolveSportId(sport))">
            <i :class="sport.icon"></i>
            <span>{{ sport.name }}</span>
            <span
              v-if="getNEvents(resolveSportId(sport)) > 0"
              class="pull-right n-events"
            >
              <small>({{ getNEvents(resolveSportId(sport)) }})</small>
            </span>
          </a>
        </div>
        <ul
          class="tournaments-dropdown"
          v-if="
            getEventsSportFilter === resolveSportId(sport) &&
              hasTournaments(sport.name)
          "
        >
          <li
            v-for="tournament in getTournaments(sport.name)"
            :key="tournament"
            @click="filterEventsByTournament(tournament)"
            v-bind:class="{ on: getEventsTournamentFilter === tournament }"
          >
            <div class="tournament" :title="tournament">
              <span>{{ tournament }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>

    <h5>A-Z Sports</h5>
    <ul class="side-nav">
      <li
        v-for="sport in otherSports"
        :key="sport.name"
        v-bind:class="{ on: getEventsSportFilter === resolveSportId(sport) }"
      >
        <div class="parent">
          <a @click="filterEventsBySport(resolveSportId(sport))">
            <i :class="sport.icon"></i>
            <span>{{ sport.name }}</span>
            <span
              v-if="getNEvents(resolveSportId(sport)) > 0"
              class="pull-right n-events"
            >
              <small>({{ getNEvents(resolveSportId(sport)) }})</small>
            </span>
          </a>
        </div>
        <ul
          class="tournaments-dropdown"
          v-if="
            getEventsSportFilter === resolveSportId(sport) &&
              hasTournaments(sport.name)
          "
        >
          <li
            v-for="tournament in getTournaments(sport.name)"
            :key="tournament"
            @click="filterEventsByTournament(tournament)"
            v-bind:class="{ on: getEventsTournamentFilter === tournament }"
          >
            <div class="tournament" :title="tournament">
              <span>{{ tournament }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
import Vuex from 'vuex';
import { SPORTS_AVAILABLE } from '../../main/constants/constants';

export default {
  name: 'SideNavBar',

  data: () => {
    return {
      sportsAvailable: [...SPORTS_AVAILABLE]
    };
  },

  computed: {
    ...Vuex.mapGetters([
      'getEventsSportFilter',
      'getEventsTournamentFilter',
      'getTournaments',
      'hasTournaments',
      'getNEvents'
    ]),

    topSports: function() {
      return this.sportsAvailable.filter(function(s) {
        return s.favorite;
      });
    },

    otherSports: function() {
      return this.sportsAvailable.filter(function(s) {
        return !s.favorite;
      });
    }
  },

  methods: {
    ...Vuex.mapActions([
      'updateEventsSportFilter',
      'updateEventsTournamentFilter',
      'listEvents'
    ]),

    filterEventsBySport: async function(sportFilter) {
      await this.updateEventsSportFilter(sportFilter);
      await this.listEvents();
    },

    filterEventsByTournament: async function(tournamentFilter) {
      await this.updateEventsTournamentFilter(tournamentFilter);
      await this.listEvents();
    },

    resolveSportId: sport => {
      return sport.id === '' || sport.id ? sport.id : sport.name;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';

.side-nav {
  margin-top: 7px;
  display: table;
}

nav {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 160px;
  height: 100%;
  background-color: $gray-900;
  padding-top: 60px;
  z-index: 1;
}

nav ul {
  margin: 0px;
  padding: 0px;
}

nav ul li {
  .n-events {
    margin-right: 8px !important;
  }

  margin: 0px;
  padding: 0px;
  list-style: none;
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  border-top: solid 1px #414141;
  display: block;
  cursor: pointer;
}

nav ul li {
  span {
    display: inline-block;
    vertical-align: middle;
    padding: 10px 0px;
    cursor: pointer;
  }

  div.tournament {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;
  }
}

nav ul li i {
  color: $wagerr-red;
  font-size: 20px;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
  margin-left: 10px;
}

nav ul li i.pull-right {
  font-size: 13px;
  color: #686869;
  display: none;
}

nav ul li.selected i.pull-right {
  display: block;
}

nav ul li ul {
  display: none;
}

nav ul li ul li {
  display: block;
  padding-left: 40px;
}
</style>
