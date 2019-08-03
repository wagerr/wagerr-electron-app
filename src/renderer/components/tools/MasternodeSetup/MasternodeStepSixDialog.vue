<template>
  <el-dialog
    :close-on-click-modal="false"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="masternode-modal">
      <el-row class="modal-text text-center">
        <h4 class="modal-font">
          Step 6
          <br />Finish and Restart.
        </h4>
      </el-row>

      <el-row class="button-container">
        <a class="btn" @click.prevent="onOpenWalletFile()">
          Open Wallet Config File
        </a>
        <a class="btn" @click.prevent="onOpenMasternodeFile()">
          Open Masternode Config File
        </a>
      </el-row>
      <div class="step-subtitle">
        Your settings have been saved to your Configuration files. You can view
        them here if you like, or just restart your wallet to start your
        masternode.
      </div>

      <el-row slot="footer" class="button-container options">
        <a class="btn green finish-button" @click.prevent="onFinish()">
          Finish
        </a>
        <a class="btn blue restart-button" @click.prevent="onRestart()">
          Restart Wallet
        </a>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import {
  getWagerrConfPath,
  getCoinMasternodeConfPath
} from '../../../../main/blockchain/blockchain';
import { shell } from 'electron';
import ipcRenderer from '../../../../common/ipc/ipcRenderer';

export default {
  name: 'MasternodeStepSixDialog',
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
      let coinConfigPath = getWagerrConfPath();
      shell.openItem(coinConfigPath);
    },
    onRestart() {
      ipcRenderer.restartWallet();
    },
    onFinish() {
      this.$emit('next');
      this.showDialog = false;
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
}

.restart-button {
  float: right;
  margin-right: 10px;
}

.finish-button {
  float: right;
}

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
