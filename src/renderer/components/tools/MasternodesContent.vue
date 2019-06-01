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

    <h4>Masternode Setup</h4>

    <p>
      You can check the setup Masternode step here. Please consider you are
      ready for starting.
    </p>

    <el-row class="list-masternode">
      <ul class="collection">
        <li class="collection-item">
          <span class="waves-effect waves-light red darken-4 btn"
            >STEP ONE:</span
          >
          <span class="command">Send 25,000 Wagerr</span>
        </li>
        <li class="collection-item">
          <span class="waves-effect waves-light red darken-4 btn"
            >STEP TWO:</span
          >
          <span class="command">Name Masternode</span>
        </li>
        <li class="collection-item">
          <span class="waves-effect waves-light red darken-4 btn"
            >STEP THREE:</span
          >
          <span class="command">Enter IP Address</span>
        </li>
        <li class="collection-item">
          <span class="waves-effect waves-light red darken-4 btn"
            >STEP FOUR:</span
          >
          <span class="command">Generate Pairing Key</span>
        </li>
        <li class="collection-item">
          <span class="waves-effect waves-light red darken-4 btn"
            >STEP FIVE:</span
          >
          <span class="command">Choose Output</span>
        </li>
        <li class="collection-item">
          <span class="waves-effect waves-light red darken-4 btn"
            >STEP SIX:</span
          >
          <span class="command">Accept and Restart</span>
        </li>
      </ul>
    </el-row>
    <el-row class="button-container">
      <a
        class="waves-effect waves-light btn-large wagerr-red-bg pulse"
        :is-light="true"
        @click="onStartSetup"
        >START SETUP</a
      >
      <a
        class="waves-effect waves-red wallet-action btn-large modal-trigger wagerr-red-bg z-depth-2"
        :is-light="true"
        @click="onOpenConfig"
        >Masternode.conf</a
      >
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

.list-masternode {
  li {
    margin-bottom: 10px;
    .red {
      width: 180px;
      margin-right: 80px;
    }
    span.command {
      font-size: 16px;
      text-align: right;
      color: black;
      padding-right: 20px;
    }
  }
}

.button-container {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}
.config-button {
  width: 180px;
  margin-left: 20px;
}
</style>
