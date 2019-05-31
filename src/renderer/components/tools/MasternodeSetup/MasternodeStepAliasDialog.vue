<template>
  <!-- Wallet Unlock -->
  <el-dialog
    :close-on-click-modal="false"
    title="Step 2"
    class="custom-dialog"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="dialog-header" slot="title">
      {{ $t('settings.masternodes.step_two.title') }}
    </div>
    <div class="step-two-title">
      {{ $t('settings.masternodes.step_two.description') }}
    </div>

    <el-input
      v-model="innerAlias"
      :label="$t('settings.masternodes.step_two.alias')"
      :place-holder="$t('settings.masternodes.step_two.alias_holder')"
    ></el-input>
    <div class="step-button-container">
      <el-button class="step-button" @click.prevent="onBack()">{{
        $t('settings.masternodes.step_two.back')
      }}</el-button>
      <el-button class="step-button" @click.prevent="onNext()">
        <span class="step-next-text">{{
          $t('settings.masternodes.step_two.next')
        }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'MasternodeStepAliasDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    alias: {
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
    innerAlias: {
      get: function() {
        return this.alias;
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
      this.$emit('next');
    }
  }
};
</script>

<style scoped lang="scss">
.step-two-title {
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
  margin-right: 10px;
}

.step-button-container {
  margin-top: 140px;
}

.step-next-text {
  color: #10e492;
}
</style>
