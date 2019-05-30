<template>
  <div class="page-masternodes">
    <div class="col-title">
      <span class="masternode-title">Masternode</span>
      <el-button class="setup-button" @click="gotoSettingsMasternode"
        >Setup Masternode</el-button
      >
    </div>
    <el-table
      ref="myTable"
      @current-change="handleCurrentChange"
      row-key="pubkey"
      min-height="550"
      :data="masternodesRows"
      highlight-current-row
      header-row-class-name="el-table-masternodes-header"
      class="el-table-masternodes"
      row-class-name="table-recent-transactions-row"
      style="width: 100%"
    >
      <el-table-column
        class-name="col-alias"
        label="Alias"
        prop="alias"
        width="225"
      ></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="active"
        label="Active"
        width="140"
      ></el-table-column>
    </el-table>

    <div class="button-container">
      <el-button class="btn-medium" @click="onStartMasternodeAlias"
        >Start Alias</el-button
      >
      <el-button class="btn-medium" @click="onStartMasternodeMany"
        >Start Many</el-button
      >
      <el-button class="btn-medium" @click="onStartMasternodeMissing"
        >Start Missing</el-button
      >
      <el-button class="btn-medium" @click="getMasternodeStatus"
        >update status</el-button
      >
      <el-button class="btn-medium" @click="showingMasternodeConf"
        >Masternode.conf</el-button
      >
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import moment from 'moment';
import ipcRender from '../../../common/ipc/ipcRender';
import masternode_rpc from '@/services/api/masternode_rpc';
import { getCoinMasternodeConfPath } from '../../../main/blockchain/blockchain';
import { shell } from 'electron';
export default {
  name: 'Masternodes',
  // components: {
  //   UnlockDialog,
  //   DefaultButton
  // },
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
    async handleCurrentChange(currentRow) {
      this.selectedRow = currentRow;
    },
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
            if (mn[1] === this.masternodesNetworkRows[n].pubkey) {
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
        if (this.selectedRow && this.$refs.myTable) {
          let findSelected = this.masternodesRows.filter(item => {
            if (
              item.pubkey === this.selectedRow.pubkey &&
              item.alias === this.selectedRow.alias
            )
              return item;
          });
          this.$refs.myTable.setCurrentRow(findSelected[0]);
        }
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
          data = await ipc.callMain(MASTERNODE_START_ALIAS, {
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
          data = await ipc.callMain(MASTERNODE_START_MISSING);
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
        if (e.code === -13) {
          this.isUnlockWalletWindowOpen = true;
        }
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
    showingMasternodeConf() {
      const masternodeConfPath = getCoinMasternodeConfPath();
      console.log(masternodeConfPath);
      shell.openItem(masternodeConfPath);
    },
    gotoSettingsMasternode() {
      this.$router.replace({ path: `/settings/masternodes` });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables.scss';

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
    width: 185px;
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
    background-color: transparent;
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
  .el-button {
    border: none;
    margin: 10px;
  }
  .el-button:hover {
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
