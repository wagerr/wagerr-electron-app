<template>
  <div id="information">
    <h4>Profile</h4>

    <div class="row text-center">
      <div class="col s6">
        <div class="info-block table-container">
          <table class="main-table card z-depth-2">
            <thead>
              <tr>
                <th colspan="2">Configs</th>
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>Odds Display</th>
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

export default {
  name: 'Config',

  methods: {
    ...mapActions(['updateOddsFormat']),
    changeOddsFormat: function(event) {
      this.$store.dispatch('updateOddsFormat', Number(event.target.value));
    },

    oddsFormatChecked: function(format) {
      return format == this.getOddsFormat;
    }
  },

  computed: {
    ...mapGetters(['getOddsFormats', 'getOddsFormat'])
  }
};
</script>
