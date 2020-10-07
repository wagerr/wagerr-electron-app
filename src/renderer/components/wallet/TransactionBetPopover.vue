<template>
  <el-popover trigger="hover" v-on:show="show">              
    <div class="txbet-popover">
      <i class="fas fa-spinner fa-spin" v-if="!betInfo"></i>
      <div v-if="betInfo">
        <div v-for="bet in betInfo.legs">
          Event {{ bet['event-id'] }}: 
          {{ bet.lockedEvent.home }} vs {{ bet.lockedEvent.away }} | 
          <bet-to-text :bet="bet"></bet-to-text>
        </div>
      </div>
    </div>
    <i class="el-icon-info" slot="reference" />
  </el-popover>
</template>

<script>
import Vuex from 'vuex';
import wagerrRPC from '@/services/api/wagerrRPC';
import BetToText from '../BetHistory/BetText';

export default {
  name: 'TransactionBetPopover',
  components: { BetToText },
  props: ['type', 'txId', 'nOut'],
  data() {
    return {
      betInfo: null
    }
  },

  computed: {
    ...Vuex.mapGetters([
      'convertOdds'
    ])
  },

  methods: {
    show() {
      let self = this;

      if (this.type === 'BetPayout') {
        wagerrRPC.client
          .getPayoutInfo([{txHash: this.txId, nOut: this.nOut}])
          .then(function(resp) {
            self.loadBetData(resp.result[0].payoutInfo.betTxHash);
          })
          .catch(function(err) {
            self.error(err);
          })
      } else if (this.type === 'BetPlaced') {
        this.loadBetData(this.txId);
      }
    },

    loadBetData(txId) {
      let self = this;
      wagerrRPC.client
        .getBetByTxId(txId)
        .then(function(resp) {
          self.betInfo = resp.result[0];
        })
        .catch(function(err) {
          self.error(err);
      });
    },

    error(err) {
      console.log(err);
      M.toast({
        html:
          '<span class="toast__bold-font">Error &nbsp;</span> ' +
          'Something went wrong retrieving bet data',
        classes: 'wagerr-red-bg'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables.scss';
  i.el-icon-info {
    color: $gray-600;
    &:hover {
      color: $gray-700;
    }
  }

  .txbet-popover {
    display: flex;
    justify-content: center;
  }
</style>
