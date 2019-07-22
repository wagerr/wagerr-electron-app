<template>
<tr class="info-row">
  <td :class="{ editing: editing }">
    <div class="view">
      <label v-text="receivingAddress.label ? receivingAddress.label : '( No Label )'"
             @click="editing = true"
             ></label>
    </div>
    <input
      v-show="editing"
      v-focus="editing"
      placeholder="(no label)"
      :value="receivingAddress.label"
      @keyup.enter="doneEditLabel"
      @keyup.esc="cancelEdit"
      @blur="doneEditLabel"
      >
  </td>
  <td class="number">{{ receivingAddress.address }}</td>
</tr>
</template>

<script>
import Vuex from "vuex";

export default {
  name: "ReceivingAddressItem",
  props: ['receivingAddress', 'account'],
  data () {
    return {
      editing: false
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
    ...Vuex.mapActions(["editReceivingAddressLabel"]),
    
    doneEditLabel () {
      const label = event.target.value.trim()
      const { receivingAddress } = this
      if (this.editing) {
      this.editReceivingAddressLabel({
        receivingAddress,
        label: label
      });        
      }
      this.editing = false
    },
    cancelEdit (e) {
      e.target.value = this.receivingAddress.label
      this.editing = false
    }
  }
  
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/_variables.scss';
  
.info-row td.editing .view {
  display: none;
}
div.view label:hover {
    cursor: pointer;
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
