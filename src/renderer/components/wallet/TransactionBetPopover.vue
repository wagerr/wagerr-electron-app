<template>
  <el-popover trigger="hover" @show="show">
    <div class="txbet-popover">
      <i v-if="!betInfo" class="fas fa-spinner fa-spin"></i>
      <div v-if="betInfo">
        <div v-for="(bet, index) in betInfo.legs" :key="index">
          Event {{ bet['event-id'] }}: {{ bet.lockedEvent.home }} vs {{ bet.lockedEvent.away }} |
          <bet-to-text :bet="bet"></bet-to-text>
        </div>
      </div>
    </div>
    <i slot="reference" class="el-icon-info" />
  </el-popover>
</template>

<script>
import wagerrRPC from '../../services/api/wagerrRPC';
import BetToText from '../BetHistory/BetText.vue';

export default {
  name: 'TransactionBetPopover',

  components: { BetToText },

  props: ['type', 'txId', 'txDetails'],

  data() {
    return {
      betInfo: null
    };
  },

  methods: {
    show() {
      const { vout } = this.txDetails[0];

      if (this.type === 'BetPayout') {
        wagerrRPC.client
          .getPayoutInfo([{ txHash: this.txId, nOut: vout }])
          .then((resp) => {
            this.loadBetData(resp.result[0].payoutInfo.betTxHash);
          })
          .catch((err) => {
            this.error(err);
          });
      } else if (this.type === 'BetPlaced') {
        this.loadBetData(this.txId);
      }
    },

    loadBetData(txId) {
      wagerrRPC.client
        .getBetByTxId(txId)
        .then((resp) => {
          this.betInfo = resp.result[0];
        })
        .catch((err) => {
          this.error(err);
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
