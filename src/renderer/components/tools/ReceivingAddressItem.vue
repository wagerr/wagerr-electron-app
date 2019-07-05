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
  <td class="number">{{ receivingAddress.hash }}</td>
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
  },// Todo: what is this doing??
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

<style>
.info-row td.editing .view {
  display: none;
}
</style>
