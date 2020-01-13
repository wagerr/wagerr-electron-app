<template>
  <el-dialog
    :close-on-click-modal="false"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="masternode-modal">
      <el-row class="modal-text text-center">
        <h4 class="modal-font">
          {{ $t('Step 3') }}
          <br />
          {{ $t('Enter your IP Address.') }}
        </h4>
      </el-row>
      <div class="input-field col s12">
        <i class="fas fa-tags prefix"></i>

        <input
          v-model="innerIp"
          v-validate
          id="ip"
          name="ip"
          type="text"
          :placeholder="$t('Enter desired IP Address')"
          autofocus
        />

        <label for="ip">
          {{ $t('Ip:') }}
        </label>

        <span v-if="errors.has('ip')" class="form-error">{{
          errors.first('ip')
        }}</span>
        <span class="step-three-subtitle">
          {{ $t('For hosting on the current system you can just google "whats my IP" and it will tell your current IP.') }}
        </span
        >
      </div>
      <el-row slot="footer" class="button-container options">
        <a class="btn green" @click.prevent="onNext()">
          {{ $t('Next') }}
        </a>
        <a class="btn" @click.prevent="onBack()">
          {{ $t('Back') }}
        </a>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'MasternodeStepIpDialog',
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
        this.$message.error(this.$t('Ip address not valid'));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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

.step-three-subtitle {
  color: #818182;
  font-size: 14px;
  text-align: center;
}
</style>
