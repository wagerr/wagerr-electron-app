<template>

    <div id="wallet" class="content">

        <div class="wallet-balance card z-depth-2 bg-gradient">

            <div class="inset-top">

                <div class="shadow"></div>

            </div>

            <h1 class="text-center">WGR Balance</h1>

            <div class="dashboard-balance row">

                <div class="col s12 text-center total-balance">{{ walletLoaded ? balance : 'Loading...' }} {{ getNetworkType === "Testnet" ? 'tWGR' : 'WGR' }}</div>


                <div class="col s6 right-align">Pending: </div>

                <div class="col s6">{{ walletLoaded ? pending : 'Loading...' }} {{ getNetworkType === "Testnet" ? 'tWGR' : 'WGR' }}</div>


                <div class="col s6 right-align">Immature:</div>

                <div class="col s6">{{ walletLoaded ? immature : 'Loading...' }} {{ getNetworkType === "Testnet" ? 'tWGR' : 'WGR' }}</div>


                <div class="label col s6 right-align">Zerocoin:</div>

                <div class="col s6">{{ walletLoaded ? zerocoin : 'Loading...' }} zWGR</div>

            </div>

        </div>

        <!--<div class="dashboard-staking"><span class="amount">0</span> staking</div>-->

        <div class="text-center wallet-btns">

            <a class="waves-effect waves-red wallet-action btn-large modal-trigger wagerr-red-bg z-depth-2" data-target="send-tx-modal">Send</a>

            <a class="waves-effect waves-red wallet-action btn-large modal-trigger wagerr-red-bg z-depth-2" @click="this.getAccountAddress" data-target="receive-tx-modal">Receive</a>

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

    import Vuex from 'vuex';
    import SendTransaction from '@/components/wallet/SendTransaction';
    import ReceiveTransaction from '@/components/wallet/ReceiveTransaction';
    import TransactionList from '@/components/wallet/TransactionList';

    export default {
        name: 'Wallet',
        components: { SendTransaction, ReceiveTransaction, TransactionList },

        computed: {
            ...Vuex.mapGetters([
                'balance',
                'immature',
                'pending',
                'zerocoin',
                'walletLoaded',
                'accountAddress',
                'wgrTransactionList',
                'getNetworkType'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'getAccountAddress',
                'walletExtendedBalance',
                'getWGRTransactionList',
                'getWGRTransactionRecords'
            ])

        },

        data () {
            return {
                timeout: 0
            }
        },

        mounted () {

            setInterval( function () {
                this.walletExtendedBalance();
            }.bind(this), 1000);

            this.timeout = setInterval( function () {
                this.getWGRTransactionRecords(100);
            }.bind(this), 2000);
        },

        destroyed () {
            clearInterval(this.timeout)
        }
    }

</script>

<style lang="scss" scoped>

    @import './assets/scss/_variables';

    .content{
        padding: 20px;
        min-height: 650px;
    }

    .table-container{
        width: 100%;
        font-size: 14px;
    }

    .wallet-balance{
        width: 50%;
        color: $wagerr_red;
        margin-left: auto;
        margin-right: auto;
    }

    .wallet-balance h1{
        margin-top: 10px;
        margin-bottom: 0;
    }

    .total-balance {
        font-size: 2.5em;
        color: white;
        padding-bottom: 20px;
    }

    .extended-balance{
        font-size: 1.5em;
    }

    .dashboard-balance{
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .dashboard-balance div{
        color: white;
    }


    .wallet-btns{
        margin-top: 10px;
        margin-bottom: 20px;
    }

</style>
