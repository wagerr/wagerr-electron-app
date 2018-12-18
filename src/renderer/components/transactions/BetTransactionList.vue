<template>

    <!-- Peerless bet List -->

    <table class="highlight">

        <thead>

            <tr>

                <th class="col s1 m1 l1 hide-on-med-and-down">Transaction ID</th>

                <th class="col s1 m1 l1 hide-on-small-only">Event ID</th>

                <th class="col s3s m3 l3 hide-on-med-and-down show-on-large">Team To Win</th>

                <th class="col s2 m2 l2">Amount</th>

            </tr>

        </thead>

        <tbody>

            <tr v-for="tx in plBetTransactionList" :key="tx.id">

                <td class="col s1s m1 l1 hide-on-small-only">

                    {{ tx['tx-id'] }}

                </td>

                <td class="col s1s m1 l1 hide-on-small-only">{{ tx['event-id'] }}</td>

                <td class="col s3s m3 l3 hide-on-med-and-down show-on-large">{{tx['team-to-win']}}</td>

                <td class="col s2 m2 l2 ">{{tx.amount}}</td>

            </tr>

        </tbody>

    </table>

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
                'getAccountAddress'
            ]),
        }
    }

</script>

<style scoped>

</style>
