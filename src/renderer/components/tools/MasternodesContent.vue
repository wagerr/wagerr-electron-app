<template>
  <div>
    <masternode-step-send-dialog
      :close-on-click-modal="false"
      :isVisible.sync="showStepSend"
    ></masternode-step-send-dialog>
    <!-- @next="onStepSendFinish" <masternode-step-alias-dialog
            :close-on-click-modal="false"
            :isVisible.sync="showStepAlias"
            @next="onStepAliasFinish"
            @back="onStepAliasBack"
            :ip.sync="alias"
        ></masternode-step-alias-dialog>
        <masternode-step-ip-dialog
            :close-on-click-modal="false"
            :isVisible.sync="showStepIp"
            @next="onStepIpFinish"
            @back="onStepIpBack"
            :ip.sync="ip"
        ></masternode-step-ip-dialog>
        <masternode-step-private-key-dialog
            :close-on-click-modal="false"
            :isVisible.sync="showStepPrivateKey"
            @next="onStepPrivateKeyFinish"
            @back="onStepPrivateKeyBack"
            :privateKey.sync="privateKey"
        ></masternode-step-private-key-dialog>
        <masternode-step-output-dialog
            :close-on-click-modal="false"
            :isVisible.sync="showStepOutput"
            @next="onStepOutputFinish"
            @back="onStepOutputBack"
            :outputSelection.sync="outputSelection"
        ></masternode-step-output-dialog>
        <masternode-step-six-dialog
            :close-on-click-modal="false"
            @next="onStepSixFinish"
            @back="onStepSixBack"
            :isVisible.sync="showStepSix"
        ></masternode-step-six-dialog>-->
    <el-row class="masternode-container">
      <el-col :span="12" class="masternode-panel-left">
        <el-row class="masternode-container">
          <table class="table-masternode">
            <tbody class="table-masternode-body">
              <tr>
                <td>STEP ONE:</td>
                <td>Send 20,000 ION</td>
              </tr>
              <tr>
                <td>STEP TWO:</td>
                <td>Name Masternode</td>
              </tr>
              <tr>
                <td>STEP THREE:</td>
                <td>Enter IP Address</td>
              </tr>
              <tr>
                <td>STEP FOUR:</td>
                <td>Generate Pairing Key</td>
              </tr>
              <tr>
                <td>STEP FIVE:</td>
                <td>Choose Output</td>
              </tr>
              <tr>
                <td>STEP SIX:</td>
                <td>Accept and Restart</td>
              </tr>
            </tbody>
          </table>
        </el-row>
        <el-row class="button-container">
          <el-button class="btn-medium" :is-light="true" @click="onStartSetup"
            >START SETUP</el-button
          >
          <!-- <el-button
                        :is-light="true"
                        @click="onOpenConfig"
                        class="config-button"
                    >{{$t('settings.masternodes.masternode_config')}}</el-button>-->
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import MasternodeStepAliasDialog from "./MasternodeSetup/MasternodeStepAliasDialog";

import MasternodeStepSendDialog from './MasternodeSetup/MasternodeStepSendDialog';
// import MasternodeStepIpDialog from "./MasternodeSetup/MasternodeStepIpDialog";
// import MasternodeStepPrivateKeyDialog from "./MasternodeSetup/MasternodeStepPrivateKeyDialog";
// import MasternodeStepOutputDialog from "./MasternodeSetup/MasternodeStepOutputDialog";
// import MasternodeStepSixDialog from "./MasternodeSetup/MasternodeStepSixDialog";

import ipcRender from '../../../common/ipc/ipcRender';
import masternode_rpc from '@/services/api/masternode_rpc';
import { getCoinMasternodeConfPath } from '../../../main/blockchain/blockchain';

import _ from 'lodash';
import { shell } from 'electron';

export default {
  name: 'MasternodesContent',
  components: {
    // MasternodeStepAliasDialog
    MasternodeStepSendDialog
    // MasternodeStepOutputDialog,
    // MasternodeStepPrivateKeyDialog,
    // MasternodeStepIpDialog,
    // MasternodeStepSixDialog
  },
  data() {
    return {
      ip: '',
      alias: '',
      privateKey: '',
      outputSelection: null,
      showStepSend: false,
      showStepAlias: false,
      showStepIp: false,
      showStepPrivateKey: false,
      showStepOutput: false,
      showStepSix: false,
      configOutputs: []
    };
  },
  async mounted() {
    let mnConfig = await masternode_rpc.getMasternodeConfigSync();
    if (!mnConfig) return false;

    mnConfig = mnConfig.split('\n');
    if (!mnConfig.length) return false;
    this.configOutputs = [];
    mnConfig
      .filter(node => {
        return node.trim() !== '' && node.indexOf('#') === -1;
      })
      .forEach(mn => {
        let item = mn.split(' ');
        let entry = {
          alias: item[0],
          ip: item[1],
          pubkey: item[2],
          txhash: item[3],
          outputidx: item[4]
        };
        this.configOutputs.push(entry);
      });
    console.log('mounted', this.configOutputs);
  },
  methods: {
    onOpenConfig() {
      let masternodeConfigPath = getCoinMasternodeConfPath();
      shell.openItem(masternodeConfigPath);
    },
    onStartSetup() {
      this.showStepSend = true;
    }
    // onStepSendFinish() {
    //     console.log("onStepSendFinish");
    //     this.showStepSend = false;
    //     this.showStepAlias = true;
    // },
    // onStepAliasBack() {
    //     this.showStepSend = true;
    //     this.showStepAlias = false;
    // },
    // onStepAliasFinish() {
    //     if (!this.alias || this.alias.length === 0) {
    //         this.$message.error(
    //             this.$t("settings.masternodes.message.alias_empty_error")
    //         );
    //         return;
    //     }
    //     if (!_.find(this.configOutputs, { alias: this.alias })) {
    //         this.showStepAlias = false;
    //         this.showStepIp = true;
    //     } else {
    //         this.$message.error(
    //             this.$t("settings.masternodes.message.alias_exist_error")
    //         );
    //     }
    // },
    // onStepIpBack() {
    //     this.showStepIp = false;
    //     this.showStepAlias = true;
    // },
    // onStepIpFinish() {
    //     if (!this.ip || this.ip.length === 0) {
    //         this.$message.error(
    //             this.$t("settings.masternodes.message.ip_empty_error")
    //         );
    //         return;
    //     }
    //     if (!_.find(this.configOutputs, { ip: `${this.ip}:${port}` })) {
    //         this.showStepIp = false;
    //         this.showStepPrivateKey = true;
    //     } else {
    //         this.$message.error(
    //             this.$t("settings.masternodes.message.ip_exist_error")
    //         );
    //     }
    // },
    // onStepPrivateKeyBack() {
    //     this.showStepPrivateKey = false;
    //     this.showStepIp = true;
    // },
    // onStepPrivateKeyFinish() {
    //     if (!this.privateKey || this.privateKey.length === 0) {
    //         this.$message.error(
    //             this.$t("settings.masternodes.message.key_empty_error")
    //         );
    //         return;
    //     }
    //     if (!_.find(this.configOutputs, { pubkey: this.privateKey })) {
    //         this.showStepPrivateKey = false;
    //         this.showStepOutput = true;
    //     } else {
    //         this.$message.error(
    //             this.$t("settings.masternodes.message.key_exist_error")
    //         );
    //     }
    // },
    // async onStepOutputBack() {
    //     this.showStepOutput = false;
    //     this.showStepPrivateKey = true;
    // },
    // async onStepOutputFinish() {
    //     if (!this.outputSelection) {
    //         this.$message.error(
    //             this.$t("settings.masternodes.message.output_empty_error")
    //         );
    //         return;
    //     }
    //     if (
    //         _.find(this.configOutputs, {
    //             txhash: this.outputSelection.txhash
    //         })
    //     ) {
    //         this.$message.error(
    //             this.$t("settings.masternodes.message.output_exist_error")
    //         );
    //         return;
    //     }
    //     try {
    //         await ipc.callMain(CREATE_MASTERNODE, {
    //             alias: this.alias,
    //             ipAddress: this.ip,
    //             port: port,
    //             privateKey: this.privateKey,
    //             masternodeOutputs: this.outputSelection.txhash,
    //             masternodeOutputIndex: this.outputSelection.outputidx
    //         });
    //         this.showStepOutput = false;
    //         this.showStepSix = true;
    //     } catch (e) {
    //         this.$message.error(e.message);
    //     }
    // },
    // async onStepSixBack() {
    //     this.showStepSix = false;
    //     this.showStepOutput = true;
    // },
    // async onStepSixFinish() {
    //     this.ip = "";
    //     this.alias = "";
    //     this.privateKey = "";
    //     this.outputSelection = null;
    // }
  }
};
</script>

<style scoped lang="scss">
@import '../../assets/scss/_variables.scss';

.masternode-container {
  display: flex;
  width: 100%;
}

.masternode-panel-left {
  border-right: 3px solid #39393a;
  margin-bottom: 10px;
  margin-right: 20px;
}

.table-masternode {
  width: 100%;
  padding-left: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}

.table-masternode-body > tr {
  height: 50px;
  line-height: 50px;
}

.table-masternode-body td:nth-child(2) {
  font-size: 16px;
  text-align: right;
  padding-right: 20px;
}

.button-container {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}

.setup-button {
  width: 180px;
  font-weight: bolder;
}

.config-button {
  width: 180px;
  margin-left: 20px;
}
</style>
