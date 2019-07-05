<template>
<tr class="info-row">
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
      @blur="doneEditSendingAddress"
      >
  </td>
  <td :class="{ editing: editingHash }">
    <div class="view">
      <label v-text="sendingAddress.hash ? sendingAddress.hash : '( No Label )'"
             @click="editingHash = true"
             ></label>
      <button class="destroy" @click="removeSendingAddress(sendingAddress)"></button>
    </div>
    <input
      v-show="editingHash"
      v-focus="editingHash"
      class="update-address-hash"
      autocomplete="off"
      :value="sendingAddress.hash"
      @keyup.enter="doneEditSendingAddress"
      @keyup.esc="cancelEdit"
      @blur="doneEditSendingAddress"
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
      editingHash: false
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

    doneEditSendingAddress (e) {
      const labelVal = e.target.closest('tr').querySelectorAll('input.update-address-label')[0].value.trim()
      const hashVal = e.target.closest('tr').querySelectorAll('input.update-address-hash')[0].value.trim()
      const { sendingAddress } = this
      if (this.editingLabel && hashVal.length === 0) {
        tabToSendingAddressHashInput(e)
        return
      }
      if (hashVal.length === 0) {
        this.removeSendingAddress(sendingAddress)
        return
      }

      this.editSendingAddress({
        sendingAddress,
        labelVal,
        hashVal
      })

      this.editingLabel = false
      this.editingHash = false
    },
    tabToSendingAddressHashInput (e) {
      this.editingLabel = false
      this.editingHash = true
      e.target.closest('tr').querySelectorAll('input.update-address-hash')[0].focus()
    },
    cancelEdit (e) {
      const labelVal = e.target.closest('tr').querySelectorAll('input.update-address-label')[0].value = this.sendingAddress.label
      const hashVal = e.target.closest('tr').querySelectorAll('input.update-address-hash')[0].value = this.sendingAddress.hash
      this.editing = false
      this.editingLabel = false
    }
  }
}
</script>

<style>
.info-row td.editing .view {
    display: none;
}
.info-row td {
    position: relative;
}
button.destroy {
    display: none;
    right: 10px;
    margin: auto 0;
    color: #cc9a9a;
    transition: color 0.2s ease-out;
}
button.destroy:hover {
    color: #af5b5e;
    background: ##Cd0000;
}
button.destroy:after {
    content: '×';
}
button.destroy {
    display: inline-block;
}
</style>
