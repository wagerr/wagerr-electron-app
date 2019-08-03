<template>
  <div id="address-book" class="row">
    <div class="col s12">
      <h4>Address Book</h4>

      <div class="row text-center">
        <div class="col s6 offset-s3">
          <button class="btn" v-on:click="filterRecievingAddresses">
            Receiving Addresses
          </button>
          <button class="btn" v-on:click="filterSendingAddresses">
            Sending Addresses
          </button>
        </div>
      </div>

      <div v-if="selectedAddressFilter === 0" class="row text-center">
        <div class="col s12">
          <div class="info-block table-container">
            <table
              v-for="receivingAccount in getReceivingAddressList"
              :key="receivingAccount.accountName"
              class="main-table card z-depth-2"
            >
              <thead>
                <tr class="info-row">
                  <th colspan="2">{{ receivingAccount.account_name }}</th>
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

      <div v-if="selectedAddressFilter === 1" class="row text-center">
        <div class="col s12">
          <div class="info-block table-container">
            <table class="main-table card z-depth-2 highlight">
              <thead>
                <tr class="info-row sendingbar">
                  <th colspan="2">Your Sending Addresses</th>
                  <a
                    v-if="addingNewSendingAddress === false"
                    class="btn-small black darken-4 add-btn"
                    @click="addNewSendingAddress"
                  >
                    <i class="material-icons">&#43;</i>
                  </a>
                  <a
                    v-if="addingNewSendingAddress === true"
                    class="btn-small black darken-4 add-btn"
                    @click="removeNewSendingAddress"
                  >
                    <i class="material-icons">&#45;</i>
                  </a>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-if="addingNewSendingAddress === true"
                  class="new-address-row highlight"
                >
                  <td>
                    <input
                      class="new-address-label"
                      ref="newSendingAddressLabel"
                      autofocus
                      autocomplete="off"
                      id="newSendingAddressLabel"
                      placeholder="Enter New Label"
                      @keyup.enter="toEnterAddress"
                    />
                  </td>
                  <td>
                    <input
                      class="new-address-hash"
                      ref="newSendingAddress"
                      autocomplete="off"
                      id="newSendingAddress"
                      placeholder="Enter New Address"
                      @keyup.enter="addNewAddress"
                    />
                    <a
                      class="btn-small waves-effect waves-light red darken-4"
                      @click="addNewAddress"
                    >
                      Add
                    </a>
                  </td>
                </tr>
                <SendingAddressItem
                  v-for="(sendingAddress, index) in getSendingAddressList"
                  :key="index"
                  :sendingAddress="sendingAddress"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import SendingAddressItem from './SendingAddressItem.vue';
import ReceivingAddressItem from './ReceivingAddressItem.vue';

export default {
  name: 'AddressBook',

  components: { SendingAddressItem, ReceivingAddressItem },

  computed: {
    ...Vuex.mapGetters(['getReceivingAddressList', 'getSendingAddressList'])
  },

  methods: {
    ...Vuex.mapActions([
      'getWGRAcountList',
      'getStoredSendingAddressList',
      'loadAddressbook'
    ]),

    addNewSendingAddress(e) {
      this.addingNewSendingAddress = true;
      // document.getElementById("newSendingAddressRow").style.display = "table-row";
    },
    removeNewSendingAddress(e) {
      this.addingNewSendingAddress = false;
    },

    addNewAddress(e) {
      const labelVal = e.target
        .closest('tr')
        .querySelectorAll('input.new-address-label')[0]
        .value.trim();
      const addressVal = e.target
        .closest('tr')
        .querySelectorAll('input.new-address-hash')[0]
        .value.trim();
      if (addressVal) {
        this.$store.dispatch('addSendingAddress', {
          label: labelVal,
          address: addressVal
        });
        this.addingNewSendingAddress = false;
        var updatedAddressDetail = labelVal.length > 0 ? labelVal : addressVal;
        M.toast({
          html:
            '<span class="toast__bold-font">Added Sending Address ' +
            updatedAddressDetail +
            '&nbsp;</span>',
          classes: 'green'
        });
      } else {
        M.toast({
          html:
            '<span class="toast__bold-font">No Address Entered &nbsp;</span>',
          classes: 'red'
        });
      }
      e.target
        .closest('tr')
        .querySelectorAll('input.new-address-label')[0].value = '';
      e.target
        .closest('tr')
        .querySelectorAll('input.new-address-hash')[0].value = '';
    },
    filterRecievingAddresses: function() {
      this.selectedAddressFilter = this.addressFilters.RECEIVING;
    },
    filterSendingAddresses: function() {
      this.selectedAddressFilter = this.addressFilters.SENDING;
    },
    toEnterAddress() {
      this.$refs.newSendingAddress.value.length === 0
        ? this.$refs.newSendingAddress.focus()
        : addNewaddress();
    }
  },

  data() {
    return {
      addressFilters: { RECEIVING: 0, SENDING: 1 },
      selectedAddressFilter: 0,
      addingNewSendingAddress: false
    };
  },

  created() {
    this.loadAddressbook();
  }
};
</script>
<style lang="scss" scoped>
@import '../../assets/scss/_variables.scss';

.add-btn {
  position: absolute;
  right: 1px;
}

#newSendingAddress {
  width: calc(100% - 100px);
  margin-right: 15px;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}
.sendingbar a {
  width: 50px;
}
.sendingbar a i {
  font-size: 28px !important;
}

#newSendingAddressLabel {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

input:not([type]):focus {
  color: $wagerr-red-dark;
  border-bottom: 1px solid #a62626;
  -webkit-box-shadow: 0 1px 0 0 #26a69a;
  box-shadow: 0 1px 0 0 #a62626;
}
</style>
