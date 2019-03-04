<template>

    <div id="chain-games" class="content">

        <div class="row cg-lotto-info card z-depth-2 bg-gradient">

            <div class="inset-top">

                <div class="shadow"></div>

            </div>

            <h2 class="">

                Lotto Jackpot

                <i class="far fa-question-circle pull-right modal-trigger" data-target="lotto-info"></i>

            </h2>

            <!-- Lotto Info Modal -->
            <CGLottoInfo></CGLottoInfo>

            <div v-if="loadingCGEvent" class="text-center">

                <spinner></spinner>

            </div>

            <div v-else class="cg-jackpot text-center">{{ potSize }}</div>

            <div>

                <div class="col s3 text-center stats">

                    <h5>Lotto ID</h5>

                    <div v-if="loadingCGEvent">

                        <spinner></spinner>

                    </div>

                    <div v-else class="cg-info">{{ gameID }}</div>

                </div>

                <div class="col s3 text-center  stats">

                    <h5>Entrants</h5>

                    <div v-if="loadingCGEvent">

                        <spinner></spinner>

                    </div>

                    <div v-else class="cg-info">{{ noOfEntrants }}</div>

                </div>

                <div class="col s3 text-center stats">

                    <h5>Block</h5>

                    <div v-if="loadingCGEvent">

                        <spinner></spinner>

                    </div>

                    <div v-else class="cg-info">{{ gameStartBlock }}</div>

                </div>

                <div class="col s3 text-center stats">

                    <h5>Entry</h5>

                    <div v-if="loadingCGEvent">

                        <spinner></spinner>

                    </div>

                    <div v-else class="cg-info">{{ entryFee }}</div>

                </div>

            </div>

            <div class="cg-dates text-center clearfix">

                {{ gameStartTime | moment("MMM Do YYYY, h:mm:ss a") }} - {{ gameEndTime | moment("MMM Do YYYY, h:mm:ss a")}}

            </div>

        </div>


        <div class="col s12 clearfix">

            <div class="bet-slip-options text-center clearfix">

                <button class="waves-effect waves-light btn-large wagerr-red-bg pulse" @click="placeCGLottoBet">Buy Ticket</button>

            </div>

        </div>


        <div class="table-container">

            <h5>CG Lotto Bet History</h5>

            <c-g-lotto-bet-transaction-list></c-g-lotto-bet-transaction-list>

        </div>

    </div>

</template>

<script>

    import Vuex from 'vuex';
    import wagerrRPC from '@/services/api/wagerrRPC';
    import Spinner from '@/components/utilities/LoadingSpinner';
    import CGLottoBetTransactionList from '@/components/betting/components/CGLottoBetTransactionList';
    import CGLottoInfo from '@/components/betting/components/CGLottoInfo';

    export default {
        name: 'CGLottoBets',
        components: { CGLottoBetTransactionList, CGLottoInfo, Spinner },

        computed: {
            ...Vuex.mapGetters([
                'loadingCGEvent',
                'loadingCGDetails',
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
            ]),

            // Place a bet on the given event and sent the tx to the Wagerr blockchain.
            placeCGLottoBet: function () {

                let entryFeeInt = parseInt(100);

                wagerrRPC.client.placeChainGamesBet(this.gameID, entryFeeInt)
                    .then(function (resp) {

                        // If bet was successful then display bet TX-ID to the user.
                        if (resp.error !== 'null') {
                            M.toast({ html: '<span class="toast__bold-font">Success &nbsp;</span> your bet has been placed: ' + resp.result, classes: 'green' });
                        }

                        // If bet was unsuccessful then show error to the user.
                        else {
                            M.toast({ html: '<span class="toast__bold-font">Error &nbsp;</span> ' + resp.result, classes: 'wagerr-red-bg' });
                        }
                    })
                    .catch(function (err) {
                        // TODO Parse the error from the response.
                        M.toast({html: err, classes: 'wagerr-red-bg'});
                        console.error(err);
                    })
            }
        },

        created() {
            this.listChainGamesEvents();

            this.timeout = setInterval(function () {
                this.listChainGamesEvents();
            }.bind(this), 3000);
        },

        data () {
            return {
                timeout: 0,
            }
        },

        destroyed () {
            clearTimeout(this.timeout);
        }

    }

</script>

<style lang="scss" scoped>

    @import "../../assets/scss/_variables.scss";

    .table-container{
        width: 100%;
        font-size: 14px;
    }

    .fa-question-circle{
        margin-top: -10px;
        margin-left: -40px;
        margin-right: 10px;
        font-size: 30px;
        color: $wagerr_red;
        cursor: pointer;
    }

    .cg-lotto-info{
        width: 60%;
        margin-left: auto;
        margin-right: auto;
        color: $wagerr_red;
    }

    .cg-lotto-info h2{
        margin: 0;
        text-align: center;
    }

    .cg-lotto-info div .stats:not(:last-child) {
        border-right: 1px solid red;
    }

    .wagerr-red-bg:active{
        background-color: $wagerr_red;
    }

    .cg-jackpot{
        color: white;
        font-size: 2.5em;
        margin: 10px;

    }

    .cg-info{
        color: white;
        font-size: 2.3em;
        height: 80px;
    }

    .cg-dates{
        padding: 10px;
        color: white;
        margin-left: 15px;
    }

    .bet-slip-options{

    }

</style>
