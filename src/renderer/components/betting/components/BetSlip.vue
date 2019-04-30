<template>

    <div id="betting-slip">

        <h4 v-if="betSlip.length > 0">Bet slip<button class="btn pull-right waves-effect waves-light" @click="clearBetSlip">Clear Slip</button></h4>
        <h4 v-else>Bet slip</h4>

		<div class="bet-list-scroll">
        <div class="bet-list" v-if="betSlip.length > 0">

            <ul>

                <li v-for="( bet, index ) in betSlip" :key="bet.betId" class="card">

                    <div class="bet-details">

                        <div class="bet-slip-pair">{{ bet.eventDetails.teams.home }} vs {{ bet.eventDetails.teams.away }}</div>

                        <a class="clear-bet pull-right" @click="removeBetFromSlip( bet.betId )">

                            <i>&times;</i>

                        </a>

                        <div class="clearfix"></div>

                        <div class="selection">
							<h6>Your Pick:</h6>
                            <span class="winner">{{ bet.winner }}</span>

                            <span class="odds pull-right">{{ bet.odds / 10000 }}</span>

                        </div>

                        <div class="input-field bet-stake-container">
							<div class="stake-input">
								<!--<label :for="bet.betId">Enter Bet Stake</label>-->
								<input :id="bet.betId" class="bet-stake validate" name="Bet Id" type="text" maxlength="10" v-on:input="calcPotentialWinnings( $event, bet.odds, index)" placeholder="Enter Bet Stake">
								<span class="helper-text" data-error="Invalid Stake" data-success=""></span>
							</div>
							<div class="stake-button">
                            	<button class="pull-right btn" @click="placeBet( bet.betId )">Bet</button>

                            </div>

                        </div>

                        <div class="bet-returns">

                            <span class="pull-left potential-returns-headline">Winnings:</span>

                            <span :id="index" class="potential-returns pull-right">0 {{ getNetworkType === "Testnet"? 'tWGR' : 'WGR' }}</span>

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
                'getNumBets',
                'getNetworkType'
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

                odds = odds / 10000;
                let betFeePercent = 0.06;
                let betStake = event.target.value;
                let grossWinnings = odds * betStake;
                let grossProfit = grossWinnings - betStake;
                let betFee = grossProfit * betFeePercent;
                let netWinnings = grossWinnings - betFee;

                // Set the potential winnings on the UI.
                document.getElementById(index).innerText = netWinnings.toFixed(8) + (this.getNetworkType === "Testnet"? ' tWGR' : ' WGR');
            },

            // Place a bet on a given event and sent the tx to the Wagerr blockchain.
            placeBet: function (betId) {
                let betInfo   = this.betSlip.find(item => item.betId === betId);
                let betAmount = parseFloat(document.getElementById(betId).value);
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
            },

            handleScroll (event) {
                // Get the bet slip.
                let navbar = document.getElementById("betting-slip");

                // Get the offset position of the navbar.
                let sticky = navbar.offsetTop;

                if (window.pageYOffset >= sticky) {
                    navbar.classList.add("sticky");
                }
                else {
                    navbar.classList.remove("sticky");
                }
            }

        },

        created () {
            window.addEventListener('scroll', this.handleScroll);
        },

        destroyed () {
            window.removeEventListener('scroll', this.handleScroll);
        }

    }

</script>
