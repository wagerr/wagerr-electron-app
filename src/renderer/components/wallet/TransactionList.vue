<template>

    <!-- Transaction List -->
    <div v-if="wgrTransactionRecords.length === 0" class="no-transactions text-center">

        <p>Wallet has no Wagerr transactions to list...</p>

        <i class="far fa-list-alt"></i>

    </div>

    <div v-else>

        <table class="main-table card z-depth-2">

            <thead>

                <tr>

                    <th></th>

                    <th class="col s1 m1 l1 hide-on-med-and-down">Date</th>

                    <th class="col s1 m1 l1 hide-on-small-only">Type</th>

                    <!--<th class="col s3s m3 l3 hide-on-med-and-down show-on-large">Blockhash</th>-->

                    <th class="col s3s m3 l3">Address</th>

                    <th class="col s2 m2 l2">Amount</th>

                </tr>

            </thead>

            <tbody>

                <tr v-for="tx in wgrTransactionRecords" :key="tx.id" class="tx-record">

                    <td v-if="tx.confirmations === -1" class="confirmations confirmation-conflicted">

                        <i class="far fa-times-circle"></i>

                    </td>

                    <td v-else-if="tx.confirmations === 0" class="confirmations confirmation-pending">

                        <i class="far fa-question-circle"></i>

                    </td>

                    <td v-else-if="tx.confirmations > 0 && tx.confirmations < 6" class="confirmations">

                        <div class="timer-loader"></div>


                    </td>

                    <td v-else class="confirmations confirmation-success">

                        <i class="far fa-check-circle"></i>

                    </td>


                    <td class="col s2s m2 l2 hide-on-med-and-down" :class="{ 'confirmation-conflicted' : tx.confirmations === -1 }">

                        {{ Number(tx.time) | moment('timezone', getTimezone, 'LLL') }}

                    </td>

                    <td class="col s1s m1 l1 hide-on-small-only" :class="{ 'confirmation-conflicted' : tx.confirmations === -1 }">

                        {{tx.type}}

                    </td>

                    <!--<td class="col s3s m3 l3 hide-on-med-and-down show-on-large">{{tx.blockhash}}</td>-->

                    <td class="col s3s m3 l3" :class="{ 'confirmation-conflicted' : tx.confirmations === -1 }">

                        {{ tx.details[0].address }}

                    </td>

                    <td class="col s2 m2 l2" :class="{ 'confirmation-conflicted' : tx.confirmations === -1 }">

                        {{ tx.amount}}

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</template>

<script>

    import Vuex from 'vuex';

    export default {
        name: 'TransactionList',

        computed: {
            ...Vuex.mapGetters([
                'getTimezone',
                'wgrTransactionList',
                'wgrTransactionRecords'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                ''
            ])
        }
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

    .invalid{
        font-size: 1.1em;
        color: $wagerr_dark_red;
    }

    tbody tr{
        font-size: 1.1em;
    }

    .confirmations{
        padding: 15px 10px 10px 10px;
        font-size: 2.1em;
    }

    .confirmation-conflicted{
        color: $wagerr_red
    }

    .confirmation-success{
        color: green;
    }

    .confirmation-pending{
        color: orangered;
    }

</style>