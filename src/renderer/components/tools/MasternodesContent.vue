<template>
  <div>
    <masternode-step-send-dialog
      :isVisible.sync="showStepSend"
      @next="onStepSendFinish"
    ></masternode-step-send-dialog>
    <masternode-step-alias-dialog
      :isVisible.sync="showStepAlias"
      @back="onStepAliasBack"
      @next="onStepAliasFinish"
      :alias.sync="alias"
    ></masternode-step-alias-dialog>
    <masternode-step-ip-dialog
      :isVisible.sync="showStepIp"
      @next="onStepIpFinish"
      @back="onStepIpBack"
      :ip.sync="ip"
    ></masternode-step-ip-dialog>
    <masternode-step-private-key-dialog
      :isVisible.sync="showStepPrivateKey"
      @next="onStepPrivateKeyFinish"
      @back="onStepPrivateKeyBack"
      :privateKey.sync="privateKey"
    ></masternode-step-private-key-dialog>
    <masternode-step-output-dialog
      :isVisible.sync="showStepOutput"
      @next="onStepOutputFinish"
      @back="onStepOutputBack"
      :outputSelection.sync="outputSelection"
    ></masternode-step-output-dialog>
    <masternode-step-six-dialog
      :isVisible.sync="showStepSix"
      @next="onStepSixFinish"
      @back="onStepSixBack"
    ></masternode-step-six-dialog>

    <h4>Masternode Setup (BETA)</h4>

    <p>
      This screen provides a helpful interactive process that guides you through
      setting up a Wagerr masternode. While this interactive guide has been
      tested and there are no known major issues, we are still actively
      developing this feature so please use at your own risk or alternatively
      you can use the RPC CLI window in the Settings menu.
    </p>

    <div class="row button-container">
      <a
        class="waves-effect waves-light btn-large wagerr-red-bg pulse"
        :is-light="true"
        @click="onStartSetup"
      >
        START SETUP
      </a>
      <a
        class="waves-effect waves-red wallet-action btn-large modal-trigger wagerr-red-bg z-depth-2"
        :is-light="true"
        @click="onOpenConfig"
      >
        Masternode.conf
      </a>
    </div>

    <div class="row list-masternode">
      <ul class="collection">
        <li class="collection-item">
          <span class="red darken-4 btn">STEP ONE:</span>
          <span class="command">Send 25,000 Wagerr</span>
        </li>
        <li class="collection-item">
          <span class="red darken-4 btn">STEP TWO:</span>
          <span class="command">Name Masternode</span>
        </li>
        <li class="collection-item">
          <span class="red darken-4 btn">STEP THREE:</span>
          <span class="command">Enter IP Address</span>
        </li>
        <li class="collection-item">
          <span class="red darken-4 btn">STEP FOUR:</span>
          <span class="command">Generate Pairing Key</span>
        </li>
        <li class="collection-item">
          <span class="red darken-4 btn">STEP FIVE:</span>
          <span class="command">Choose Output</span>
        </li>
        <li class="collection-item">
          <span class="red darken-4 btn">STEP SIX:</span>
          <span class="command">Accept and Restart</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import MasternodeStepSendDialog from './MasternodeSetup/MasternodeStepSendDialog';
import MasternodeStepAliasDialog from './MasternodeSetup/MasternodeStepAliasDialog';
import MasternodeStepIpDialog from './MasternodeSetup/MasternodeStepIpDialog';
import MasternodeStepPrivateKeyDialog from './MasternodeSetup/MasternodeStepPrivateKeyDialog';
import MasternodeStepOutputDialog from './MasternodeSetup/MasternodeStepOutputDialog';
import MasternodeStepSixDialog from './MasternodeSetup/MasternodeStepSixDialog';

import ipcRenderer from '../../../common/ipc/ipcRenderer';
import masternode_rpc from '@/services/api/masternode_rpc';
import {
  getCoinMasternodeConfPath,
  testnet
} from '../../../main/blockchain/blockchain';
import {
  testnetParams,
  mainnetParams
} from '../../../main/constants/constants';
import _ from 'lodash';
import { shell } from 'electron';

export default {
  name: 'MasternodesContent',

  components: {
    MasternodeStepSendDialog,
    MasternodeStepAliasDialog,
    MasternodeStepIpDialog,
    MasternodeStepPrivateKeyDialog,
    MasternodeStepOutputDialog,
    MasternodeStepSixDialog
  },

  data() {
    return {
      ip: '',
      port: '',
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

  methods: {
    onOpenConfig() {
      let masternodeConfigPath = getCoinMasternodeConfPath();
      shell.openItem(masternodeConfigPath);
    },

    onStartSetup() {
      this.showStepSend = true;
    },

    onStepSendFinish() {
      this.showStepSend = false;
      this.showStepAlias = true;
    },

    onStepAliasBack() {
      this.showStepSend = true;
      this.showStepAlias = false;
    },

    onStepAliasFinish() {
      if (!this.alias || this.alias.length === 0) {
        this.$message.error('Alias can not be empty');
        return;
      }
      if (!_.find(this.configOutputs, { alias: this.alias })) {
        this.showStepAlias = false;
        this.showStepIp = true;
      } else {
        this.$message.error('Alias already exist');
      }
    },

    onStepIpBack() {
      this.showStepIp = false;
      this.showStepAlias = true;
    },

    onStepIpFinish() {
      if (!this.ip || this.ip.length === 0) {
        this.$message.error('Ip can not be empty');
        return;
      }
      if (!_.find(this.configOutputs, { ip: `${this.ip}:${this.port}` })) {
        this.showStepIp = false;
        this.showStepPrivateKey = true;
      } else {
        this.$message.error('Ip already exist');
      }
      console.log('alias is:', this.alias, 'ip is:', this.ip);
    },

    onStepPrivateKeyBack() {
      this.showStepPrivateKey = false;
      this.showStepIp = true;
    },

    onStepPrivateKeyFinish() {
      if (!this.privateKey || this.privateKey.length === 0) {
        this.$message.error('PrivateKey can not be empty');
        return;
      }
      if (!_.find(this.configOutputs, { pubkey: this.privateKey })) {
        this.showStepPrivateKey = false;
        this.showStepOutput = true;
      } else {
        this.$message.error('PrivateKey already exist');
      }
    },

    onStepOutputBack() {
      this.showStepOutput = false;
      this.showStepPrivateKey = true;
    },

    async onStepOutputFinish() {
      console.log(this.outputSelection);
      if (!this.outputSelection) {
        this.$message.error('Output can not be empty');
        return;
      }
      if (
        _.find(this.configOutputs, {
          txhash: this.outputSelection.txhash
        })
      ) {
        this.$message.error('Output already exist');
        return;
      }
      try {
        await masternode_rpc.createMasternode({
          alias: this.alias,
          ipAddress: this.ip,
          port: this.port,
          privateKey: this.privateKey,
          masternodeOutputs: this.outputSelection.txhash,
          masternodeOutputIndex: this.outputSelection.outputidx
        });
        this.showStepOutput = false;
        this.showStepSix = true;
      } catch (e) {
        this.$message.error(e.message);
      }
    },

    onStepSixBack() {
      this.showStepSix = false;
      this.showStepOutput = true;
    },

    onStepSixFinish() {
      this.ip = '';
      this.alias = '';
      this.privateKey = '';
      this.outputSelection = null;
    }
  },

  async mounted() {
    // Set default masternode port.
    this.port = testnet
      ? testnetParams.DEFAULT_PORT
      : mainnetParams.DEFAULT_PORT;

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
  }
};
</script>

<style scoped lang="scss">
@import '../../assets/scss/_variables.scss';

.row {
  margin-bottom: 0;
}

.list-masternode {
  li {
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
    .btn {
      cursor: auto;
      box-shadow: none;
    }
  }
}

.button-container {
  display: flex;
  justify-content: center;

  a {
    margin: 5px;
  }
}
.config-button {
  width: 180px;
  margin-left: 20px;
}
</style>
