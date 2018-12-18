<template>

    <div id="bets" class="content">

        <!--<div class="bets-50">

            <div class="block">

                <h2>Previous Bets <i class="icon-history pull-right"></i></h2>

                <table width="100%" cellpadding="0" cellspacing="0" border="0">

                    <tr>

                        <td>Warriors vs Cavaliers</td>
                        <td class="red text-center">-100</td>
                        <td class="text-center"><button class="btn-view open-demo-dialog">View</button></td>

                    </tr>

                    <tr class="bg">

                        <td>MLB 3 Day contest</td>
                        <td class="green text-center">+100</td>
                        <td class="text-center"><button class="btn-view open-demo-dialog">View</button></td>

                    </tr>

                    <tr>

                        <td>NAS Winner challenge</td>
                        <td class="green text-center">+100</td>
                        <td class="text-center"><button class="btn-view open-demo-dialog">View</button></td>

                    </tr>

                    <tr class="bg">

                        <td>MLB 3 Day contest</td>
                        <td class="green text-center">+100</td>
                        <td class="text-center"><button class="btn-view open-demo-dialog">View</button></td>

                    </tr>

                    <tr>

                        <td>MLB King of the Hill</td>
                        <td class="green text-center">+100</td>
                        <td class="text-center"><button class="btn-view open-demo-dialog">View</button></td>

                    </tr>

                    <tr class="bg">

                        <td>MLB 2 Day contest</td>
                        <td class="green text-center">+100</td>
                        <td class="text-center"><button class="btn-view open-demo-dialog">View</button></td>

                    </tr>

                </table>

            </div>

        </div>-->

        <div class="">

            <h5>Bet Transaction History</h5>

            <bet-transaction-list></bet-transaction-list>

        </div>

    </div>

</template>

<script>

    import BetTransactionList from '@/components/transactions/BetTransactionList'

    export default {
        name: 'Bets',
        components: { BetTransactionList },
    }

</script>

<style lang="scss" scoped>

    .content{
        padding: 20px;
        height: 100vh;
    }

</style>
