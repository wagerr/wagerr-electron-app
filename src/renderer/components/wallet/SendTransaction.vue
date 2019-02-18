<template>

    <!-- Send Transaction Modal -->

    <div id="send-tx-modal" class="modal bg-gradient">

        <form @submit.prevent="handleSubmit">

            <div class="modal-content">

                <div class="row">

                    <div class="inset-top">

                        <div class="shadow"></div>

                    </div>

                    <div class="modal-text text-center">

                        <p class="modal-font">Enter the address and amount to send WGR.</p>

                    </div>

                    <div class="input-field col s12">

                        <i class="far fa-address-card prefix"></i>

                        <input v-model="sendAddress" v-validate="'required'" id="send-address" name="send-address" type="text" autofocus>

                        <label for="send-address">Pay To</label>

                        <span v-if="errors.has('send-address')" class="form-error">{{ errors.first('send-address') }}</span>

                    </div>

                    <div class="input-field col s12">

                        <i class="fas fa-tags prefix"></i>

                        <input v-model="label" v-validate="" id="label" name="label" type="text">

                        <label for="label">Label</label>

                        <span v-if="errors.has('label')" class="form-error">{{ errors.first('label') }}</span>

                    </div>

                    <div class="input-field col s12">

                        <i class="fas fa-money-bill prefix"></i>

                        <input v-model="amount" v-validate="'required'" id="amount" name="amount" type="number">

                        <label for="amount">Amount</label>

                        <span v-if="errors.has('amount')" class="form-error">{{ errors.first('amount') }}</span>

                    </div>

                </div>

                <div class="options">

                    <button class="send btn waves-effect waves-light z-depth-2">Send</button>

                </div>

                <div class="clearfix"></div>

            </div>

        </form>

    </div>

</template>

<script>

import Vuex from 'vuex'
import wagerrRPC from '@/services/api/wagerrRPC'

export default {
    name: 'SendTransaction',

    computed: {
        ...Vuex.mapGetters([
            'accountAddress',
        ])
    },

    methods: {

        ...Vuex.mapActions([
            'getAccountAddress'
        ]),

        // Handle the send transaction form submit and ensure all inputs are valid.
        handleSubmit: function () {
            this.$validator.validate().then(valid => {
                if (!valid) {
                    return;
                }

                // If the form is valid then encrypt the wallet.
                this.sendTransaction();
            })
        },

        // Send a Wagerr transaction.
        sendTransaction: function () {
            let that = this;
            this.getAccountAddress();

            // Retrieve the wallet UTXOs (unspent outputs)
            wagerrRPC.client.listUnspent()
                .then(function (resp) {
                    let UTXOAmount = 0;
                    let utxos = [];

                    // Only use the UTXO we require to cover the tx amount.
                    for (var i = 0; i < resp.result.length; i++) {
                        UTXOAmount += resp.result[i].amount;
                        utxos.push(resp.result[i]);

                        if (UTXOAmount > that.amount) {
                            utxos = JSON.stringify(utxos);
                            break
                        }
                    }

                    // Ensure we have enough Wagerr to cover the TX.
                    if (UTXOAmount < that.amount) {
                        M.toast({ html: '<span class="toast__bold-font">Error &nbsp;</span> Not enough WGR to send transaction.', classes: 'wagerr-red-bg' });
                        return
                    }

                    let txFee = 0.0001
                    let json = '{"' + that.sendAddress + '":' + that.amount + ', "' + that.accountAddress + '":' + (UTXOAmount - txFee - that.amount) + '}';

                    // Create the raw send transaction.
                    wagerrRPC.client.createRawTransaction(utxos, json)
                        .then(function (resp) {
                            console.log('Created raw transaction ' + resp.result);
                            let rawTxHex = resp.result;

                            // Sign the raw transaction.
                            wagerrRPC.client.signRawTransaction(rawTxHex)
                                .then(function (resp) {
                                    console.log('Created signed transaction ' + resp.result.hex);
                                    let signedHex = resp.result.hex;

                                    // Send the signed tx to the Wagerr blockchain.
                                    wagerrRPC.client.sendRawTransaction(signedHex)
                                        .then(function (resp) {
                                            // Sent transaction succesfully.
                                            M.toast({ html: '<span class="toast__bold-font">Success &nbsp;</span> Transaction sent ' + resp.result, classes: 'green' });

                                            // Clear the sent TX form data and any errors.
                                            that.clearForm()
                                        })
                                        .catch(function (err) {
                                            M.toast({html: err, classes: 'wagerr-red-bg'});
                                            console.log(err);
                                        })
                                })
                                .catch(function (err) {
                                    M.toast({html: err, classes: 'wagerr-red-bg'});
                                    console.log(err);
                                })
                        })
                        .catch(function (err) {
                            M.toast({html: err, classes: 'wagerr-red-bg'});
                            console.log(err);
                        })
                })
                .catch(function (err) {
                    M.toast({html: err, classes: 'wagerr-red-bg'});
                    console.log(err);
                })
        },

        // Clear the form data and errors.
        clearForm: function () {
            this.sendAddress = '';
            this.amount = '';
            this.label = '';
            this.$validator.reset();
        }
    },

    data () {
        return {
            sendAddress: '',
            label: '',
            amount: '',
            showModal: false
        }
    },

    mounted () {
        // Initialise the Material JS so modals, drop down menus etc function.
        M.AutoInit();

        // Reset the form validation after opening the modal
        this.$validator.reset();
    },
}

</script>

<style lang="scss" scoped>

    @import '../../assets/scss/_variables';

    .modal{
        overflow-y: inherit;
    }

    .modal-content{
        padding: 0;
        padding-left: 20px;
        padding-right: 20px;
    }

    .modal-font{
        font-size: 1.3em;
        color: white;
    }

    .input-field span{
        margin-left: 45px;
    }

    .options{
        width: 150px;
        height: 40px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 20px;
    }

    .options button{
        width: 150px;
        background-color: $wagerr_red;
    }

    .options button:active{
        width: 150px;
    }

</style>