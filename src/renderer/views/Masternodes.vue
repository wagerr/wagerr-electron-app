<template>
  <div class="page-masternodes">
    <div class="col-title">
      <span class="masternode-title">Masternode</span>
      <a
        class="waves-effect waves-red wallet-action btn modal-trigger wagerr-red-bg z-depth-2 setup-button"
        @click="gotoSettingsMasternode"
        >Setup Masternode</a
      >
    </div>

    <table
      class="col-12 col-sm-12 col-md-12 col-lg-8 main-table card z-depth-2"
    >
      <thead>
        <tr>
          <th>Alias</th>

          <th>Address</th>

          <th>Status</th>
          <th>Active</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="masternode in masternodesRows"
          :key="masternode.txhash"
          @click="onMasternodeSelect(masternode)"
          :class="[
            masternode.address == selectedRow.address ? 'output-table-row' : ''
          ]"
        >
          <td>{{ masternode.alias }}</td>

          <td>{{ masternode.address }}</td>

          <td>{{ masternode.status }}</td>
          <td>{{ masternode.active }}</td>
        </tr>
      </tbody>
    </table>

    <div class="button-container">
      <a
        class="waves-effect waves-red wallet-action btn modal-trigger wagerr-red-bg z-depth-2"
        @click="onStartMasternodeAlias"
        >Start Alias</a
      >
      <a
        class="waves-effect waves-red wallet-action btn modal-trigger wagerr-red-bg z-depth-2"
        @click="onStartMasternodeMany"
        >Start Many</a
      >
      <a
        class="waves-effect waves-red wallet-action btn modal-trigger wagerr-red-bg z-depth-2"
        @click="onStartMasternodeMissing"
        >Start Missing</a
      >
      <a
        class="waves-effect waves-red wallet-action btn modal-trigger wagerr-red-bg z-depth-2"
        @click="getMasternodeStatus"
        >update status</a
      >
      <a
        class="waves-effect waves-red wallet-action btn modal-trigger wagerr-red-bg z-depth-2"
        @click="showingMasternodeConf"
        >Masternode.conf</a
      >
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import moment from 'moment';
import ipcRenderer from '../../common/ipc/ipcRenderer';
import masternode_rpc from '@/services/api/masternode_rpc';
import { getCoinMasternodeConfPath } from '../../main/blockchain/blockchain';

import { shell } from 'electron';
export default {
  name: 'Masternodes',
  data() {
    return {
      masternodesRows: [],
      selectedRow: {},
      masternodesNetworkRows: [],
      isUnlockWalletWindowOpen: false,
      currentStartingType: 'many'
    };
  },
  async created() {
    // Get Receive Address List
    this.getMasternodeStatus();
  },
  methods: {
    async getMasternodeStatus() {
      console.log('getMasternodeStatus');
      try {
        await this.getNetworkMasternodeStatus();
        let result = await masternode_rpc.getMasternodeConfigSync();
        let mnConfig = result;

        if (!mnConfig) return false;
        mnConfig = mnConfig.split('\n');
        if (!mnConfig.length) return false;

        let masterNodes = mnConfig.filter(node => {
          return node.trim() !== '' && node.indexOf('#') === -1;
        });

        this.masternodesRows = [];
        masterNodes.forEach(mn => {
          let foundMNOnNetwork = false;
          mn = mn.split(' ');
          for (let n = 0; n < this.masternodesNetworkRows.length; n++) {
            // console.log(`compare ${mn[1]} and ${this.masternodesNetworkRows[n].address}`)
            if (mn[3] === this.masternodesNetworkRows[n].txhash) {
              let useMe = {
                ...this.masternodesNetworkRows[n],
                alias: mn[0],
                address: mn[1]
              };
              this.masternodesRows.push(useMe);
              foundMNOnNetwork = true;
              break;
            }
          }

          if (!foundMNOnNetwork) {
            let entry = {
              address: mn[1],
              active: 'unknown',
              status: 'unknown',
              alias: mn[0],
              pubkey: mn[2],
              txhash: mn[3],
              outputidx: mn[4]
            };
            this.masternodesRows.push(entry);
          }
        });

        console.log(this.masternodesRows);

        // if (this.selectedRow && this.$refs.myTable) {
        //     let findSelected = this.masternodesRows.filter(item => {
        //         if (
        //             item.pubkey === this.selectedRow.pubkey &&
        //             item.alias === this.selectedRow.alias
        //         )
        //             return item;
        //     });
        //     this.$refs.myTable.setCurrentRow(findSelected[0]);
        // }
        setTimeout(this.getMasternodeStatus, 10000);
      } catch (e) {
        console.log(e);
      }
    },
    async getNetworkMasternodeStatus() {
      // status, protocol, pubkey, ip:port, lastseen, activeseconds,lastpaid
      try {
        let res = await masternode_rpc.getMasternodeList();
        let rows = [];
        if (res) {
          for (let item of res) {
            let lastSeen = moment(item['lastseen'] * 1000).format(
              'MMMM Do YYYY, h:mm:ss a'
            );
            let minutesActive = moment.duration(item['activetime'], 'seconds');
            rows.push({
              txhash: item['txhash'], 
              status: item['status'],
              lastSeen: lastSeen,
              active: minutesActive.humanize(),
              pubkey: item['addr']
            });
          }
        }
        console.log("I'm from network Masternode status");
        this.masternodesNetworkRows = rows;
      } catch (e) {
        console.log(e);
      }
    },
    async onStartMasternodeMany() {
      this.currentStartingType = 'many';
      this.startMasternode();
    },
    async onStartMasternodeAlias() {
      this.currentStartingType = 'alias';
      this.startMasternode();
    },
    async onStartMasternodeMissing() {
      this.currentStartingType = 'missing';
      this.startMasternode();
    },
    async startMasternode() {
      try {
        let data;
        if (this.currentStartingType === 'many') {
          data = await masternode_rpc.masternodeStartMany();
          let list = [];
          let self = this;
          list.push(this.$createElement('h5', data.result.overall));
          data.result.detail.map(function(item) {
            list.push(
              self.$createElement(
                'p',
                item.alias + ' ' + item.result + ' ' + item.error
              )
            );
          });
          let vnode = this.$createElement('div', list);

          this.$message({
            message: vnode,
            type: 'success'
          });
        } else if (this.currentStartingType === 'alias') {
          if (!this.selectedRow) {
            this.$message.error('no_select');
            return;
          }
          data = await masternode_rpc.masternodeStartAlias({
            alias: this.selectedRow.alias
          });
          console.log(data);
          let list = [];
          list.push(this.$createElement('h5', data.result.overall));
          let item = data.result.detail[0];
          list.push(
            this.$createElement(
              'p',
              item.alias + ' ' + item.result + ' ' + item.errorMessage
            )
          );
          let vnode = this.$createElement('div', list);
          this.$message({
            message: vnode,
            type: 'success'
          });
        } else {
          data = await masternode_rpc.masternodeStartMissing();
          let list = [];
          let self = this;
          list.push(this.$createElement('h5', data.result.overall));
          data.result.detail.map(function(item) {
            list.push(
              self.$createElement(
                'p',
                item.alias + ' ' + item.result + ' ' + item.error
              )
            );
          });
          let vnode = this.$createElement('div', list);

          this.$message({
            message: vnode,
            type: 'success'
          });
        }

        await this.getMasternodeStatus();
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    async onWalletUnlock() {
      try {
        await this.startMasternode();
      } catch (e) {
        this.$message.error(e.message);
        console.log(e);
      }
    },
    onMasternodeSelect(masternode) {
      if (this.selectedRow.txhash === masternode.txhash) {
        this.selectedRow = {};
      } else this.selectedRow = masternode;
    },
    showingMasternodeConf() {
      const masternodeConfPath = getCoinMasternodeConfPath();
      console.log(masternodeConfPath);
      shell.openItem(masternodeConfPath);
    },
    gotoSettingsMasternode() {
      this.$router.replace({ path: `/tools/masternode_setup` });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';
.output-table-row {
  background: lightblue !important;
}
.col-title {
  margin-bottom: 20px;
  height: 40px;
  line-height: 40px;

  .masternode-title {
    font-weight: 700;
    font-family: 'Montserrat';
    font-size: 28px;
    color: #2b2c2d;
    margin-bottom: 25px;
    line-height: 30px;
  }
  .setup-button {
    float: right;
  }
}

.page-masternodes {
  margin: 40px 20px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  .el-table-masternodes {
    background-color: white;
    &::before {
      content: none;
    }
    & /deep/ .el-table-masternodes-header {
      color: black;
      font-size: 16px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      height: 40px;
      line-height: 40px;
      tr,
      th {
        background-color: unset;
        border-bottom: unset;
      }
    }
    & /deep/ .current-row td {
      background: #404142;
      color: rgba(255, 255, 255, 0.3);
    }
    & /deep/ .col-alias {
      padding-left: 37px;
    }
  }
}

.button-container {
  margin: 20px;
  .a {
    border: none;
    margin: 10px;
  }
  .a:hover {
    color: white;
  }
}

.create-masternode-dialog {
  .el-input {
    width: 300px;
  }
  .el-row {
    margin-top: 16px;
  }
  label {
    width: 200px;
  }
}
</style>
