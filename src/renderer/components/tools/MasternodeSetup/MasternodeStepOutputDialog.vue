<template>
  <el-dialog
    :close-on-click-modal="false"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="masternode-modal">
      <el-row class="modal-text text-center">
        <h4 class="modal-font">
          Step 5
          <br />Choose Masternode Transaction.
        </h4>
      </el-row>

      <table
        class="col-12 col-sm-12 col-md-12 col-lg-8 main-table card z-depth-2"
      >
        <thead>
          <tr>
            <th>txhash</th>

            <th>outputidx</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="mnoutput in tableData"
            :key="mnoutput.txhash"
            @click="onOutputSelect(mnoutput)"
            :class="[
              mnoutput.txhash == selectedOutput_txHash ? 'output-table-row' : ''
            ]"
          >
            <td>{{ mnoutput['txhash'] }}</td>
            <td>{{ mnoutput['outputidx'] }}</td>
          </tr>
        </tbody>
      </table>

      <el-row slot="footer" class="button-container options">
        <a class="btn green" @click.prevent="onNext()">Next</a>
        <a class="btn" @click.prevent="onBack()">Back</a>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import masternode_rpc from '@/services/api/masternode_rpc';
import _ from 'lodash';
import moment from 'moment';

export default {
  name: 'MasternodeStepOutputDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    outputSelection: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [],
      selectedOutput_txHash: '',
      defaultDate: new Date()
    };
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
    //  todo delete mock date
    dateValue: {
      get: () => moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    },
    innerRadioSelection: {
      get: function() {
        if (this.outputSelection) {
          return this.outputSelection.txhash;
        } else {
          return '';
        }
      },
      set: function(newValue) {
        let output = _.find(this.tableData, { txhash: newValue });
        this.$emit('update:outputSelection', output);
      }
    }
  },
  async mounted() {
    let outputs = await masternode_rpc.masternodeOutputs();
    console.log(outputs);
    this.tableData = outputs;
  },
  methods: {
    onBack() {
      this.$emit('back');
    },
    onNext() {
      this.$emit('next');
    },
    onOutputSelect(mnoutput) {
      if (this.selectedOutput_txHash === mnoutput.txhash) {
        this.selectedOutput_txHash = '';
        this.$emit('update:outputSelection', null);
      } else {
        this.selectedOutput_txHash = mnoutput.txhash;

        let output = _.find(this.tableData, {
          txhash: mnoutput.txhash
        });
        this.$emit('update:outputSelection', output);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../../assets/scss/_variables.scss';
.output-table-row {
  background: lightblue !important;
}
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

.step-title {
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
  margin-right: 20px;
}

.step-button-container {
  margin-top: 100px;
}

.step-next-text {
  color: #10e492;
}

.step-button-container {
  margin-top: 100px;
}

.step-next-text {
  color: #10e492;
}
</style>
<style lang="scss">
.el-table.table-transition {
  background: unset;
  color: #e6e6e6;
  tbody {
    tr {
      background: transparent;
      height: 55px;
      & > td {
        background: rgb(94, 94, 95);
        border-bottom: unset;
        border-bottom: 8px solid rgb(54, 54, 55);
      }
      td:first-child {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }
      td:last-child {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }
      &:hover > td {
        background: rgb(94, 94, 95);
      }
      &:hover > .row-date {
        background: rgb(126, 126, 127);
      }
    }
  }
  .row-txhash {
    margin-right: 37px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .row-date {
    background: rgb(126, 126, 127);
    text-align: center;
  }
  .row-checkbox {
    padding-left: 15px;
  }
  &::before {
    content: none;
  }
}
</style>
