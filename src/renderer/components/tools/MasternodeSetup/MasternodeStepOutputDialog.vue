<template>
  <el-dialog
    :close-on-click-modal="false"
    title="Step 5"
    class="custom-dialog"
    effect="fade/zoom"
    :visible.sync="showDialog"
  >
    <div class="dialog-header" slot="title">
      {{ $t('settings.masternodes.step_five.title') }}
    </div>
    <div class="step-title">
      {{ $t('settings.masternodes.step_five.description') }}
    </div>

    <el-table class="table-transition" :data="tableData" :show-header="false">
      <el-table-column width="75px" class-name="row-checkbox">
        <template slot-scope="scope">
          <!-- label可以使用tableData中的某个字段，注意该字段的值不要重复 -->
          <el-checkbox
            v-model="innerRadioSelection"
            :true-label="scope.row.txhash"
            >&thinsp;
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column class-name="row-txhash">
        <template slot-scope="scope">
          <div class="row-txhash">
            {{ scope.row.txhash }}
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="row-date" width="153px">
        <template slot-scope="scope">
          {{ dateValue }}
        </template>
      </el-table-column>
    </el-table>
    <div class="step-button-container">
      <default-button class="step-button" @click.prevent="onBack()">
        {{ $t('settings.masternodes.step_five.back') }}
      </default-button>
      <default-button class="step-button" @click.prevent="onNext()">
        <span class="step-next-text">{{
          $t('settings.masternodes.step_five.next')
        }}</span>
      </default-button>
    </div>
  </el-dialog>
</template>

<script>
import { CHECK_MASTERNODE_OUTPUTS } from '../../../../../common/channel/sendToMain';
import * as ipc from '../../../../../common/ipc/source/renderer';
import _ from 'lodash';
import DefaultButton from '../../../elements/DefaultButton/DefaultButton';
import moment from 'moment';

export default {
  name: 'MasternodeStepOutputDialog',
  components: { DefaultButton },
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
    let outputs = (await ipc.callMain(CHECK_MASTERNODE_OUTPUTS)).result;
    console.log(outputs);
    this.tableData = outputs;
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
