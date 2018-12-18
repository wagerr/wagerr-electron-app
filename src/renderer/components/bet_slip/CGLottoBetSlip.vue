<template>

    <div id="betting-slip">

            <div class="bet-list" v-if="gameID > 0">

           <ul>

               <li class="card" >

                    <div class="bet-details">

                        <div class="bet-details">

                            <span class="pull-left">Current Game ID:</span>

                            <span class="pull-right"> {{ gameID }}</span>

                            <div class="clear"></div>

                        </div>

                        <div class="clearfix"></div>

                        <div class="bet-details">

                            <span class="pull-left">Pot size:</span>

                            <span class="pull-right"> {{ potSize }}</span>

                            <div class="clear"></div>

                        </div>

                        <div class="clearfix"></div>

                        <div class="bet-details">

                            <span class="pull-left">Entry Fee:</span>

                            <span class="pull-right"> {{ entryFee }} </span>

                            <div class="clear"></div>

                        </div>

                    </div>

                </li>

            </ul>

            <div class="bet-slip-options">

                <button class="btn waves-effect waves-light" @click="placeCGLottoBet">Enter Lotto ({{ entryFee }} )</button>

                <div class="clearfix"></div>

            </div>

        </div>

        <div v-else class="bet-list">

            <div class="empty-slip-message text-center">

                <p>No Lotto events currently active!</p>

            </div>

        </div>

    </div>

</template>

<script>

    import Vuex from 'vuex'
    import wagerrRPC from '@/services/api/wagerrRPC'

    export default {
        name: 'CGLottoBetSlip',

        computed: {
            ...Vuex.mapGetters([
                'noOfEntrants',
                'entryFee',
                'gameID',
                'potSize',
                'gameStartBlock',
                'gameStartTime',
                'gameEndTime',
            ]),
        },

        methods: {
            ...Vuex.mapActions([
                'listChainGamesEvents'
            ]),

            // Place a bet on the given event and sent the tx to the Wagerr blockchain.
            placeCGLottoBet: function (gameID) {

                let entryFeeInt = parseInt(this.entryFee.split(' ')[0]);

                wagerrRPC.client.placeChainGamesBet(this.gameID, entryFeeInt)
                    .then(function (resp) {
                        // If bet was successful then display bet TX-ID to the user.
                        if (resp.error !== 'null') {
                            M.toast({ html: '<span class="toast__bold-font">Success &nbsp;</span> your bet has been placed: ' + resp.result, classes: 'green' })
                        }

                        // If bet was unsuccessful then show error to the user.
                        else {
                            M.toast({ html: '<span class="toast__bold-font">Error &nbsp;</span> ' + resp.result, classes: 'wagerr-red-bg' })
                        }

                        //this.listChainGamesEvents();
                    })
                    .catch(function (err) {
                        // TODO Parse the error from the response.
                        M.toast({html: err, classes: 'wagerr-red-bg'})
                        console.error(err)
                    })
            }
        },

    }

</script>

<style lang="scss" scoped>

    @import "../../assets/scss/_variables.scss";

    .bet-list{
        padding: 4px 14px 4px 14px;
        background-color: #414141;
    }

    .bet-details{
        padding: 2% 4% 2% 4%;

    }

    .bet-text-field {
        font-weight: bold;
    }

    .bet-list .card{
        background-color: $light_grey;
    }

    .bet-slip-options {
        text-align: center;
        padding: 10px;
    }

    .bet-slip-options button{
        background-color: $wagerr_red;
        bottom: 5px;
    }

    .empty-slip-message{
        padding: 10px;
        color: white;
    }

    .bet-details{
        color:white
    }

</style>
