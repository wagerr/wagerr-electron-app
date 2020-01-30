<template>
  <perfect-scrollbar v-on:wheel.stop.prevent>
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
  </perfect-scrollbar>
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
      this.$emit('needsScroll');
    },

    filterEventsByTournament: async function(tournamentFilter) {
      await this.updateEventsTournamentFilter(tournamentFilter);
      await this.listEvents();
      this.$emit('needsScroll');
    },

    resolveSportId: sport => {
      return sport.id === '' || sport.id ? sport.id : sport.name;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';

.ps {
  height: 100%;
  // Don't add nested elements rules here or they will break on tab change creating an ugly effect
}
nav {
  width: 200px;
  height: 100%;
  background: transparent;
  position: relative;
  top: auto;
  left: auto;
  height: auto;
  box-shadow: none;
  padding: 23px 0 50px 0;

  h5 {
    font-size: 11px;
    font-weight: 700;
    color: $wagerr-red-light;
    text-transform: uppercase;
    padding-left: 50px;
    letter-spacing: 1px;
    margin: 20px 0 20px 0;
  }

  ul.side-nav {
    overflow: hidden;

    h5 {
      margin-top: 25px;
    }

    li {
      margin: 0px;
      padding: 0px;
      list-style: none;
      color: #fff;
      font-size: 12px;

      span {
        display: inline-block;
        vertical-align: middle;
      }
    }

    > li {
      border-top: none;
      border-left: 3px solid transparent;
      line-height: 18px;

      &:hover,
      &.on {
        background-color: $black;
        border-left: 3px solid $wagerr-red-light;
        i {
          color: $wagerr-red-light;
        }
      }

      a {
        padding: 6px 0;
        i {
          font-weight: 600;
          width: 44px;
          padding: 0;
          margin: 0;
          display: inline-block;
          text-align: center;
          height: auto;
          color: $gray-600;
          font-size: 18px;
          vertical-align: middle;
        }
        span {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          padding: 0;
          margin: 0;

          &.n-events {
            margin-right: 14px !important;
          }
        }
      }

      ul.tournaments-dropdown {
        display: block;
        padding-left: 50px;
        padding-bottom: 5px;
        li {
          float: none;
          // padding: 0;
          border-top: solid 1px #414141;
          line-height: 12px;
          font-size: 13px;
          font-weight: 600;
          color: $gray-600;

          &:hover,
          &.on {
            color: $wagerr-red-light;
          }

          div.tournament {
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 10px 10px 10px 0;
          }
        }
      }
    }
  }
}
</style>
