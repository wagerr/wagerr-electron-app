<template>

    <div id="events">

        <h5>Events</h5>

        <div v-if="eventsList.length > 0">

            <ul class="events-list">

                <li v-for="( event ) in eventsList" :key="event.event_id" class="card">

                    <div class="event-details">

                        <div class="col s12 m4">

                            <div>{{ Number(event.starting) | moment('timezone', getTimezone, 'LLL') }}</div>

                        </div>

                        <div class="col s12 m2 text-center">

                            <div>Money Line</div>

                        </div>

                        <div class="col s12 m3 text-center">

                            <div>Spread</div>

                        </div>


                        <div class="col s12 m3 text-center">

                            <div>Total</div>

                        </div>

                    </div>

                    <div class="event-pair row">

                        <div class="col s12 m4 event-teams">

                            <div>{{ event.teams.home }}</div>

                            <div>{{ event.teams.away }}</div>

                            <div>Draw</div>

                        </div>

                        <!-- Show Money line odds if market is open for current event. -->
                        <div v-if="isEventMLOddsSet(event)" class="col s12 m2 odds">

                            <button v-if="event.odds[0].mlHome !== 0" class="waves-effect waves-light btn" @click="createBet(event.event_id, 1, event.teams.home, event.odds[0].mlHome)">

                                {{ event.odds[0].mlHome / oddsDivisor }}

                            </button>

                            <button v-else class="waves-effect waves-light btn" disabled>N/A</button>

                            <br>

                            <button v-if="event.odds[0].mlAway !== 0" class="waves-effect waves-light btn" @click="createBet(event.event_id, 2, event.teams.away, event.odds[0].mlAway)">

                                {{ event.odds[0].mlAway / oddsDivisor }}

                            </button>

                            <button v-else class="waves-effect waves-light btn" disabled>N/A</button>

                            <br>

                            <button v-if="event.odds[0].mlDraw !== 0" class="waves-effect waves-light btn" @click="createBet(event.event_id, 3, 'Draw', event.odds[0].mlDraw)">

                                {{ event.odds[0].mlDraw / oddsDivisor }}

                            </button>

                            <button v-else class="waves-effect waves-light btn" disabled>N/A</button>

                        </div>

                        <!-- Show money line market closed -->
                        <div v-else class="col s12 m2 odds">

                            <button class="waves-effect waves-light btn" disabled>N/A</button>

                            <br>

                            <button class="waves-effect waves-light btn" disabled>N/A</button>

                        </div>

                        <!-- Show Spread odds if market is open for current event. -->
                        <div v-if="isEventSpreadsOddsSet(event)" class="col s12 m3 odds">

                            <button class="waves-effect waves-light btn" @click="createBet(event.event_id, 4, event.teams.home, event.odds[1].spreadOver)">

                                <span class="pull-left">+ {{ event.odds[1].spreadPoints / 10 }}</span>

                                <span class="pull-right">{{ event.odds[1].spreadOver / oddsDivisor }}</span>

                            </button>

                            <br>

                            <button class="waves-effect waves-light btn" @click="createBet(event.event_id, 5, event.teams.away, event.odds[1].spreadUnder)">

                                <span class="pull-left">- {{ event.odds[1].spreadPoints / 10 }}</span>

                                <span class="pull-right">{{ event.odds[1].spreadUnder / oddsDivisor }}</span>

                            </button>

                        </div>

                        <!-- Show Spread market closed -->
                        <div v-else class="col s12 m3 odds">

                            <button class="waves-effect waves-light btn" disabled>N/A</button>

                            <br>

                            <button class="waves-effect waves-light btn" disabled>N/A</button>

                        </div>

                        <!-- Show Totals odds if market is open for current event. -->
                        <div v-if="isEventTotalsOddsSet(event)" class="col s12 m3 odds">

                            <button class="waves-effect waves-light btn" @click="createBet(event.event_id, 6, event.teams.home, event.odds[2].totalsOver)">

                                <span class="pull-left">+ {{ event.odds[2].totalsPoints / 10}}</span>

                                <span class="pull-right">{{ event.odds[2].totalsOver / oddsDivisor }}</span>

                            </button>

                            <br>

                            <button class="waves-effect waves-light btn" @click="createBet(event.event_id, 7, event.teams.home, event.odds[2].totalsUnder)">

                                <span class="pull-left">- {{ event.odds[2].totalsPoints / 10 }}</span>

                                <span class="pull-right">{{ event.odds[2].totalsUnder / oddsDivisor }}</span>

                            </button>

                        </div>

                        <!-- Show Totals market closed -->
                        <div v-else class="col s12 m3 odds">

                            <button class="waves-effect waves-light btn" disabled>N/A</button>

                            <br>

                            <button class="waves-effect waves-light btn" disabled>N/A</button>

                        </div>

                    </div>

                </li>

            </ul>

        </div>

        <div v-else class="text-center no-events">

            <p>No events available for betting!</p>

            <i class="far fa-calendar-times"></i>

        </div>

    </div>

</template>

<script>

    import Vuex from 'vuex';
    import moment from 'moment';
    import constants from '../../../main/constants/constants';

    export default {
        name: 'EventList',

        computed: {
            ...Vuex.mapGetters([
                'eventsList',
                'getTimezone'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'listEvents',
                'addBetToSlip',
                'clearBetSlip'
            ]),

            moment: function () {
                return moment();
            },

            // Create a unique bet ID.
            createBetId: function () {
                return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            },

            // Creates bet data and adds to the betslip.
            createBet: function (eventId, outcome, winner, odds) {
                let eventDetails = this.eventsList.find(item => item.event_id === eventId);
                let betId        = this.createBetId();

                let betData = {
                    'betId': betId,
                    'outcome': outcome,
                    'winner': winner,
                    'odds': odds,
                    'eventDetails': eventDetails
                };

                this.addBetToSlip(betData);
            },

            // Check if money line odds are available for a given event.
            isEventMLOddsSet: function (event) {
                return !(event.odds[0].mlHome === 0 && event.odds[0].mlAway === 0 && event.odds[0].mlDraw === 0);
            },

            // Check if spreads odds are available for a given event.
            isEventSpreadsOddsSet: function (event) {
                return !(event.odds[1].spreadOver === 0 && event.odds[1].spreadUnder === 0);
            },

            // Check if the totals odds are available for a given event.
            isEventTotalsOddsSet: function (event) {
                return !(event.odds[2].totalsOver === 0 && event.odds[2].totalsUnder === 0);
            },

            isPulledEvent: function (event) {
                let mlOddsSet     = this.isEventMLOddsSet();
                let spreadOddsSet = this.isEventSpreadsOddsSet();
                let totalsOdds    = this.isEventTotalsOddsSet();

                return mlOddsSet && spreadOddsSet && totalsOdds;
            }
        },

        data () {
            return {
                oddsDivisor: constants.ODDS_DIVISOR,
                filteredEventsList: {}
            }
        },

        created () {
            this.listEvents();
        }
    }

</script>

<style lang="scss" scoped>

    @import "../../assets/scss/_variables.scss";

    .events-list li{
        border: 1px solid #414141;
    }

    .options div{
        width: 33.3%;
        float: left;
    }

    .event-details div{
        font-size: 12px;
        color: white;
        padding: 0px 5px 0px 5px;
        background-color: #414141;
    }

    .event-details span{
        margin-right: 5%;
    }

    .event-pair{
        margin-left: 0%;
    }

    .card .row{
        margin-bottom: 0px;
    }

    .event-teams{
        margin-top: 10px;
    }

    .event-teams span{
        font-size: 1.1em;
        padding-top: 40px;
    }

    .event-pair .odds{
        margin-top: 1%;
        margin-bottom: 1%;
    }

    .event-pair .odds button{
        width: 100%;
    }

    .event-pair .odds .btn{
        color: #FD2626;
        background-color: #414141;
    }

    .event-pair .odds .btn:visited{
        background-color: #414141;
    }

    .event-pair .odds .btn:hover {
        background-color: #757575;
    }

    .event-pair .odds .btn:active{
        background-color: #757575;
    }

    .event-pair .odds .btn:focus{
        background-color: #414141;
    }

    .odds{
        margin-right: -.5%;
    }

    .odds button{
        width: 100%;
        margin-bottom: 2px;
        font-size: .9em;
    }

    .event-teams div{
        font-size: 1.1em;
        margin-top: 12px;
    }

    .no-events p{
        font-size: 1.5em;
    }

    .fa-calendar-times{
        font-size: 150px;
        color: $wagerr_dark_red;
        margin-bottom: 29%;
    }

</style>
