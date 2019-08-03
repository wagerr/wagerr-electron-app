<template>
  <tr
    class="info-row"
    @mouseover="editingActions = true"
    @mouseleave="editingActions = false"
  >
    <td :class="{ editing: editingLabel }" style="width: 285px;">
      <div class="view">
        <i
          class="icon-pencil editing"
          :class="{ active: editingLabelActions }"
        ></i>
        <label
          v-text="sendingAddress.label ? sendingAddress.label : '( No Label )'"
          @click="editingLabel = true"
          @mouseover="editingLabelActions = true"
          @mouseleave="editingLabelActions = false"
        ></label>
      </div>
      <div class="editing" v-show="editingLabel">
        <i
          class="icon-cross-circle cancel-editing-label"
          :class="{ active: editingLabel }"
          @click="cancelEdit"
        ></i>
        <input
          v-focus="editingLabel"
          class="update-address-label"
          placeholder="(no label)"
          :value="sendingAddress.label"
          @keyup.enter="doneEditSendingAddress"
          @keyup.esc="cancelEdit"
          @keydown.tab="cancelEdit"
        />
        <button class="update" @click="doneEditSendingAddress"></button>
      </div>
    </td>
    <td class="number" :class="{ editing: editingHash }">
      <div class="view">
        <i
          class="icon-pencil editing"
          :class="{ active: editingAddressActions }"
        ></i>
        <span
          v-text="
            sendingAddress.address ? sendingAddress.address : '( No Address )'
          "
          @click="editingHash = true"
          @mouseover="editingAddressActions = true"
          @mouseleave="editingAddressActions = false"
        ></span>
        <button
          class="destroy"
          :class="{ active: editingActions }"
          @click="userRemoveSendingAddress(sendingAddress)"
        ></button>
      </div>
      <div class="editing" v-show="editingHash">
        <i
          class="icon-cross-circle cancel-editing"
          :class="{ active: editingHash }"
          @click="cancelEdit"
        ></i>
        <input
          v-focus="editingHash"
          class="update-address-hash"
          autocomplete="off"
          :value="sendingAddress.address"
          @keyup.enter="doneEditSendingAddress"
          @keyup.esc="cancelEdit"
          @keydown.tab="cancelEdit"
        />
        <button class="update" @click="doneEditSendingAddress"></button>
      </div>
    </td>
  </tr>
</template>

<script>
import Vuex from 'vuex';

export default {
  name: 'SendingAddressItem',
  props: ['sendingAddress'],
  data() {
    return {
      editing: false,
      editingLabel: false,
      editingHash: false,
      editingActions: false,
      editingLabelActions: false,
      editingAddressActions: false
    };
  },
  directives: {
    focus(el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus();
        });
      }
    }
  },
  methods: {
    ...Vuex.mapActions(['editSendingAddress', 'removeSendingAddress']),
    userRemoveSendingAddress(address) {
      this.removeSendingAddress(address);
      var updatedAddressDetail =
        address.label > 0 ? address.label : address.address;
      M.toast({
        html:
          '<span class="toast__bold-font">Removed Sending Address ' +
          updatedAddressDetail +
          '&nbsp;</span>',
        classes: 'red'
      });
    },
    doneEditSendingAddress(e) {
      const labelVal = e.target
        .closest('tr')
        .querySelectorAll('input.update-address-label')[0]
        .value.trim();
      const hashVal = e.target
        .closest('tr')
        .querySelectorAll('input.update-address-hash')[0]
        .value.trim();
      const { sendingAddress } = this;
      if (this.editingLabel && hashVal.length === 0) {
        tabToSendingAddressHashInput(e);
        return;
      }
      if (hashVal.length === 0) {
        this.userRemoveSendingAddress(sendingAddress);
        return;
      }

      this.editSendingAddress({
        sendingAddress,
        labelVal,
        hashVal
      });

      this.editingLabel = false;
      this.editingHash = false;

      var updatedAddressDetail = labelVal.length > 0 ? labelVal : hashVal;
      M.toast({
        html:
          '<span class="toast__bold-font">Updated Sending Address ' +
          updatedAddressDetail +
          '&nbsp;</span>',
        classes: 'green'
      });
    },
    tabToSendingAddressHashInput(e) {
      this.editingLabel = false;
      this.editingHash = true;
      e.target
        .closest('tr')
        .querySelectorAll('input.update-address-hash')[0]
        .focus();
    },
    cancelEdit(e) {
      const labelVal = (e.target
        .closest('tr')
        .querySelectorAll(
          'input.update-address-label'
        )[0].value = this.sendingAddress.label);
      const hashVal = (e.target
        .closest('tr')
        .querySelectorAll(
          'input.update-address-hash'
        )[0].value = this.sendingAddress.address);
      this.editing = false;
      this.editingLabel = false;
      this.editingHash = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables.scss';

.info-row td div.view,
div.editing {
  width: 100%;
}
.info-row td.editing .view {
  display: none;
}
.info-row td div.view i.icon-pencil {
  visibility: hidden;
}
.info-row td div.view i.icon-pencil.active {
  visibility: visible;
}
.info-row td div.editing i.icon-cross-circle {
  visibility: hidden;
}
.info-row td div.editing i.icon-cross-circle.active {
  visibility: visible;
  color: #cc9a9a;
  font-size: 18px;
}
.info-row td div.editing i.icon-cross-circle.active:hover {
  visibility: visible;
  color: $wagerr-red-dark;
  font-weight: bold;
}
.info-row td {
  position: relative;
}
div.view span:hover,
label:hover {
  cursor: pointer;
}
button.destroy {
  visibility: hidden;
}
button.destroy.active {
  visibility: visible;
  right: 10px;
  margin: auto 0;
  background-color: $wagerr-red;
  border: 1px solid;
  border-radius: 3px;
  color: $white;
}
button.destroy:hover {
  color: $white;
  background-color: $wagerr-red-dark;
  transition: color 0.2s ease-out;
}
button.destroy:after {
  content: '×';
}
button.destroy {
  display: inline-block;
}
button.update {
  right: 10px;
  margin: auto 0;
  color: $white;
  background-color: $wagerr-red;
  border: 1px solid;
  border-radius: 3px;
  cursor: pointer;
  text-transform: uppercase;
}
button.update:hover {
  color: $white;
  transition: color 0.2s ease-out;
  background-color: $wagerr-red-dark;
}
button.update:after {
  content: 'update';
}
button.update {
  display: inline-block;
}
input:not([type]) {
  display: inline-block;
  width: 55%;
  margin: 0px;
  color: $wagerr-red-dark;
  border-bottom: 1px solid #a62626;
  height: 1.5rem;
  -webkit-box-shadow: 0 1px 0 0 #26a69a;
  box-shadow: 0 1px 0 0 #a62626;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}
input:not([type]):focus {
  border-bottom: 1px solid #a62626;
  box-shadow: 0 1px 0 0 #ffffff;
}
</style>
