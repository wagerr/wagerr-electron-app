<template>
  <div id="bet_history" class="content row">
    <div class="col s12">
      <h4>
        Bet Transaction History
        <small>
          <el-tooltip
            content="Your most recent bets will appear after a short time."
            placement="right"
          >
            <i class="far fa-question-circle"></i>
          </el-tooltip>
        </small>
      </h4>
      <bet-transaction-list></bet-transaction-list>
    </div>
  </div>
</template>

<script>
import BetTransactionList from '@/components/BetHistory/BetTransactionList.vue';

export default {
  name: 'BetHistory',

  components: { BetTransactionList }
};
</script>
