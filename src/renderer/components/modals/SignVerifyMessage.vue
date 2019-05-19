<template>
  <!-- Sign / Verify Messages Modal -->

  <div id="sign-verify-message" class="modal bg-gradient">
    <div class="inset-top">
      <div class="shadow"></div>
    </div>

    <div class="modal-content">
      <div class="row">
        <ul class="tabs">
          <li class="tab col s6 m6 l6 active">
            <a class="active" href="#sign-message-form">Sign Message</a>
          </li>

          <li class="tab col s6 m6 l6 ">
            <a href="#verify-message-form">Verify Message</a>
          </li>
        </ul>

        <div id="sign-message-form" class="sign-message">
          <div class="modal-text">
            <p class="modal-font">
              You can sign messages with your addresses to prove you own them.
              Be careful not to sign anything vague, as phishing attacks may try
              to trick you into signing your identity over to them. Only sign
              fully-detailed statements you agreed to.
            </p>
          </div>

          <form @submit.prevent="handleSignSubmit()" data-vv-scope="sign-form">
            <div class="input-field col s12">
              <i class="far fa-address-card prefix"></i>

              <input
                v-model="signAddress"
                v-validate="'required|min:20'"
                id="sign-address"
                name="sign-address"
                type="text"
              />

              <label for="sign-address">WGR Address</label>

              <span
                v-if="errors.has('sign-form.sign-address')"
                class="form-error"
                >{{ errors.first('sign-form.sign-address') }}</span
              >
            </div>

            <div class="input-field col s12">
              <i class="far fa-envelope prefix"></i>

              <input
                v-model="signMessage"
                v-validate="'required'"
                id="sign-message"
                name="sign-message"
                type="text"
              />

              <label for="sign-message">Message</label>

              <span
                v-if="errors.has('sign-form.sign-message')"
                class="form-error"
                >{{ errors.first('sign-form.sign-message') }}</span
              >
            </div>

            <div class="input-field col s11">
              <i class="fas fa-file-contract prefix"></i>

              <input
                v-model="signedSignature"
                id="signed-signature"
                name="signed-signature"
                type="text"
              />

              <label for="signed-signature" class="active">Signature</label>
            </div>

            <div class="col s1">
              <a
                class="btn waves-effect waves-light sign-message__copy wagerr-red-bg"
                @click="copiedAlert()"
                v-clipboard="signedSignature"
              >
                <i class="icon-copy"></i>
              </a>
            </div>

            <div class="options">
              <a
                @click="clearForms()"
                class="modal-close waves-effect waves-light btn wagerr-red-bg"
                >CANCEL</a
              >

              <button type="submit" class="waves-effect waves-light btn green">
                SIGN MESSAGE
              </button>
            </div>
          </form>
        </div>

        <div id="verify-message-form" class="verify-message">
          <div class="modal-text">
            <p class="modal-font">
              Enter the signing address, message (ensure you copy line breaks,
              spaces, tabs, etc. exactly) and signature below to verify the
              message. Be careful not to read more into the signature than what
              is in the signed message itself, to avoid being tricked by a
              man-in-the-middle attack.
            </p>
          </div>

          <form
            @submit.prevent="handleVerifySubmit"
            data-vv-scope="verify-form"
          >
            <div class="input-field col s12">
              <i class="far fa-address-card prefix"></i>

              <input
                v-model="verifyAddress"
                v-validate="'required|min:20'"
                id="verify-address"
                name="verify-address"
                type="text"
              />

              <label for="verify-address">WGR Address</label>

              <span
                v-if="errors.has('verify-form.verify-address')"
                class="form-error"
                >{{ errors.first('verify-form.verify-address') }}</span
              >
            </div>

            <div class="input-field col s12">
              <i class="far fa-envelope prefix"></i>

              <input
                v-model="verifyMessage"
                v-validate="'required'"
                id="verify-message"
                name="verify-message"
                type="text"
              />

              <label for="verify-message">Message</label>

              <span
                v-if="errors.has('verify-form.verify-message')"
                class="form-error"
                >{{ errors.first('verify-form.verify-message') }}</span
              >
            </div>

            <div class="input-field col s12">
              <i class="fas fa-file-contract prefix"></i>

              <input
                v-model="verifiedSignature"
                v-validate="'required|min:20'"
                id="verified-signature"
                name="verified-signature"
                type="text"
              />

              <label for="verified-signature" class="active">Signature</label>

              <span
                v-if="errors.has('verify-form.verified-signature')"
                class="form-error"
                >{{ errors.first('verify-form.verified-signature') }}</span
              >
            </div>

            <div class="options-verify">
              <a
                @click="clearForms()"
                class="modal-close waves-effect waves-light btn wagerr-red-bg"
                >CANCEL</a
              >

              <button type="submit" class="waves-effect waves-light btn green">
                VERIFY MESSAGE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import wagerrRPC from '@/services/api/wagerrRPC';

export default {
  name: 'VerifyMessage',

  computed: {
    ...Vuex.mapGetters([])
  },

  methods: {
    // Handle the sign from validation and if all fields valid sign the message.
    handleSignSubmit: function() {
      this.$validator.validateAll('sign-form').then(valid => {
        if (!valid) {
          return;
        }

        // If from validation passes then sign the message.
        this.signTheMessage();
      });
    },

    // Handle the verify message form validation and if all fields valid then verify the signature.
    handleVerifySubmit: function(scope) {
      this.$validator.validateAll('verify-form').then(valid => {
        if (!valid) {
          return;
        }

        // If the form vailidation passes then verify the signature.
        this.verifyTheMessage();
      });
    },

    // Sign a message using wallet private key.
    signTheMessage: function() {
      let that = this;

      wagerrRPC.client
        .signMessage(this.signAddress, this.signMessage)
        .then(function(resp) {
          if (resp.error !== 'null') {
            that.signedSignature = resp.result;
            M.toast({
              html:
                '<span class="toast__bold-font">Success &nbsp;</span> Message signed.',
              classes: 'green'
            });
          } else {
            M.toast({
              html:
                '<span class="toast__bold-font">Error &nbsp;</span> ' +
                resp.error,
              classes: 'wagerr-red-bg'
            });
          }
        })
        .catch(function(err) {
          M.toast({ html: err, classes: 'wagerr-red-bg' });
          console.debug(err);
        });
    },

    // Verify a message using wallet public key.
    verifyTheMessage: function() {
      wagerrRPC.client
        .verifyMessage(
          this.verifyAddress,
          this.verifiedSignature,
          this.verifyMessage
        )
        .then(function(resp) {
          if (resp.result === true) {
            M.toast({
              html:
                '<span class="toast__bold-font">Success &nbsp;</span> Message Verified.',
              classes: 'green'
            });
          } else {
            M.toast({
              html:
                '<span class="toast__bold-font">Error &nbsp;</span> Message could not be verified.',
              classes: 'wagerr-red-bg'
            });
          }
        })
        .catch(function(err) {
          M.toast({ html: err, classes: 'wagerr-red-bg' });
          console.debug(err);
        });
    },

    // Clear the sign message from data and errors.
    clearForms() {
      this.signAddress = '';
      this.signMessage = '';
      this.signedSignature = '';
      this.verifyAddress = '';
      this.verifyMessage = '';
      this.verifiedSignature = '';
      this.$validator.reset();
    },

    copiedAlert() {
      M.toast({
        html:
          '<span class="toast__bold-font">Success &nbsp;</span> Signed signature copied to clipboard.',
        classes: 'green'
      });
    }
  },

  data() {
    return {
      signAddress: '',
      signMessage: '',
      signedSignature: '',
      verifyAddress: '',
      verifyMessage: '',
      verifiedSignature: ''
    };
  },

  mounted() {
    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit();
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables';

.row {
  margin-bottom: 0;
}

.modal {
  overflow-y: inherit;
  min-height: 0 !important;
  max-height: 90% !important;
}

.modal-font {
  text-align: justify;
}

.tab {
  background-color: $dark_grey;
}

.tab .active {
  color: $wagerr_red;
}

.input-field span {
  margin-left: 45px;
}

.modal-footer .modal-btn-padding {
  padding-right: 5px;
}

.sign-message__copy {
  margin-top: 25px;
  margin-left: -15px;
}

.modal-content .options {
  width: 260px;
  margin-left: auto;
  margin-right: auto;
}

.modal-content .options-verify {
  width: 275px;
  margin-left: auto;
  margin-right: auto;
}

.options a,
.options button,
.options-verify a,
.options-verify button {
  margin-top: 20px;
}
</style>
