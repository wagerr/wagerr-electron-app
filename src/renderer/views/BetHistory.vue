<template>
  <div id="bet_history" class="content row">
    <div class="col s12">
      <h4>
        Bet Transaction History
        <small>
          <i
            class="far fa-question-circle tooltipped"
            data-position="right"
            data-tooltip="Your most recent bets will appear after a short time."
          ></i>
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
  components: { BetTransactionList },

  mounted: function() {
    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit();
  }
};
</script>
