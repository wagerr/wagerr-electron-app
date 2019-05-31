<template>
  <!-- Wallet Unlock -->
  <el-dialog
    :close-on-click-modal="false"
    title="Step 3"
    class="custom-dialog"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="dialog-header" slot="title">
      {{ $t('settings.masternodes.step_three.title') }}
    </div>
    <div class="step-three-title">
      {{ $t('settings.masternodes.step_three.description') }}
    </div>
    <label-input
      v-model="innerIp"
      :label="$t('settings.masternodes.step_three.ip')"
      :place-holder="$t('settings.masternodes.step_three.ip_holder')"
    ></label-input>
    <div class="step-three-subtitle">
      {{ $t('settings.masternodes.step_three.ip_subtitle') }}
    </div>
    <div class="step-button-container">
      <default-button class="step-button" @click="onBack()">
        {{ $t('settings.masternodes.step_three.back') }}
      </default-button>
      <default-button class="step-button" @click="onNext()">
        <span class="step-next-text">{{
          $t('settings.masternodes.step_three.next')
        }}</span>
      </default-button>
    </div>
  </el-dialog>
</template>

<script>
import LabelInput from '../../../elements/LabelInput/LabelInput';
import DefaultButton from '../../../elements/DefaultButton/DefaultButton';

export default {
  name: 'MasternodeStepIpDialog',
  components: { DefaultButton, LabelInput },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    ip: {
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
    innerIp: {
      get: function() {
        return this.ip;
      },
      set: function(newValue) {
        this.$emit('update:ip', newValue);
      }
    }
  },
  methods: {
    onBack() {
      this.$emit('back');
    },
    onNext() {
      let isValid = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        this.innerIp
      );
      if (isValid) {
        this.$emit('next');
      } else {
        this.$message.error(
          this.$t('settings.masternodes.step_three.message.ip_invalid')
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.step-three-title {
  color: #ffffff;
  font-size: 24px;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 30px;
}

.step-three-subtitle {
  color: #818182;
  font-size: 14px;
  text-align: center;
  margin: 20px 80px;
}

.step-button {
  width: 127px;
  font-size: 17px;
  font-weight: bolder;
  margin-right: 20px;
}

.step-button-container {
  margin-top: 120px;
}

.step-next-text {
  color: #10e492;
}
</style>
