<template>

    <div id="betting-slip">

        <h5>Bet slip</h5>

        <div class="bet-list" v-if="betSlip.length > 0">

            <div class="bet-slip-options">

                <button class="btn pull-right waves-effect waves-light" @click="clearBetSlip">Clear Slip</button>

                <div class="clearfix"></div>

            </div>

            <ul>

                <li v-for="( bet, index ) in betSlip" :key="bet.betId" class="card" >

                    <div class="bet-details">

                        <div class="bet-slip-pair">{{ bet.eventDetails.teams.home }} vs {{ bet.eventDetails.teams.away }}</div>

                        <a class="clear-bet pull-right" @click="removeBetFromSlip( bet.betId )">

                            <i class="icon-delete"></i>

                        </a>

                        <div class="clearfix"></div>

                        <div class="selection">

                            <span class="winner">{{ bet.winner }}</span>

                            <span class="odds pull-right">{{ bet.odds / 10000 }}</span>

                        </div>

                        <div class="input-field bet-stake-container">

                            <input :id="bet.betId" class="bet-stake validate" name="Bet Id" type="text" maxlength="10" v-on:input="calcPotentialWinnings( $event, bet.odds, index)">

                            <button class="pull-right btn-floating pulse waves-effect waves-light" @click="placeBet( bet.betId )">Bet</button>

                            <label :for="bet.betId">Bet Stake</label>

                            <span class="helper-text" data-error="Invalid Stake" data-success=""></span>

                        </div>

                        <div class="bet-returns">

                            <span class="pull-left">Potential returns:</span>

                            <span :id="index" class="potential-returns pull-right">0 WGR</span>

                            <div class="clear"></div>

                        </div>

                    </div>

                </li>

            </ul>

        </div>

        <div v-else class="bet-list">

            <div class="empty-slip-message">

                <p>Your bet slip is empty.</p>

                <p>Please make one or more selections in order to place bets.</p>

            </div>

        </div>

    </div>

</template>

<script>

    import Vuex from 'vuex'
    import wagerrRPC from '@/services/api/wagerrRPC'

    export default {
        name: 'BetSlip',

        computed: {
            ...Vuex.mapGetters([
                'betSlip',
                'getNumBets'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'addToBetSlip',
                'removeBetFromSlip',
                'clearBetSlip'
            ]),

            // Calculate the potential winnings of a bet.
            calcPotentialWinnings: function (event, odds, index) {

                let betStake = event.target.value;
                let winnings = odds * betStake;

                // Set the potential winnings on the UI.
                document.getElementById(index).innerText = ((winnings - ((winnings - betStake * 10000) * 60 / 1000)) / 10000) + ' WGR';
            },

            // Place a bet on a given event and sent the tx to the Wagerr blockchain.
            placeBet: function (betId) {
                let betInfo   = this.betSlip.find(item => item.betId === betId);
                let betAmount = parseInt(document.getElementById(betId).value);
                let evetnId   = parseInt(betInfo.eventDetails.event_id);
                let self = this;

                wagerrRPC.client.placeBet(evetnId, betInfo.outcome, betAmount)
                    .then(function (resp) {
                        // If bet was successful then display bet TX-ID to the user.
                        if (resp.error !== 'null') {
                             M.toast({ html: '<span class="toast__bold-font">Success &nbsp;</span> your bet has been placed: ' + resp.result, classes: 'green' });

                            self.removeBetFromSlip(betId);
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

        created () {
            //console.log(this.betSlip);
        }
    }

</script>

<style lang="scss" scoped>

    @import "../../assets/scss/_variables.scss";

    .bet-stake{
        color: white;
    }

    .bet-list{
        padding: 10px;
        margin-top: 15px;
        background-color: #414141;
    }

    .bet-details{
        padding: 2%;
    }

    .bet-list .card{
        background-color: $light_grey;
    }

    .bet-slip-options button{
        background-color: $wagerr_red;
    }

    .bet-slip-pair{
        width: 90%;
        float: left;
    }

    .bet-slip-pair{
        font-size: .8em;
        color: white;
    }

    .bet-returns span{
        font-size: .9em;
        color: white;
    }

    .selection{
        margin-top: 5px;
        font-size: 1em;
        color: white;
    }

    .bet-stake-container button{
        margin-top: 10px;
    }

    .bet-stake-container .bet-stake{
        width: 80%;
        font-size: 1.3em;
    }

    .bet-stake-container button{
        background-color: $wagerr_red;
    }

    .clear-bet .icon-delete{
        font-weight: bold;
        color: $wagerr_red;
        font-size: 20px;
    }

    .clear-bet > .icon-delete:hover{
        color: white;
        cursor: pointer;
    }

    .empty-slip-message{
        padding: 10px;
        color: white;
    }

</style>
