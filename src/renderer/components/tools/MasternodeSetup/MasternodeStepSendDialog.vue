<template>
  <el-dialog
    :close-on-click-modal="false"
    class="custom-dialog"
    title="Step 1"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="dialog-header" slot="title">Step 1</div>
    <div class="step-one-title">SEND 20,000 COINS</div>
    <el-input
      class="step-input"
      label="Pay To:"
      v-model="address"
      place-holder="Enter an ION/XDM Address"
    />
    <el-input
      class="step-input"
      label="Label:"
      v-model="label"
      place-holder="Label"
    />
    <el-input
      class="step-input"
      label="Amount:"
      v-model="amount"
      type="number"
      :readonly="true"
      place-holder="Amount"
    />

    <div class="step-button-container">
      <el-button class="step-button" @click="onSend()">
        <span class="step-send-text">SEND</span>
      </el-button>
      <el-button class="step-button" @click="onClear()">CLEAR</el-button>
      <el-button class="step-button" @click="onSkip()">SKIP</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import masternode_rpc from '@/services/api/masternode_rpc';
import { getCoinMasternodeConfPath } from '../../../../main/blockchain/blockchain';

export default {
  name: 'MasternodeStepSendDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      address: '',
      label: '',
      amount: 20000,
      addressBook: []
    };
  },
  computed: {
    showDialog: {
      get: function() {
        return this.isVisible;
      },
      set: function(newValue) {
        this.$emit('update:isVisible', newValue);
      }
    }
  },
  watch: {
    address: _.debounce(function(newVal, oldVal) {
      console.log('find', this.addressBook);
      if (_.find(this.addressBook, { address: this.address })) {
        this.label = _.find(this.addressBook, {
          address: this.address
        }).name;
      }
    }, 500)
  },
  async mounted() {
    // this.addressBook = await ipc.callMain(GET_ADDRESS_BOOK);
  },
  methods: {
    async onSend() {
      try {
        await ipc.callMain(SEND_TO_ADDRESS, {
          address: this.address,
          amount: 20000
        });
        this.$message({
          message: `${this.$t(
            'settings.masternodes.step_one.message.send_success'
          )} ${this.address}`,
          type: 'success'
        });
        let index = this.addressBook.findIndex(
          address => address.address === this.address
        );
        if (index === -1) {
          this.addressBook.push({
            name: this.receiverName,
            address: this.address
          });
          await ipc.callMain(UPDATE_ADDRESS_BOOK, this.addressBook);
        }
        this.$emit('next');
      } catch (e) {
        console.log(e);
        this.$message.error(e.message);
        if (e.code === -13) {
          this.onShowWalletUnlock();
        }
      }
    },
    onSkip() {
      this.$emit('next');
    },
    onClear() {
      this.address = '';
      this.label = '';
    }
  }
};
</script>

<style lang="scss">
.step-one-title {
  color: #ffffff;
  font-size: 24px;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.step-button-container {
  margin-top: 40px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.step-input {
  margin-bottom: 20px;
}

.step-send-text {
  color: #d9025d;
}

.step-button {
  width: 320px;
  font-size: 17px;
  font-weight: bolder;
  margin-right: 10px;
}
</style>
