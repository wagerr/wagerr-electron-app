<template>

    <div class="splash">

        <div class="row text-center">

            <div class="col s12 splash-image">

                <img src="../../assets/images/wagerr_logo_red.png"/>

            </div>

            <div class="col s12">

                <h1>

                    <span class="wagerr-white">WAGER</span><span class="wagerr-red">R</span>

                </h1>

            </div>

            <div class="col s12">

                <transition name="slide-fade" mode="out-in">

                    <div :key="initText">

                        <h5>{{ initText }}</h5>

                    </div>

                </transition>

            </div>

            <div class="col s12 splash-loading-container">

                <div class="slider">

                    <div class="line"></div>
                    <div class="break dot1"></div>
                    <div class="break dot2"></div>
                    <div class="break dot3"></div>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import Vuex from 'vuex';
    import moment from 'moment';
    import blockchainRPC from '@/services/api/blockchain_rpc';
    import networkRPC from '@/services/api/network_rpc';
    import masternodeRPC from '@/services/api/masternode_rpc';

    export default {
        name: "SplashScreen",

        computed: {
            ...Vuex.mapGetters([
                'balance',
                'initText',
                'walletLoaded',
                'walletSynced',
                'walletUnlocked',
            ]),
        },

        methods: {
            ...Vuex.mapActions([
                'syncWallet',
                'updateBlocks',
                'walletBalance',
                'updateInitText',
                'updateNetworkType',
                'updateWalletLoaded',
                'updateWalletSynced',
                'updateNumMasternodes',
                'updateNumConnections',
                'getWGRTransactionList',
                'getPLBetTransactionList',
                'getCGBetTransactionList',
            ]),

            getTimeBehindText: function (secs, blockchainInfo) {
                const HOUR_IN_SECONDS = 60 * 60;
                const DAY_IN_SECONDS  = 24 * 60 * 60;
                const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
                const YEAR_IN_SECONDS = 31556952; // Average length of year in Gregorian calendar

                let timeBehindText;
                let years;
                let remainder;

                if (secs < 2 * DAY_IN_SECONDS) {
                    timeBehindText = Math.round(secs / HOUR_IN_SECONDS) + " hours behind, Scanning block " + blockchainInfo.blocks;
                }
                else if (secs < 2 * WEEK_IN_SECONDS) {
                    timeBehindText = Math.round(secs / DAY_IN_SECONDS) + " days behind, Scanning block " + blockchainInfo.blocks;
                }
                else if (secs < YEAR_IN_SECONDS) {
                    timeBehindText = Math.round(secs / WEEK_IN_SECONDS) + " weeks behind, Scanning block " + blockchainInfo.blocks;
                }
                else {
                    years          = secs / YEAR_IN_SECONDS;
                    remainder      = secs % YEAR_IN_SECONDS;
                    timeBehindText = years + " " + remainder;
                }

                return timeBehindText;
            }
        },

        created () {
            // Wait a few secs before init wallet.
            setTimeout(function () {
                initWallet();
            }, 3000);

            const initWallet = async () => {

                // Check for peers to ensure we are connected to the network.
                this.updateInitText('Connecting to peers...');
                let peerInfo = await networkRPC.getPeerInfo();

                if (peerInfo.length === 0) {
                     this.updateInitText('No peers found, rechecking...');
                     console.log('peer count: ' + peerInfo.length);
                     return setTimeout(initWallet, 2000)
                }

                // Check the status of the blockchain to see if we need to sync to tip.
                this.updateInitText('Syncing Blockchain...');
                let blockchainInfo = await blockchainRPC.getBlockchainInfo();
                let bestBlockHash  = blockchainInfo.bestblockhash;
                let blockInfo      = await blockchainRPC.getBlockInfo(bestBlockHash);
                const secs         = moment().diff(blockInfo.time * 1000, 'seconds');

                let timeBehindText = this.getTimeBehindText(secs, blockchainInfo);
                this.updateInitText(timeBehindText);

                if (secs > 0) {
                    return setTimeout(initWallet, 2000);
                }

                // Check the wallet is MN synced.
                this.updateInitText('Syncing...');

                if (this.walletSynced) {
                    this.updateWalletSynced();
                    return setTimeout(initWallet, 2000);
                }

                // Set some wallet state values.
                this.walletBalance()
                setInterval(function () {
                    this.walletBalance();
                }.bind(this), 1000);


                await this.getWGRTransactionList(100);
                await this.getPLBetTransactionList();
                await this.getCGBetTransactionList();

                // Set some network state values.
                let networkInfo = await networkRPC.getNetworkInfo();
                let masternodeInfo = await masternodeRPC.getMasternodeCount();
                this.updateNetworkType(blockchainInfo.chain);
                this.updateNumConnections(networkInfo.connections);
                this.updateNumMasternodes(masternodeInfo.total);
                this.updateBlocks(blockchainInfo.blocks);

                // Set wallet loaded.
                this.updateInitText('Wallet Loaded!');
                this.updateWalletLoaded(true);
            }
        },

        data () {
            return {
                isLock: true,
                isStaking: false,
                isLoading: true,
                noConnections: true,
            }
        },

    }

</script>

<style scoped lang="scss">

    /* Preloader Styles */

    @import "../../assets/scss/_variables.scss";
    @import "../../assets/scss/_fonts.scss";

    .splash{
        padding-top: 10%;
        margin: auto;
        width: 50%;
        color: white;
        background-color: $dark_grey;
        font-family: 'Raleway', cursive;
    }

    .splash-loading-container{
        margin-top: 30px;
    }

    .row{
        margin: auto;  /* Magic! */
    }

    h1{
        color:$wagerr_red;
        font-weight:100;
        font-stretch:normal;
        font-size:4em;
    }

    .slider{
        width: 100%;
        height:4px;
        margin-top:-30px
    }

    .line{
        position:absolute;
        background:$wagerr_red;
        width: 100%;
        height:4px;
    }

    .break{
        position:absolute;
        background:#222;
        width:6px;
        height:4px;
    }

    .dot1{ -webkit-animation: loading 4s infinite; animation: loading 4s infinite;}
    .dot2{ -webkit-animation: loading 4s 0.5s infinite; animation: loading 4s 0.5s infinite; }
    .dot3{ -webkit-animation: loading 4s 1s infinite; animation: loading 4s 1s infinite; }

    @-webkit-keyframes loading {
        from { left: 0; }
        to { left: 100%; }
    }

    @keyframes loading {
        from { left: 0; }
        to { left: 100%; }
    }

</style>