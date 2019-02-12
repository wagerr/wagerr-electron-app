<template>

    <!-- Transaction List -->
    <div v-if="wgrTransactionList.length === 0" class="no-transactions text-center">

        <p>Wallet has no Wagerr transactions to list...</p>

        <i class="far fa-list-alt"></i>

    </div>

    <div v-else>

        <table class="main-table card z-depth-2">

            <thead>

                <tr>

                    <th class="col s1 m1 l1 hide-on-med-and-down">Date</th>

                    <th class="col s1 m1 l1 hide-on-small-only">Type</th>

                    <!--<th class="col s3s m3 l3 hide-on-med-and-down show-on-large">Blockhash</th>-->

                    <th class="col s3s m3 l3">Address</th>

                    <th class="col s2 m2 l2">Amount</th>

                </tr>

            </thead>

            <tbody>

                <tr v-for="tx in wgrTransactionList" :key="tx.id">

                    <td class="col s2s m2 l2 hide-on-med-and-down">

                        {{ Number(tx.time) | moment('timezone', getTimezone, 'LLLL') }}

                    </td>

                    <td class="col s1s m1 l1 hide-on-small-only">{{tx.category}}</td>

                    <!--<td class="col s3s m3 l3 hide-on-med-and-down show-on-large">{{tx.blockhash}}</td>-->

                    <td class="col s3s m3 l3 ">{{tx.address}}</td>

                    <td class="col s2 m2 l2 ">{{tx.amount}}</td>

                </tr>

            </tbody>

        </table>

    </div>

</template>

<script>

    import Vuex from 'vuex'

    export default {
        name: 'TransactionList',

        computed: {
            ...Vuex.mapGetters([
                'getTimezone',
                'wgrTransactionList'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                ''
            ]),
        },
    }

</script>

<style lang="scss" scoped>

    @import "../../assets/scss/_variables.scss";

    .no-transactions p {
        font-size: 1.5em;
    }

    .no-transactions .fa-list-alt{
        color: $wagerr_dark_red;
        font-size: 10em;
    }

</style>