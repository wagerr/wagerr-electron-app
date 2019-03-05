<template>

    <!-- Peerless bet List -->
    <div v-if="plBetTransactionList.length === 0" class="no-transactions text-center">

        <p>Looks like a new wallet, no betting transactions to list!</p>

        <p>Jump to the <router-link class="router-link" tag="a" to="/betting">betting tab</router-link> and start placing bets.</p>

        <i class="fas fa-dice"></i>

    </div>

    <div v-else>

        <table class="main-table card z-depth-2">

            <thead>

                <tr>

                    <th class="col s1 m1 l1 hide-on-med-and-down">Transaction ID</th>

                    <th class="col s1 m1 l1 hide-on-small-only">Event ID</th>

                    <th class="col s3s m3 l3 hide-on-med-and-down show-on-large">Bet Outcome</th>

                    <th class="col s2 m2 l2">WGR Amount</th>

                </tr>

            </thead>

            <tbody>

                <tr v-for="tx in plBetTransactionList" :key="tx.id">

                    <td class="col s1s m1 l1 hide-on-small-only">

                        {{ tx['tx-id'] }}

                    </td>

                    <td class="col s1s m1 l1 hide-on-small-only">{{ tx['event-id']}}</td>

                    <td class="col s3s m3 l3 hide-on-med-and-down show-on-large">{{ outcomeToText( tx['team-to-win'] ) }}</td>

                    <td class="col s2 m2 l2 ">{{ tx.amount }}</td>

                </tr>

            </tbody>

        </table>

    </div>

</template>

<script>

    import Vuex from 'vuex'

    export default {
        name: 'BetTransactionList',

        computed: {
            ...Vuex.mapGetters([
                'timezone',
                'plBetTransactionList'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'getAccountAddress',
                'getPLBetTransactionList'
            ]),

            // Convert the interger
            outcomeToText: function (outcome) {
                switch(outcome) {
                    case 1:
                        return 'Money Line Win';
                    case 2:
                        return 'Money Line Lose';
                    case 3:
                        return 'Money Line Draw';
                    case 4:
                        return 'Spread Over Win';
                    case 5:
                        return 'Spread Under Win';
                    case 6:
                        return 'Totals Over Win';
                    case 7:
                        return 'Totals Under Win';
                    default:
                        return outcome;

                }
            }
        },

        data () {
            return {
                timeout: 0
            }
        },

        mounted () {
            // Ping the get bets RPC method every 5 secs to show any new bet transactions.
            this.timeout = setInterval( async function () {
                this.getPLBetTransactionList();
            }.bind(this), 5000);
        },

        destroyed () {
            clearInterval(this.timeout);
        }
    }

</script>

<style lang="scss" scoped>

    @import "../../../assets/scss/_variables.scss";

    .no-transactions{
        margin-top: 10%;
    }

    .no-transactions p{
        font-size: 1.5em;
    }

    .no-transactions .fa-dice{
        color: $wagerr_dark_red;
        font-size: 10em;
    }

</style>
