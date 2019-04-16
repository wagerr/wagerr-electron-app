<template>

    <!-- Peerless bet List -->
    <div v-if="plBetTransactionList.length === 0" class="no-transactions z-depth-2 text-center">

        <p>Looks like a new wallet, no betting transactions to list!</p>

        <p>Jump to the <router-link class="router-link" tag="a" to="/betting">betting tab</router-link> and start placing bets.</p>

    </div>

    <div v-else>

        <table class="main-table card z-depth-2">

            <thead>

                <tr>

                    <th class="hide-on-med-and-down">Transaction ID</th>

                    <th class="hide-on-small-only">Event ID</th>

                    <th class="hide-on-med-and-down show-on-large">Bet Outcome</th>

                    <th class="">WGR Amount</th>

                    <th class="">Result</th>

                </tr>

            </thead>

            <tbody>

                <tr v-for="tx in plBetTransactionList" :key="tx.id">

                    <td class="hide-on-small-only">

                        <a @click="blockExplorerUrl(tx['tx-id'])" class="transaction-link">

                            {{ tx['tx-id'] }}

                        </a>

                    </td>

                    <td class="hide-on-small-only" >{{ tx['event-id'] }}</td>

                    <td class="hide-on-med-and-down show-on-large">{{ outcomeToText( tx['team-to-win'] ) }}</td>

                    <td class="">{{ tx.amount }} {{ getNetworkType === "Testnet" ? 'tWGR' : 'WGR' }} </td>

                    <td class="hide-on-small-only" >{{ tx['result'] }}</td>

                </tr>

            </tbody>

        </table>

    </div>

</template>

<script>

    import Vuex from 'vuex';
    import constants from '../../../../main/constants/constants';

    export default {
        name: 'BetTransactionList',

        computed: {
            ...Vuex.mapGetters([
                'timezone',
                'plBetTransactionList',
                'getNetworkType'
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
                        return 'Money Line Home';
                    case 2:
                        return 'Money Line Away';
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
            },

            blockExplorerUrl (txId) {
                let shell       = require('electron').shell;
                let explorerUrl = this.getNetworkType === 'Testnet' ? constants.TESTNET_EXP_URL : constants.MAINNET_EXP_URL;

                shell.openExternal(explorerUrl + '/#/tx/' + txId);
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

