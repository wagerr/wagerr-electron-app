<template>
  <el-dialog
    :close-on-click-modal="false"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="masternode-modal">
      <el-row class="modal-text text-center">
        <h4 class="modal-font">
          Step 4
          <br />Generate Pairing Key.
        </h4>
      </el-row>
      <div class="input-field col s12">
        <i class="fas fa-tags prefix"></i>

        <input
          v-model="innerPrivateKey"
          v-validate
          id="privateKey"
          ref="privateKey"
          type="text"
          placholder="Your Pairing Key"
        />

        <label for="ip">Paring Key:</label>

        <span v-if="errors.has('privateKey')" class="form-error">{{
          errors.first('privateKey')
        }}</span>
      </div>
      <el-row class="button-container">
        <a class="btn green" @click.prevent="onGenerate()">Generate</a>
      </el-row>
      <el-row slot="footer" class="button-container options">
        <a class="btn green" @click.prevent="onNext()">Next</a>
        <a class="btn" @click.prevent="onBack()">Back</a>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
// import { GET_MASTERNODE_PRIVKEY } from "../../../../../common/channel/sendToMain";
// import * as ipc from "../../../../../common/ipc/source/renderer";
import masternode_rpc from '@/services/api/masternode_rpc';

export default {
  name: 'MasternodeStepPrivateKeyDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    privateKey: {
      type: String,
      default: ''
    }
  },
  computed: {
    showDialog: {
      get: function() {
        return this.isVisible;
      },
      set: function(newValue) {
        this.$emit('update:isVisible', newValue);
      }
    },
    innerPrivateKey: {
      get: function() {
        return this.privateKey;
      },
      set: function(newValue) {
        this.$emit('update:privateKey', newValue);
      }
    }
  },
  methods: {
    async onGenerate() {
      // let generateResult = (await ipc.callMain(GET_MASTERNODE_PRIVKEY))
      //     .result;
      let generateResult = await masternode_rpc.generatePrivateKey();
      console.log(generateResult);
      this.innerPrivateKey = generateResult;
      this.$refs.privateKey.focus();
    },
    onBack() {
      this.$emit('back');
    },
    onNext() {
      this.$emit('next');
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../../assets/scss/_variables.scss';
.masternode-modal {
  position: relative;
  width: 100%;

  label {
    color: $wagerr-red !important;
  }
  input {
    color: $black !important;
  }
}

.button-container {
  margin-top: 50px;
  a:nth-child(0) {
    float: left;
  }
  a:nth-child(1) {
    float: right;
  }
}
</style>
