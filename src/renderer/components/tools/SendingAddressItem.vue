<template>
<tr class="info-row"
    @mouseover="editingActions=true"
    @mouseleave="editingActions=false"
    >
  <td :class="{ editing: editingLabel }">
    <div class="view">
      <label v-text="sendingAddress.label ? sendingAddress.label : '( No Label )'"
             @click="editingLabel = true"
             ></label>
    </div>
    <input
      v-show="editingLabel"
      v-focus="editingLabel"
      class="update-address-label"
      placeholder="(no label)"
      :value="sendingAddress.label"
      @keyup.enter="doneEditSendingAddress"
      @keyup.esc="cancelEdit"
      @blur="cancelEdit"
      >
  </td>
  <td
    class="number"
    :class="{ editing: editingHash }"
    >
    <div class="view">
      <span v-text="sendingAddress.address ? sendingAddress.address : '( No Address )'"
             @click="editingHash = true"
             ></span>
      <button class="destroy"
              :class="{active:editingActions}"
              @click="userRemoveSendingAddress(sendingAddress)"></button>
    </div>
    <input
      v-show="editingHash"
      v-focus="editingHash"
      class="update-address-hash"
      autocomplete="off"
      :value="sendingAddress.address"
      @keyup.enter="doneEditSendingAddress"
      @keyup.esc="cancelEdit"
      @blur="cancelEdit"
      >
  </td>
</tr>
</template>

<script>
import Vuex from "vuex";

export default {
  name: "SendingAddressItem",
  props: ['sendingAddress'],
  data () {
    return {
      editing: false,
      editingLabel: false,
      editingHash: false,
      editingActions: false
    }
  },
  directives: {
    focus (el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus()
        })
      }
    }
  },
  methods: {
    ...Vuex.mapActions([
      "editSendingAddress",
      "removeSendingAddress"
    ]),
    
    userRemoveSendingAddress (address) {
      this.removeSendingAddress(address);
      var updatedAddressDetail = address.label > 0 ? address.label : address.address;
      M.toast({
        html:
        '<span class="toast__bold-font">Removed Sending Address ' + updatedAddressDetail + '&nbsp;</span>',
        classes: 'red'
      });
    },
    doneEditSendingAddress (e) {
      const labelVal = e.target.closest('tr').querySelectorAll('input.update-address-label')[0].value.trim()
      const hashVal = e.target.closest('tr').querySelectorAll('input.update-address-hash')[0].value.trim()
      const { sendingAddress } = this
      if (this.editingLabel && hashVal.length === 0) {
        tabToSendingAddressHashInput(e)
        return
      }
      if (hashVal.length === 0) {
        this.userRemoveSendingAddress(sendingAddress)
        return
      }

      this.editSendingAddress({
        sendingAddress,
        labelVal,
        hashVal
      })

      this.editingLabel = false
      this.editingHash = false

      var updatedAddressDetail = labelVal.length > 0 ? labelVal : hashVal;
      M.toast({
              html:
                '<span class="toast__bold-font">Updated Sending Address ' + updatedAddressDetail + '&nbsp;</span>',
              classes: 'green'
            });
    },
    tabToSendingAddressHashInput (e) {
      this.editingLabel = false
      this.editingHash = true
      e.target.closest('tr').querySelectorAll('input.update-address-hash')[0].focus()
    },
    cancelEdit (e) {
      const labelVal = e.target.closest('tr').querySelectorAll('input.update-address-label')[0].value = this.sendingAddress.label
      const hashVal = e.target.closest('tr').querySelectorAll('input.update-address-hash')[0].value = this.sendingAddress.address
      this.editing = false
      this.editingLabel = false
      this.editingHash = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/_variables.scss';

.info-row td.editing .view {
    display: none;
}
.info-row td {
    position: relative;
}
div.view span:hover, label:hover {
    cursor: pointer;
}
button.destroy {
    visibility: hidden;
}
button.destroy.active{
    visibility: visible;
    right: 10px;
    margin: auto 0;
    background-color: #dcdcdc;
    border: 1px solid;
    border-radius: 3px;
    color: #cc9a9a;
}
button.destroy:hover {
    color: $wagerr_red;
    background-color: #d0d0d0;
    transition: color 0.2s ease-out;
}
button.destroy:after {
    content: '×';
}
button.destroy {
    display: inline-block;
}
input:not([type]):focus {
    width: auto;
    color: $wagerr_dark_red;
    border-bottom: 1px solid #a62626;
    -webkit-box-shadow: 0 1px 0 0 #26a69a;
    box-shadow: 0 1px 0 0 #a62626;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
}
</style>
