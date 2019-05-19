<template>
  <div id="bets" class="content row">
    <div class="col s12">
      <h4>Bet Transaction History</h4>

      <bet-transaction-list></bet-transaction-list>
    </div>
  </div>
</template>

<script>
import BetTransactionList from '@/components/bets/components/BetTransactionList';

export default {
  name: 'Bets',
  components: { BetTransactionList }
};
</script>
