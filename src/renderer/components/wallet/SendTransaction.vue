<template>
  <!-- Send Transaction Modal -->

  <div id="send-tx-modal" class="modal">
    <form @submit.prevent="handleSubmit">
      <div class="modal-content">
        <div class="row">
          <div class="modal-text text-center">
            <p class="modal-font">Enter the address and amount to send WGR.</p>
          </div>

          <div class="input-field col s12">
            <i class="far fa-address-card prefix"></i>

            <input
              v-model="sendAddress"
              v-validate="'required'"
              id="send-address"
              name="send-address"
              type="text"
              autofocus
            />

            <label for="send-address">Pay To</label>

            <span v-if="errors.has('send-address')" class="form-error">{{
              errors.first('send-address')
            }}</span>
          </div>

          <div class="input-field col s12">
            <i class="fas fa-tags prefix"></i>

            <input
              v-model="label"
              v-validate=""
              id="label"
              name="label"
              type="text"
            />

            <label for="label">Label</label>

            <span v-if="errors.has('label')" class="form-error">{{
              errors.first('label')
            }}</span>
          </div>

          <div class="input-field col s10">
            <i class="fas fa-money-bill prefix"></i>

            <input
              v-model="amount"
              v-validate="'required|decimal:8|min_value:0'"
              id="amount"
              name="amount"
              type="text"
            />

            <label for="amount">Amount</label>

            <div v-if="errors.has('amount')" class="form-error amount-margin">
              {{ errors.first('amount') }}
            </div>
          </div>

          <div class="input-field col s2">
            <input
              v-model="txFee"
              v-validate="'required|decimal:5|min_value:0'"
              id="fee"
              name="fee"
              type="text"
            />

            <label for="fee" class="active">TX Fee</label>

            <div v-if="errors.has('fee')" class="form-error">
              {{ errors.first('fee') }}
            </div>
          </div>
        </div>

        <div class="options">
          <button
            class="send waves-effect waves-red wallet-action btn-large modal-trigger wagerr-red-bg z-depth-2"
          >
            Send
          </button>
        </div>

        <div class="clearfix"></div>
      </div>
    </form>
  </div>
</template>

<script>
import Vuex from 'vuex';
import wagerrRPC from '@/services/api/wagerrRPC';

export default {
  name: 'SendTransaction',

  computed: {
    ...Vuex.mapGetters(['accountAddress'])
  },

  methods: {
    ...Vuex.mapActions(['getAccountAddress']),

    // Handle the send transaction form submit and ensure all inputs are valid.
    handleSubmit: function() {
      this.$validator.validate().then(valid => {
        if (!valid) {
          return;
        }

        // If the form is valid then encrypt the wallet.
        this.sendTransaction();
      });
    },

    // Send a Wagerr transaction.
    sendTransaction: function() {
      let that = this;
      this.getAccountAddress();

      // Retrieve the wallet UTXOs (unspent outputs)
      wagerrRPC.client
        .listUnspent()
        .then(function(resp) {
          let UTXOAmount = 0;
          let utxos = [];

          // Only use the UTXO we require to cover the tx amount.
          for (var i = 0; i < resp.result.length; i++) {
            UTXOAmount += resp.result[i].amount;
            utxos.push(resp.result[i]);

            if (UTXOAmount > that.amount) {
              utxos = JSON.stringify(utxos);
              break;
            }
          }

          // Ensure we have enough Wagerr to cover the TX.
          if (UTXOAmount < that.amount) {
            M.toast({
              html:
                '<span class="toast__bold-font">Error &nbsp;</span> Not enough WGR to send transaction.',
              classes: 'wagerr-red-bg'
            });
            return;
          }

          let json =
            '{"' +
            that.sendAddress +
            '":' +
            that.amount +
            ', "' +
            that.accountAddress +
            '":' +
            (UTXOAmount - that.txFee - that.amount) +
            '}';

          // Create the raw send transaction.
          wagerrRPC.client
            .createRawTransaction(utxos, json)
            .then(function(resp) {
              let rawTxHex = resp.result;

              // Sign the raw transaction.
              wagerrRPC.client
                .signRawTransaction(rawTxHex)
                .then(function(resp) {
                  let signedHex = resp.result.hex;

                  // Send the signed tx to the Wagerr blockchain.
                  wagerrRPC.client
                    .sendRawTransaction(signedHex)
                    .then(function(resp) {
                      // Sent transaction succesfully.
                      M.toast({
                        html:
                          '<span class="toast__bold-font">Success &nbsp;</span> Transaction sent ' +
                          resp.result,
                        classes: 'green'
                      });

                      // Clear the sent TX form data and any errors.
                      that.clearForm();
                    })
                    .catch(function(err) {
                      M.toast({ html: err, classes: 'wagerr-red-bg' });
                      console.log(err);
                    });
                })
                .catch(function(err) {
                  M.toast({ html: err, classes: 'wagerr-red-bg' });
                  console.log(err);
                });
            })
            .catch(function(err) {
              M.toast({ html: err, classes: 'wagerr-red-bg' });
              console.log(err);
            });
        })
        .catch(function(err) {
          M.toast({ html: err, classes: 'wagerr-red-bg' });
          console.log(err);
        });
    },

    // Clear the form data and errors.
    clearForm: function() {
      this.sendAddress = '';
      this.amount = '';
      this.label = '';
      this.$validator.reset();
    }
  },

  data() {
    return {
      sendAddress: '',
      label: '',
      amount: '',
      txFee: 0.001,
      showModal: false
    };
  },

  mounted() {
    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit();

    // Reset the form validation after opening the modal
    this.$validator.reset();
  }
};
</script>
