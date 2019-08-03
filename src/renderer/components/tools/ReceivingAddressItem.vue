<template>
  <tr class="info-row">
    <td :class="{ editing: editing }" style="width: 250px;">
      <div class="view">
        <i class="icon-pencil editing" :class="{ active: editingActions }"></i>
        <label
          v-text="
            receivingAddress.label ? receivingAddress.label : '( No Label )'
          "
          @click="editing = true"
          @mouseover="editingActions = true"
          @mouseleave="editingActions = false"
        ></label>
      </div>
      <div class="editing" v-show="editing">
        <i
          class="icon-cross-circle cancel-editing"
          :class="{ active: editing }"
          @click="cancelEdit"
        ></i>
        <input
          v-show="editing"
          v-focus="editing"
          class="update-address-label"
          placeholder="(no label)"
          :value="receivingAddress.label"
          @keyup.enter="doneEditLabel"
          @keyup.esc="cancelEdit"
          @keydown.tab="cancelEdit"
        />
        <button class="update" @click="doneEditLabel"></button>
      </div>
    </td>
    <td class="number">{{ receivingAddress.address }}</td>
  </tr>
</template>

<script>
import Vuex from 'vuex';

export default {
  name: 'ReceivingAddressItem',
  props: ['receivingAddress', 'account'],
  data() {
    return {
      editing: false,
      editingActions: false,
      editingLabel: false
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
    ...Vuex.mapActions(['editReceivingAddressLabel']),

    doneEditLabel(e) {
      const labelVal = e.target
        .closest('tr')
        .querySelectorAll('input.update-address-label')[0]
        .value.trim();
      const { receivingAddress } = this;
      if (this.editing) {
        this.editReceivingAddressLabel({
          receivingAddress,
          label: labelVal
        });
        M.toast({
          html:
            '<span class="toast__bold-font">Updated Label to ' +
            labelVal +
            '&nbsp;</span>',
          classes: 'green'
        });
      }
      this.editing = false;
    },
    cancelEdit(e) {
      e.target.value = this.receivingAddress.label;
      this.editing = false;
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
  text-transform: uppercase;
  cursor: pointer;
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
