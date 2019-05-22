import moment from './node_modules/moment';
import {
  GET_MASTERNODE_CONFIG,
  MASTERNODE_START_ALIAS,
  MASTERNODE_START_MISSING,
  NETWORK_MASTERNODES,
  MASTERNODE_START_MANY
} from '../../../../common/channel/sendToMain';
import * as ipc from '../../../../common/ipc/source/renderer';
import UnlockDialog from '/@/components/elements/UnlockDialog/UnlockDialog.vue';
import DefaultButton from '../../elements/DefaultButton/DefaultButton.vue';

export default {
  name: 'Masternodes',
  components: {
    UnlockDialog,
    DefaultButton
  },
  data() {
    return {
      masternodesRows: [],
      selectedRow: {},
      masternodesNetworkRows: [],
      isUnlockWalletWindowOpen: false,
      currentStartingType: 'many'
    };
  },
  created() {
    // Get Receive Address List
    this.getMasternodeStatus();
  },
  methods: {
    async handleCurrentChange(currentRow) {
      this.selectedRow = currentRow;
    },
    async getMasternodeStatus() {
      console.log('getMasternodeStatus');
      await this.getNetworkMasternodeStatus();
      const result = await ipc.callMain(GET_MASTERNODE_CONFIG);
      let mnConfig = result;
      if (!mnConfig) return false;

      mnConfig = mnConfig.split('\n');
      if (!mnConfig.length) return false;

      const masterNodes = mnConfig.filter(node => {
        return node.trim() !== '' && node.indexOf('#') === -1;
      });

      this.masternodesRows = [];
      masterNodes.forEach(mn => {
        let foundMNOnNetwork = false;
        mn = mn.split(' ');
        for (let n = 0; n < this.masternodesNetworkRows.length; n++) {
          // console.log(`compare ${mn[1]} and ${this.masternodesNetworkRows[n].address}`)
          if (mn[1] === this.masternodesNetworkRows[n].pubkey) {
            const useMe = {
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
          const entry = {
            address: mn[1],
            active: this.$t('masternode.message.unknown'),
            status: this.$t('masternode.message.unknown'),
            alias: mn[0],
            pubkey: mn[2],
            txhash: mn[3],
            outputidx: mn[4]
          };
          this.masternodesRows.push(entry);
        }
      });
      if (this.selectedRow && this.$refs.myTable) {
        const findSelected = this.masternodesRows.filter(item => {
          if (
            item.pubkey === this.selectedRow.pubkey &&
            item.alias === this.selectedRow.alias
          )
            return item;
        });
        this.$refs.myTable.setCurrentRow(findSelected[0]);
      }
      setTimeout(this.getMasternodeStatus, 10000);
    },
    async getNetworkMasternodeStatus() {
      // status, protocol, pubkey, ip:port, lastseen, activeseconds,lastpaid
      const res = (await ipc.callMain(NETWORK_MASTERNODES)).result;
      const rows = [];
      if (res) {
        for (const item of res) {
          const lastSeen = moment(item.lastseen * 1000).format(
            'MMMM Do YYYY, h:mm:ss a'
          );
          const minutesActive = moment.duration(item.activetime, 'seconds');
          rows.push({
            status: item.status,
            lastSeen,
            active: minutesActive.humanize(),
            pubkey: item.addr
          });
        }
      }
      this.masternodesNetworkRows = rows;
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
          data = await ipc.callMain(MASTERNODE_START_MANY);
          const list = [];
          const self = this;
          list.push(this.$createElement('h5', data.result.overall));
          data.result.detail.map(function(item) {
            list.push(
              self.$createElement(
                'p',
                `${item.alias} ${item.result} ${item.error}`
              )
            );
          });
          const vnode = this.$createElement('div', list);
          this.$message({
            message: vnode,
            type: 'success'
          });
        } else if (this.currentStartingType === 'alias') {
          if (!this.selectedRow) {
            this.$message.error(this.$t('masternode.message.no_select'));
            return;
          }
          data = await ipc.callMain(MASTERNODE_START_ALIAS, {
            alias: this.selectedRow.alias
          });
          console.log(data);
          const list = [];
          list.push(this.$createElement('h5', data.result.overall));
          const item = data.result.detail[0];
          list.push(
            this.$createElement(
              'p',
              `${item.alias} ${item.result} ${item.errorMessage}`
            )
          );
          const vnode = this.$createElement('div', list);
          this.$message({
            message: vnode,
            type: 'success'
          });
        } else {
          data = await ipc.callMain(MASTERNODE_START_MISSING);
          const list = [];
          const self = this;
          list.push(this.$createElement('h5', data.result.overall));
          data.result.detail.map(function(item) {
            list.push(
              self.$createElement(
                'p',
                `${item.alias} ${item.result} ${item.error}`
              )
            );
          });
          const vnode = this.$createElement('div', list);
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
    gotoSettingsMasternode() {
      this.$router.replace({ path: `/settings/masternodes` });
    }
  }
};
