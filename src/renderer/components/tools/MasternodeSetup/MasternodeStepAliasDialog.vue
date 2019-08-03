<template>
  <el-dialog
    :close-on-click-modal="false"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="masternode-modal">
      <el-row class="modal-text text-center">
        <h4 class="modal-font">
          Step 2
          <br />Assign a Name for your Masternode.
        </h4>
      </el-row>
      <div class="input-field col s12">
        <i class="fas fa-tags prefix"></i>

        <input
          v-model="innerAlias"
          v-validate
          id="alias"
          name="alias"
          type="text"
          autofocus
        />

        <label for="alias">Alias:</label>

        <span v-if="errors.has('alias')" class="form-error">{{
          errors.first('alias')
        }}</span>
      </div>
      <el-row slot="footer" class="button-container options">
        <a class="btn green" @click.prevent="onNext()">Next</a>
        <a class="btn" @click.prevent="onBack()">Back</a>
      </el-row>
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
        this.$emit('update:alias', newValue);
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
