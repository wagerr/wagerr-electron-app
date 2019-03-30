<template>

    <div id="information">

        <div class="row text-center">

            <h4>Wallet Info</h4>

            <div class="col s4">

                <div class="bg-gradient card z-depth-2">

                    <h5>Version</h5>

                    <div class="number">{{ walletVersion }}</div>

                </div>

            </div>

            <div class="col s4">

                <div class="bg-gradient card z-depth-2">

                    <h5>Transactions</h5>

                    <div class="number">{{ getTxCount }}</div>

                </div>

            </div>

            <div class="col s4">

                <div class="bg-gradient card z-depth-2">

                    <h5>DataDir</h5>

                    <div class="datadir">{{ dataDir }}</div>

                </div>

            </div>

        </div>

        <div class="row text-center">

            <h4>Blockchain Info</h4>

            <div class="col s4">

                <div class="bg-gradient card z-depth-2">

                    <h5>Block Count</h5>

                    <div class="number">

                        {{ getBlocks }}

                        <i :class="[ getChainSyncStatus ? 'far fa-check-circle' : 'fas fa-sync-alt'] "></i>

                    </div>

                </div>

            </div>

            <div class="col s4">

                <div class="bg-gradient card z-depth-2">

                    <h5>Last Block</h5>

                    <div class="date">{{ this.lastBlockTime }}</div>

                </div>

            </div>

            <div class="col s4">

                <div class="bg-gradient card z-depth-2">

                    <h5>Money Supply</h5>

                    <div class="number">{{ Number((getMoneySupply).toFixed(2)) }}</div>

                </div>

            </div>

        </div>


        <div class="row text-center">

            <h4>Network Info</h4>

            <div class="col s4">

                <div class="bg-gradient card z-depth-2">

                    <h5>Network</h5>

                    <div class="words">{{ getNetworkType }}</div>

                </div>

            </div>

            <div class="col s4">

                <div class="bg-gradient card z-depth-2">

                    <h5>Peers</h5>

                    <div class="number">{{ getNumConnections }}</div>

                </div>

            </div>

            <div class="col s4">

                <div class="bg-gradient card z-depth-2">

                    <h5>Protocol Version</h5>

                    <div class="number">{{ getProtocolVersion }}</div>

                </div>

            </div>

        </div>

        <div class="row text-center">

            <h4>MasterNode Info</h4>

            <div class="col s4 text-center">

                <div class="bg-gradient card z-depth-2">

                    <h5>Masternodes</h5>

                    <div class="number">{{ getNumMasternodes }}</div>

                </div>

            </div>

            <div class="col s4 text-center">

                <div class="bg-gradient card z-depth-2">

                    <h5>Staking Status</h5>

                    <div class="words">

                        <i :class="[ getStakingStatus ? 'far fa-check-circle words' : 'fas fa-sync-alt words'] "></i>

                    </div>

                </div>

            </div>

            <div class="col s4 text-center">

                <div class="bg-gradient card z-depth-2">

                    <h5>MN Sync Status</h5>

                    <div class="words">

                        <i :class="[ getMsyncStatus ? 'far fa-check-circle' : 'fas fa-sync-alt'] "></i>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import Vuex from 'vuex';
    import moment from 'moment';

    export default {
        name: 'Information',

        computed: {
            ...Vuex.mapGetters([
                'dataDir',
                'getNetworkType',
                'getNetworkVersion',
                'getNumConnections',
                'getNumMasternodes',
                'getBlocks',
                'getMoneySupply',
                'getProtocolVersion',
                'getTxCount',
                'walletVersion',
                'getStakingStatus',
                'getMsyncStatus',
                'getChainSyncStatus'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'updateBlocks',
                'walletInfo',
                'updateInfo',
                'updateStakingStatus',
                'updateNumMasternodes',
                'updateChainSyncStatus'
            ]),
        },

        created () {
            this.blockCount = this.getBlocks;

            this.walletInfo();
            this.updateInfo();
            this.updateStakingStatus();
            this.updateNumMasternodes();
            this.updateChainSyncStatus();

            this.timeout = setInterval(function () {
                this.walletInfo();
                this.updateInfo();
                this.updateStakingStatus();
                this.updateNumMasternodes();
                this.updateChainSyncStatus();


                if (this.blockCount !== this.getBlocks) {
                    this.blockCount = this.getBlocks;
                    this.lastBlockTime = moment().format('MMM Do YYYY, h:mm:ss a');
                }

            }.bind(this), 3000);
        },

        data () {
            return {
                timeout: 0,
                blockCount: 0,
                lastBlockTime: moment().format('MMM Do YYYY, h:mm:ss a')
            }
        },

        destroyed () {
            clearInterval(this.timeout);
        }

    }
</script>

<style lang="scss" scoped>

    @import "../../assets/scss/_variables.scss";

    .s4 h5 {
        padding: 30px 30px 0px 30px;
        font-size: 2em;
        color: $wagerr_red;
    }

    .card div {
        height: 80px;
        color: $white;
        padding: 0px 30px 30px 30px;
        word-wrap: break-word;
    }

    .number{
        font-size: 2.5em;
    }

    .words{
        font-size: 2em;
    }

    .datadir{
        margin-top: 10px;
        font-size: 1.2em;
    }

    div .date{
        padding-top: 10px;
        font-size: 1.5em;
    }

    .fa-check-circle{
        color: $success-green;
        font-size: 30px;
        top: -3px;
        position: relative;
    }

    .fa-sync-alt{
        color: $wagerr_dark_red;
        font-size: 30px;
        top: -3px;
        position: relative;
    }

</style>
