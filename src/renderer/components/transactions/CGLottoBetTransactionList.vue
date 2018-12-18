<template>

    <table class="highlight">

        <thead>

            <tr>

                <th class="col s10">Transaction ID</th>

                <th class="col s2">Event ID</th>

            </tr>

        </thead>

        <tbody>

            <tr v-for="tx in cgBetList" :key="tx.id">

                <td class="col s10">

                    {{ tx['tx-id'] }}

                </td>

                <td class="col s2"> {{ tx['event-id'] }}</td>

            </tr>

        </tbody>

    </table>

</template>

<script>

    import Vuex from 'vuex'

    export default {
        name: 'CGLottoBetTransactionList',

        computed: {
            ...Vuex.mapGetters([
                'timezone',
                'gameID',
                'currentGameBets',
                'cgBetList'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'listCGLottoBets'
            ])
        },

        mounted () {
            this.listCGLottoBets();
        }
    }

</script>

<style scoped>

     th, td{
        margin-top: 15px;
         margin-bottom: 15px;
    }

</style>
