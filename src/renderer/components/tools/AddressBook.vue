<template>
  <div id="information">
    <h4>Address Book</h4>

    <div>
      <button>Receiving Addresses</button>
      <button>Sending Addresses</button>
    </div>

    <div class="row text-center">
      <div class="col s6">
        <div class="info-block table-container">
          <table
            v-for="ac in getAccountAddressList"
            :key="ac.accountName"
            class="main-table card z-depth-2"
          >
            <thead>
              <tr class="info-row">
                <th colspan="2">{{ ac.accountName }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="aca in ac.addresses" :key="aca.address" class="info-row">
                <th>
                  <input
                    placeholder="(no label)"
                    :value="aca.label"
                    v-on:blur="updateLabel(aca.address, ac.accountName, $event)"
                  >
                </th>
                <td class="number">{{ aca.address }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from "vuex";

export default {
  name: "AddressBook",

  computed: {
    ...Vuex.mapGetters(["getAccountAddressList"])
  },

  methods: {
    ...Vuex.mapActions(["getWGRAcountList", "updateAddressLabel"]),

    updateLabel: function(address, accountName, event) {
      this.updateAddressLabel({
        accountName: accountName,
        address: address,
        label: event.target.value
      });
    }
  },

  mounted() {
    this.getWGRAcountList();
  }
};
</script>
