<template>
  <!-- Wallet Unlock -->
  <el-dialog
    :close-on-click-modal="false"
    title="Step 4"
    class="custom-dialog"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="dialog-header" slot="title">
      {{ $t('settings.masternodes.step_four.title') }}
    </div>
    <div class="step-title">
      {{ $t('settings.masternodes.step_four.description') }}
    </div>

    <label-input
      v-model="innerPrivateKey"
      :label="$t('settings.masternodes.step_four.key')"
      :place-holder="$t('settings.masternodes.step_four.key_holder')"
    ></label-input>
    <div class="generate-button-container">
      <default-button
        class="step-button step-button-generate"
        @click.prevent="onGenerate()"
      >
        {{ $t('settings.masternodes.step_four.generate') }}
      </default-button>
    </div>
    <div class="step-button-container">
      <default-button class="step-button" @click.prevent="onBack()">
        {{ $t('settings.masternodes.step_four.back') }}
      </default-button>
      <default-button class="step-button" @click.prevent="onNext()">
        <span class="step-next-text">{{
          $t('settings.masternodes.step_four.next')
        }}</span>
      </default-button>
    </div>
  </el-dialog>
</template>

<script>
import { GET_MASTERNODE_PRIVKEY } from '../../../../../common/channel/sendToMain';
import * as ipc from '../../../../../common/ipc/source/renderer';
import LabelInput from '../../../elements/LabelInput/LabelInput';
import DefaultButton from '../../../elements/DefaultButton/DefaultButton';

export default {
  name: 'MasternodeStepPrivateKeyDialog',
  components: { DefaultButton, LabelInput },
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
      let generateResult = (await ipc.callMain(GET_MASTERNODE_PRIVKEY)).result;
      this.innerPrivateKey = generateResult;
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
.step-title {
  color: #ffffff;
  font-size: 24px;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 30px;
}

.step-button {
  width: 127px;
  font-size: 17px;
  font-weight: bolder;
  margin-right: 20px;
}

.generate-button-container {
  display: flex;
  justify-content: center;
}

.step-button-generate {
  margin-top: 40px;
}

.step-button-container {
  margin-top: 100px;
}

.step-next-text {
  color: #10e492;
}
</style>
