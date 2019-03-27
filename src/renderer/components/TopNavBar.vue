<!-- Main Wagerr Wallet Nav Bar -->
<template>

    <header class="z-depth-2">

        <div class="wagerr-logo"></div>

        <ul class="top-nav">

            <router-link tag="li" to="/" exact>

                <i class="icon-home"></i>

            </router-link>

            <router-link tag="li" to="/bets">

                <i class="icon-wallet"></i>

            </router-link>

            <router-link tag="li" to="/betting">

                <i class="icon-dice"></i>

            </router-link>

            <router-link tag="li" to="/tools">

                <i class="icon-wrench"></i>

            </router-link>

            <li>

                <!-- Dropdown Trigger -->
                <div class="icon-cog dropdown-trigger" data-target="settings-dropdown">

                    <i class=""></i>

                </div>

                <!-- Dropdown Structure -->
                <ul id="settings-dropdown" class="dropdown-content">


                    <li v-if="walletUnlocked">

                        <a @click="lockWallet">

                            <i class="icon-lock"></i>

                            Lock Wallet

                        </a>

                    </li>

                    <li v-else>

                        <a class="modal-trigger" data-target="unlock-wallet-modal">

                            <i class="icon-unlock"></i>

                            Unlock Wallet

                        </a>

                    </li>

                    <li>

                        <a class="modal-trigger" data-target="encrypt-wallet">

                            <i class="icon-file-lock"></i>

                            Encrypt Wallet

                        </a>

                    </li>

                    <li>

                        <a class="modal-trigger" data-target="change-wallet-password">

                            <i class="icon-user-lock"></i>

                            Change Password

                        </a>

                    </li>

                    <!--<li>

                        <a class="modal-trigger" data-target="">

                            <i class="icon-network-lock"></i>

                            Bip32 Tool

                        </a>

                    </li>

                    <li>

                        <a class="modal-trigger" data-target="">

                            <i class="icon-paper-plane"></i>

                            Multi Send

                        </a>

                    </li>-->

                    <li>

                        <a class="modal-trigger" data-target="sign-verify-message">

                            <i class="icon-pencil"></i>

                            Sign Message

                        </a>

                    </li>

                    <li>

                        <a class="modal-trigger" data-target="sign-verify-message">

                            <i class="icon-check"></i>

                            Verify Message

                        </a>

                    </li>

                    <li>

                        <a @click="backupWallet">

                            <i class="icon-files"></i>

                            Backup Wallet

                        </a>

                    </li>

                </ul>

            </li>

            <!-- Settings Modals -->
            <encrypt-wallet></encrypt-wallet>
            <change-password></change-password>
            <sign-verify-message></sign-verify-message>
            <unlock-wallet></unlock-wallet>

        </ul>

        <div class="pull-right wagerr-balance">

            <span id="wagerr-total-balance">{{ walletLoaded ? balance : 'Loading...' }} {{ getNetworkType === "Testnet" ? 'tWGR' : 'WGR' }}</span>

        </div>

    </header>

</template>

<script>

    import Vuex from 'vuex'
    import wagerrRPC from '@/services/api/wagerrRPC'
    import EncryptWallet from '@/components/modals/EncryptWallet.vue'
    import ChangePassword from '@/components/modals/ChangePassword.vue'
    import UnlockWallet from '@/components/modals/UnlockWallet'
    import SignVerifyMessage from '@/components/modals/SignVerifyMessage'

    const { remote } = require('electron');

    export default {
        name: 'TopNavBar',
        components: { EncryptWallet, ChangePassword, SignVerifyMessage, UnlockWallet },

        computed: {
            ...Vuex.mapGetters([
                'balance',
                'walletLoaded',
                'walletUnlocked',
                'getNetworkType'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'lockWallet',
            ]),

            backupWallet: function () {

                let folderPath = remote.dialog.showOpenDialog({
                    title : "Backup Wallet.dat file.",
                    buttonLabel : "Select Folder",
                    properties: ['openDirectory'],
                    buttons: ['Confirm', 'Cancel'],
                    cancelId: 1,
                    defaultId: 0
                });

                console.log();

                if( folderPath ) {
                    wagerrRPC.client.backupWallet(folderPath)
                        .then(function (resp) {
                            console.log(resp)
                            M.toast({ html: '<span class="toast__bold-font">Success &nbsp;</span> Wallet backup up located here: ' + folderPath, classes: 'green' });
                        })
                        .catch(function (err) {
                            M.toast({html: err, classes: 'wagerr-red-bg'});
                            console.log(err);
                        })
                }
            }
        },

        mounted () {
            // Initialise the Material JS so modals, drop down menus etc function.
            M.AutoInit();
        },
    }

</script>

<style lang="scss" scoped>

    @import "../assets/scss/_variables.scss";

    .top-nav > .router-link-active{
        background-color: $wagerr_red;
    }

    .wagerr-balance{
        color: $wagerr_red;
    }

    span {
        font-weight: bold;
        font-size: 1.25rem;
    }

    .dropdown-trigger{
        margin-top: 3px;
    }

    .dropdown-content{
        width: max-content !important;
        height:auto !important;
    }

    #settings-dropdown li{
        padding: 0px;
    }

    header {
        color:#fff;
        width:100%;
        background-color: $dark_grey;
        position:fixed;
        top:0px;
        left:0px;
        z-index:999;
    }

    header .wagerr-logo {
        height:29px;
        background:url(../assets/images/wagerr-logo.png) center no-repeat;
        float:left;
        margin:18px 0 0 0;
        width:165px;
    }

    header .wagerr-balance {
        margin:22px 22px 0 0;
        font-size:12px;
    }

    header .wagerr-balance i {
        margin-left:10px;
        cursor:pointer;
        font-weight:bold;
    }

    header ul {
        margin:0px;
        padding:0px;
    }

    header ul li {
        display:block;
        float:left;
        list-style:none;
        font-size:28px;
        padding:15px 20px 10px 20px;
        cursor:pointer;
    }

    header ul li i::before, header ul li i {
        cursor:pointer;
    }

    header ul li .title {
        display:block;
        text-align:center;
        text-transform:uppercase;
        color:#fff;
        font-size:12px;
        padding-top:5px;
    }

</style>
