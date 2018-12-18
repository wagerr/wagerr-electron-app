<!-- Main Wagerr Wallet Nav Bar -->
<template>

    <header>

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

                </ul>

            </li>

            <!-- Settings Modals -->
            <encrypt-wallet></encrypt-wallet>
            <change-password></change-password>
            <sign-verify-message></sign-verify-message>
            <unlock-wallet></unlock-wallet>

        </ul>

        <div class="pull-right wagerr-balance">

            <span id="wagerr-total-balance">{{walletLoaded ? balance : 'Loading...'}} WGR </span>

        </div>

    </header>

</template>

<script>

    import Vuex from 'vuex'
    import EncryptWallet from '@/components/modals/EncryptWallet.vue'
    import ChangePassword from '@/components/modals/ChangePassword.vue'
    import UnlockWallet from '@/components/modals/UnlockWallet'
    import SignVerifyMessage from '@/components/modals/SignVerifyMessage'

    export default {
        name: 'TopNavBar',
        components: { EncryptWallet, ChangePassword, SignVerifyMessage, UnlockWallet },

        computed: {
            ...Vuex.mapGetters([
                'balance',
                'walletLoaded',
                'walletUnlocked'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'lockWallet',
            ])
        }
    }

</script>

<style lang="scss" scoped>

    @import "../assets/scss/_variables.scss";
    @import "../assets/scss/_fonts.scss";

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

    .arrow-down {
        position: absolute;
        top: 30px;
        left: 490px;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid white;
    }

</style>
