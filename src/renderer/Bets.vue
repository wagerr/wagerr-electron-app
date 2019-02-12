<template>

    <div id="bets" class="content">

        <div class="">

            <h5>Bet Transaction History</h5>

            <bet-transaction-list></bet-transaction-list>

        </div>

    </div>

</template>

<script>

    import BetTransactionList from '@/components/bets/components/BetTransactionList';

    export default {
        name: 'Bets',
        components: { BetTransactionList },
    }

</script>

<style lang="scss" scoped>

    .content{
        padding: 20px;
        min-height: 650px;
    }

</style>
