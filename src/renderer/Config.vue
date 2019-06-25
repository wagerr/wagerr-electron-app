  <template>
  <div id="information">
    <h4>Profile</h4>

    <div class="row text-center">
      <div class="col s6">
        <div class="info-block table-container">
          <table class="main-table card z-depth-2">
            <thead>
              <tr>
                <th colspan="2">Config</th>
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>Odds Display</th>
                <div id="oddsChoice">
                  <form action="#">
                    <p>
                      <label>
                        <input
                          name="picked"
                          type="radio"
                          id="fraction"
                          style
                          @change="updateOddsFormat(getOddsFormats.fraction)"
                          :checked="getOddsFormats.fraction == getOddsFormat"
                        >
                        <span>Fraction</span>
                      </label>
                    </p>
                    <p>
                      <label>
                        <input
                          name="picked"
                          type="radio"
                          class
                          id="decimal"
                          @change="updateOddsFormat(getOddsFormats.decimal)"
                          :checked="getOddsFormats.decimal == getOddsFormat"
                        >
                        <span>Decimal</span>
                      </label>
                    </p>
                  </form>
                  <br>
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
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  name: "Config",

  methods: mapActions(["updateOddsFormat"]),

  computed: {
    ...mapGetters(["getOddsFormats", "getOddsFormat"])
  }
};
</script>
