<template>

    <!-- Transaction List -->

    <table class="highlight">

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

<style scoped>

</style>