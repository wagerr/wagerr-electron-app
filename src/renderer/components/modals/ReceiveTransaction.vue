<template>

    <!-- Receive Transaction Modal -->

    <div id="receive-tx-modal" class="modal">

        <form>

            <div class="modal-content">

                <div class="row">

                    <div class="modal-header">

                        <h4>Request Payment</h4>

                    </div>

                    <div class="modal-text">

                        <div class="text-center">

                            <qrcode-vue :value="accountAddress" :size="185" background="#FFFFFF" foreground="#000000" level="H"></qrcode-vue>

                        </div>

                    </div>

                    <div class="input-field col s12 text-center">

                        <h6 class="wagerr-red">WAGERR RECEIVE ADDRESS:</h6>

                        <h5>{{ accountAddress }}</h5>

                    </div>

                </div>

            </div>

            <div class="modal-footer">

                <!--<button class="waves-effect waves-light btn green pull-left">Save QR Image</button>-->

                <a href="#!" class="modal-close waves-effect waves-light btn wagerr-red-bg">Close</a>

                <a v-clipboard="accountAddress" @click="copiedAlert()" class="waves-effect waves-light btn green">Copy Address</a>

            </div>

        </form>

    </div>

</template>

<script>

    import Vuex from 'vuex'
    import QrcodeVue from 'qrcode.vue';

    export default {
        name: 'RecieveTransaction',

        computed: {
            ...Vuex.mapGetters([
                'accountAddress',
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'getAccountAddress'
            ]),

            copiedAlert: function () {
                M.toast({ html: '<span class="toast__bold-font">Success &nbsp;</span> Address copied to your clipboard.', classes: 'green' });
             }
        },

        mounted () {
            // Initialise the Material JS so modals, drop down menus etc function.
            M.AutoInit();

            this.getAccountAddress();
         },

        components: {
            QrcodeVue
        }
    }

</script>

<style lang="scss" scoped>

    .modal{
        overflow-y: inherit;
    }

    .modal-text{
        padding-top: 10px;
    }


</style>
