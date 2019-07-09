<template>
<div id="information">

  <div class="row">
      <h4>Address Book</h4>
  </div>
  <div class="row text-center">
    <div class="col s6">
      <button class="btn" v-on:click="filterRecievingAddresses">Receiving Addresses</button>
      <button class="btn" v-on:click="filterSendingAddresses">Sending Addresses</button>
    </div>
  </div>

  <div v-if="selectedAddressFilter===0" class="row text-center">
    <div class="col s6">
      <div class="info-block table-container">
        <table
          v-for="receivingAccount in getReceivingAddressList "
          :key="receivingAccount.accountName"
          class="main-table card z-depth-2"
          >
          <thead>
            <tr class="info-row">
              <th colspan="2">{{ receivingAccount.accountName }}</th>
            </tr>
          </thead>

          <tbody>
            <ReceivingAddressItem
              v-for="receivingAddress in receivingAccount.addresses"
              :key="receivingAddress.address"
              :receivingAddress="receivingAddress"
              />
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="selectedAddressFilter===1" class="row text-center">
    <div class="col s6">
      <div class="info-block table-container">
        <table class="main-table card z-depth-2">
          <thead>
            <tr class="info-row">
              <th colspan="2">Your Sending Addresses</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <input class="new-address-label"
                       ref="newSendingAddressLabel"
                       autofocus
                       autocomplete="off"
                       id="newSendingAddressLabel"
                       placeholder="Enter New Label"
                       @keyup.enter="toEnterAddress">
              </td>
              <td>
                <input class="new-address-hash"
                       ref="newSendingAddress"
                       autocomplete="off"
                       id="newSendingAddress"
                       placeholder="Enter New Address"
                       @keyup.enter="addNewAddress">
              </td>
            </tr>
            <SendingAddressItem
              v-for ="(sendingAddress, index) in getSendingAddressList"
              :key="index"
              :sendingAddress="sendingAddress"
              class="info-row"
              />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Vuex from "vuex";
import SendingAddressItem from './SendingAddressItem.vue'
import ReceivingAddressItem from './ReceivingAddressItem.vue'

export default {
  name: "AddressBook",

  components: { SendingAddressItem, ReceivingAddressItem },

  computed: {
    ...Vuex.mapGetters(["getReceivingAddressList", "getSendingAddressList"])
  },

  methods: {
    ...Vuex.mapActions(["getWGRAcountList", "getStoredSendingAddressList"]),

    addNewAddress (e) {
      const labelVal = e.target.closest('tr').querySelectorAll('input.new-address-label')[0].value.trim()
      const addressVal = e.target.closest('tr').querySelectorAll('input.new-address-hash')[0].value.trim()
      if (addressVal) {
        this.$store.dispatch('addSendingAddress', { label: labelVal, hash: addressVal })
      }
      e.target.closest('tr').querySelectorAll('input.new-address-label')[0].value = ''
      e.target.closest('tr').querySelectorAll('input.new-address-hash')[0].value = ''
    },
    filterRecievingAddresses: function() {
      this.selectedAddressFilter = this.addressFilters.RECEIVING;
    },
    filterSendingAddresses: function() {
      this.selectedAddressFilter = this.addressFilters.SENDING;
    },
    toEnterAddress () {
      this.$refs.newSendingAddress.value.length === 0 ? this.$refs.newSendingAddress.focus() : addNewaddress()
    }

  },

  data() {
    return {
      addressFilters: {RECEIVING: 0, SENDING: 1},
      selectedAddressFilter: 0
    };
  },
  mounted() {
    this.getWGRAcountList();
    this.getStoredSendingAddressList();
  }
};
</script>
