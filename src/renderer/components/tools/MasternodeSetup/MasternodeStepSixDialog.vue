<template>
  <!-- Wallet Unlock -->
  <el-dialog
    :close-on-click-modal="false"
    title="Step 6"
    class="custom-dialog"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="dialog-header" slot="title">
      {{ $t('settings.masternodes.step_six.title') }}
    </div>
    <div class="step-title">
      {{ $t('settings.masternodes.step_six.description') }}
    </div>
    <div class="finish-container">
      <div class="top-button-container">
        <default-button class="step-open-button" @click="onOpenWalletFile()">
          {{ $t('settings.masternodes.step_six.open_wallet') }}
        </default-button>

        <default-button
          class="step-open-button"
          @click="onOpenMasternodeFile()"
        >
          {{ $t('settings.masternodes.step_six.open_masternode') }}
        </default-button>
      </div>

      <div class="step-subtitle">
        {{ $t('settings.masternodes.step_six.step_subtitle') }}
      </div>

      <div class="bottom-button-container">
        <default-button class="step-button" @click="onBack()">
          {{ $t('settings.masternodes.step_six.back') }}
        </default-button>
        <default-button class="step-button" @click="onFinish()">
          <span class="step-finish-text">
            {{ $t('settings.masternodes.step_six.finish') }}</span
          >
        </default-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  getCoinConfPath,
  getCoinMasternodeConfPath
} from '../../../../../common/blockchain/blockchain';
import DefaultButton from '../../../elements/DefaultButton/DefaultButton';

const { shell } = require('electron');

export default {
  name: 'MasternodeStepSixDialog',
  components: { DefaultButton },
  props: {
    isVisible: {
      type: Boolean,
      default: false
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
    }
  },
  methods: {
    onOpenMasternodeFile() {
      let masternodeConfigPath = getCoinMasternodeConfPath();
      shell.openItem(masternodeConfigPath);
    },
    onOpenWalletFile() {
      let coinConfigPath = getCoinConfPath();
      shell.openItem(coinConfigPath);
    },
    onBack() {
      this.$emit('back');
    },
    onFinish() {
      this.$emit('next');
      this.showDialog = false;
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

.finish-container {
  width: 100%;
}

.top-button-container {
  display: block;
  width: 60%;
  margin: auto;
}

.step-open-button {
  width: 100%;
  margin-bottom: 10px;
}

.bottom-button-container {
  display: flex;
  justify-content: center;
}

.step-subtitle {
  color: #818182;
  font-size: 14px;
  text-align: center;
  margin: 10px 100px;
}

.step-button {
  width: 127px;
  font-size: 17px;
  font-weight: bolder;
  margin: 30px 15px 20px 10px;
}

.step-finish-text {
  color: #10e492;
}
</style>
