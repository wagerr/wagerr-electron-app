<template>
  <div id="preferences">
    <h4>Preferences</h4>

    <div class="row text-center">
      <div class="col s6">
        <div class="preferences-block table-container">
          <table class="main-table card z-depth-2">
            <tbody>
              <tr class="info-row">
                <td>Odds Display</td>
                <div id="oddsChoice">
                  <form action="#" @submit.prevent>
                    <p>
                      <label>
                        <input
                          name="oddsFormat"
                          type="radio"
                          id="odds_choice_decimal"
                          :value="getOddsFormats.decimal"
                          @change="changeOddsFormat"
                          :checked="oddsFormatChecked(getOddsFormats.decimal)"
                        />
                        <span>Decimal</span>
                      </label>
                    </p>
                    <p>
                      <label>
                        <input
                          name="oddsFormat"
                          type="radio"
                          id="odds_choice_fraction"
                          :value="getOddsFormats.fraction"
                          @change="changeOddsFormat"
                          :checked="oddsFormatChecked(getOddsFormats.fraction)"
                        />
                        <span>Fraction</span>
                      </label>
                    </p>
                    <p>
                      <label>
                        <input
                          name="oddsFormat"
                          type="radio"
                          id="odds_choice_american"
                          :value="getOddsFormats.american"
                          @change="changeOddsFormat"
                          :checked="oddsFormatChecked(getOddsFormats.american)"
                        />
                        <span>American</span>
                      </label>
                    </p>
                  </form>
                  <br />
                </div>
              </tr>

              <tr class="info-row">
                <td>Open wagerr.conf file</td>

                <button class="btn" @click="onOpenConf">Open</button>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import Store from 'electron-store';
import { getWagerrConfPath } from '../../../main/blockchain/blockchain';
import { shell } from 'electron';
const fs = require('fs');
const path = require('path');

export default {
  name: 'Preferences',

  methods: {
    ...mapActions(['updateOddsFormat']),
    changeOddsFormat: function(event) {
      this.$store.dispatch('updateOddsFormat', Number(event.target.value));
    },

    oddsFormatChecked: function(format) {
      return format == this.getOddsFormat;
    },

    onOpenConf: function() {
      shell.openItem(this.confPath);
    }
  },

  computed: {
    ...mapGetters(['getOddsFormats', 'getOddsFormat'])
  },

  data: function() {
    return {
      confPath: getWagerrConfPath()
    };
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables.scss';

.preferences-block {
  table {
    thead {
      th {
        text-align: center;
        font-size: 18px;
      }
    }

    tbody {
      th {
        padding: 10px 15px;
        font-size: 15px;
        line-height: 20px;
        vertical-align: top;
        white-space: nowrap;
      }

      td {
        padding: 10px 15px !important;
        font-size: 14px;
        line-height: 20px;
        vertical-align: top;
      }
    }
  }

  button {
    margin: 5px;
  }

  [type='radio']:checked + span:after {
    background-color: $wagerr_red;
    border: 2px solid $wagerr_red;
  }
}
</style>
