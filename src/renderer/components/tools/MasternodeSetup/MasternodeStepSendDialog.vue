<template>
  <!-- Send Transaction Modal -->
  <el-dialog
    :close-on-press-escape="false"
    :visible.sync="showDialog"
    :modalAppendToBody="false"
    effect="fade/zoom"
  >
    <div class="masternode-modal">
      <form @submit.prevent="handleSubmit">
        <el-row>
          <div class="modal-text text-center">
            <h4 class="modal-font">
              Step 1
              <br />Enter the address to send 25,000 WGR.
            </h4>
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
              v-validate
              id="label"
              name="label"
              type="text"
            />

            <label for="label">Label</label>

            <span v-if="errors.has('label')" class="form-error">{{
              errors.first('label')
            }}</span>
          </div>
        </el-row>
        <el-row slot="footer" class="button-container options">
          <button
            type="submit"
            class="send waves-effect waves-red wallet-action btn modal-trigger wagerr-red-bg z-depth-2"
          >
            Send
          </button>
          <a class="btn" @click="clearForm()">CLEAR</a>
          <a class="btn" @click="onSkip()">SKIP</a>
        </el-row>
      </form>
    </div>
  </el-dialog>
</template>

<script>
import Vuex from 'vuex';
import wagerrRPC from '@/services/api/wagerrRPC';

export default {
  name: 'MasternodeStepSendDialog',

  data() {
    return {
      sendAddress: '',
      label: '',
      amount: '25000',
      txFee: 0,
      showModal: false
    };
  },

  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...Vuex.mapGetters(['accountAddress']),

    showDialog: {
      get: function() {
        return this.isVisible;
      },

      set: function(newValue) {
        this.$emit('update:isVisible', newValue);
      }
    }
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
                    .then(function() {
                      that.onSkip();
                    })
                    .catch(function(err) {
                      M.toast({
                        html: err,
                        classes: 'wagerr-red-bg'
                      });
                      console.log(err);
                    });
                })
                .catch(function(err) {
                  M.toast({
                    html: err,
                    classes: 'wagerr-red-bg'
                  });
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
      this.amount = '25000';
      this.label = '';
      this.$validator.reset();
    },

    onSkip() {
      this.$emit('next');
    }
  },

  mounted() {
    // Reset the form validation after opening the modal
    this.$validator.reset();
  }
};
</script>
<style scoped lang="scss">
@import '../../../assets/scss/_variables.scss';
.masternode-modal {
  position: relative;
  width: 100%;
  display: flex;
  label {
    color: $wagerr-red !important;
  }
  input {
    color: $black !important;
  }
}
.button-container {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}
</style>
