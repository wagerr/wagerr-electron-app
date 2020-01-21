<template>
  <!-- Encrypt Wallet Modal -->

  <div id="encrypt-wallet" class="modal bg-gradient">
    <form @submit.prevent="handleSubmit">
      <div class="modal-content">
        <div class="row">
          <div class="modal-header">
            <h4>Encrypt Wallet</h4>
          </div>

          <div class="modal-text">
            <p class="modal-font">
              Enter the new password which will be used to unlock your wallet.
            </p>

            <p class="gray">
              (Please use a secure password of seven or more random characters.)
            </p>
          </div>

          <div class="input-field col s12">
            <i class="fas fa-lock-open prefix"></i>

            <input
              name="password"
              v-model="password"
              v-validate="'required'"
              ref="password"
              id="password"
              type="password"
            />

            <label for="password">Password</label>

            <span v-if="errors.has('password')" class="form-error">{{
              errors.first('password')
            }}</span>
          </div>

          <div class="input-field col s12">
            <i class="fas fa-unlock prefix "></i>

            <input
              name="confirm-password"
              v-model="confirmPassword"
              v-validate="'required|confirmed:password'"
              id="confirm-password"
              type="password"
            />

            <label for="confirm-password">Confirm Password</label>

            <span v-if="errors.has('confirm-password')" class="form-error">{{
              errors.first('confirm-password')
            }}</span>
          </div>

          <div class="options">
            <a
              @click="clearForm"
              class="modal-close waves-effect waves-light btn wagerr-red-bg"
              >Cancel</a
            >

            <button type="submit" class="waves-effect waves-light btn green">
              Encrypt
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import wagerrRPC from '@/services/api/wagerrRPC';
import ipcRenderer from '../../../common/ipc/ipcRenderer';

export default {
  name: 'EncryptWallet',

  methods: {
    // Handles the encrypt wallet form submission and ensures inputs are valid.
    handleSubmit: function() {
      this.$validator.validate().then(valid => {
        if (!valid) {
          return;
        }

        // If the form is valid then encrypt the wallet.
        this.encryptWallet();
      });
    },

    // Encrypt the users Wallet.
    encryptWallet: function() {
      let self = this;

      // Disable clicking events while we wait for encryption to finish.
      document.body.style.pointerEvents = 'none';

      // Notify they user that the encryption can take a while.
      M.toast({
        html:
          '<span class="toast__bold-font">Success &nbsp;</span> Wallet is encrypting, this may take a while.',
        classes: 'green'
      });

      // Send RPC request to encrypt the users wallet with the provided password.
      wagerrRPC.client
        .encryptWallet(this.password)
        .then(function(resp) {
          // Notify the user that the encryption was successful and the wallet will restart soon.
          M.toast({
            html:
              '<span class="toast__bold-font">Success &nbsp;</span> Wallet has been encrypted and will restart in a few seconds.',
            classes: 'green'
          });

          self.clearForm();
        })
        .then(function() {
          // Restart the wallet.
          setTimeout(function() {
            ipcRenderer.encryptWallet();
          }, 6000);
        })
        .catch(function(err) {
          // Re-enable clicking events if encryption fails.
          document.body.style.pointerEvents = 'unset';

          M.toast({ html: err, classes: 'wagerr-red-bg' });
          console.error(err);
        });
    },

    // Clear the form data and errors.
    clearForm: function() {
      this.password = '';
      this.confirmPassword = '';
      this.$validator.reset();
    }
  },

  data() {
    return {
      password: '',
      confirmPassword: ''
    };
  },

  mounted() {
    // Reset the form validation after opening the modal
    this.$validator.reset();
  }
};
</script>

<style lang="scss" scoped>
.modal {
  overflow-y: inherit;
}

.gray {
  color: #aaa;
}

.input-field span {
  margin-left: 45px;
}

.modal-content .options {
  width: 210px;
  margin-left: auto;
  margin-right: auto;
}
.modal-content p {
  margin: 10px 0;
}

.options a,
.options button {
  margin-top: 15px;
}

.row {
  margin-bottom: 0;
}
</style>
