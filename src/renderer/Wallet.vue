<template>

    <div id="wallet" class="content">

        <h1 class="text-center">

            WGR <span class="spacing">Balance</span>

        </h1>

        <div class="dashboard-balance">

            <div class="amount">{{ walletLoaded ? balance : 'Loading...' }}</div>

        </div>

        <!--<div class="dashboard-staking"><span class="amount">0</span> staking</div>-->

        <div class="text-center">

            <br>

            <a class="waves-effect waves-red btn-large modal-trigger wagerr-red-bg" data-target="send-tx-modal">Send</a>

            <a class="waves-effect waves-red btn-large modal-trigger wagerr-red-bg" @click="this.getAccountAddress" data-target="receive-tx-modal">Receive</a>

            <br><br>

        </div>

        <!-- Include the send & receive modals -->
        <send-transaction></send-transaction>
        <receive-transaction></receive-transaction>

        <div class='table-container'>

            <!-- Include the wallet transaction list. -->
            <transaction-list></transaction-list>

        </div>

    </div>

</template>

<script>

    import Vuex from 'vuex'
    import SendTransaction from '@/components/modals/SendTransaction'
    import ReceiveTransaction from '@/components/modals/ReceiveTransaction'
    import TransactionList from '@/components/transactions/TransactionList'

    export default {
        name: 'Wallet',
        components: { SendTransaction, ReceiveTransaction, TransactionList },

        computed: {
            ...Vuex.mapGetters([
                'balance',
                'walletLoaded',
                'accountAddress'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'getAccountAddress'
            ])
        }
    }

</script>

<style scoped>

    .content{
        padding: 20px;
        min-height: 650px;
    }

    .table-container{
        width: 100%;
        font-size: 14px;
    }

</style>
