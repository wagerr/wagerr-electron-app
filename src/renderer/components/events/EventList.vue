<template>

    <div id="events">

        <h5>Events</h5>

        <ul class="events-list">

            <li v-for="( event ) in eventsList" :key="event['event-id']" class="card" >

                <div class="event-details">

                    <div class="col s6">

                        <span>{{ Number(event.starting) | moment('timezone', getTimezone, 'LLLL') }}</span>

                    </div>

                    <div class="options col s6 text-center">

                        <div>Home</div>

                        <div>Draw</div>

                        <div>Away</div>

                    </div>

                </div>

                <div class="event-pair row">

                    <div class="col s12 m6 team-font">

                        <span>{{ event.teams[0].name }}</span> <br>

                        <span>{{ event.teams[1].name }}</span>

                    </div>

                    <div class="col s12 m6 odds">

                        <button class="waves-effect waves-light btn" @click="createBet(event['event-id'], 1, event.teams[0].name, event.teams[0].odds)">{{ event.teams[0].odds / 10000 }}</button>

                        <button class="waves-effect waves-light btn" @click="createBet(event['event-id'], 2, event.teams[2].name, event.teams[2].odds)">{{ event.teams[2].odds / 10000 }}</button>

                        <button class="waves-effect waves-light btn" @click="createBet(event['event-id'], 3, event.teams[1].name, event.teams[1].odds)">{{ event.teams[1].odds / 10000 }}</button>

                    </div>

                </div>

            </li>

        </ul>

    </div>

</template>

<script>

    import Vuex from 'vuex'
    import moment from 'moment'

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

            isValidEvent: function (event) {

            },

            moment: function () {
                return moment()
            },

            createBetId: function () {
                return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            },

            createBet: function (eventId, outcome, winner, odds) {
                var eventDetails = this.eventsList.find(item => item['event-id'] === eventId)
                var betId = this.createBetId()

                var betData = {
                    'betId': betId,
                    'outcome': outcome,
                    'winner': winner,
                    'odds': odds,
                    'eventDetails': eventDetails
                };

                this.addBetToSlip(betData)
            }
        },

        created () {
            this.listEvents()
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
        margin-left: 1%;
    }

    .card .row{
        margin-bottom: 0px;
    }

    .event-pair .odds{
        margin-top: .5%;
    }

    .event-pair .odds button{
        width: 30%;
        margin-right: 2%;
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

</style>
