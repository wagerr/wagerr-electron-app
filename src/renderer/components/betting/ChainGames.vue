<template>

    <div id="chain-games">

        <div class="row">

            <div class="col s6">

                <h5>Active CG Lotto Events <i class="icon-license2 pull-right"></i></h5>

                <c-g-lotto-bet-slip></c-g-lotto-bet-slip>

            </div>

            <div class="col s6">

                <h5>Active GC Lotto Details <i class="icon-history pull-right"></i></h5>

                <table cellpadding="0" cellspacing="0" border="0">

                    <tr>

                        <td>Total Entries</td>

                        <td class="text-center"> {{ noOfEntrants }} </td>

                    </tr>

                    <tr>

                        <td>Your Bets on this game</td>

                        <td class="text-center"> {{ currentGameBets }} </td>

                    </tr>

                    <tr>

                        <td>Start Block</td>

                        <td class="text-center"> {{ gameStartBlock }} </td>

                    </tr>

                    <tr>

                        <td>Start Time</td>

                        <td class="text-center"> {{ gameStartTime }} </td>

                    </tr>

                    <tr class="bg">

                        <td>End Time</td>

                        <td class="text-center"> {{ gameEndTime }} </td>

                    </tr>

                </table>

            </div>

        </div>

        <div class="table-container">

            <h5>CG Lotto Bet History</h5>

            <c-g-lotto-bet-transaction-list></c-g-lotto-bet-transaction-list>

        </div>

    </div>

</template>

<script>

    import Vuex from 'vuex'
    import CGLottoBetSlip from '@/components/bet_slip/CGLottoBetSlip'
    import CGLottoBetTransactionList from '@/components/transactions/CGLottoBetTransactionList'

    export default {
        name: 'CGLottoBets',
        components: { CGLottoBetTransactionList, CGLottoBetSlip },

        computed: {
            ...Vuex.mapGetters([
                'noOfEntrants',
                'entryFee',
                'gameID',
                'potSize',
                'gameStartBlock',
                'gameStartTime',
                'gameEndTime',
                'currentGameBets'
            ]),
        },

        methods: {
            ...Vuex.mapActions([
                'listChainGamesEvents'
            ])
        },

        created() {
            this.listChainGamesEvents()
        },

        mounted () {
            let that = this

            setInterval(function () {
                that.listChainGamesEvents()
            }, 30000)
        }
    }

</script>

<style scoped>

    .table-container{
        width: 100%;
        font-size: 14px;
    }

</style>
