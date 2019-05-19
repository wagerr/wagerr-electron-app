<template>
  <!-- Encrypt Wallet Modal -->

  <div id="encrypt-wallet" class="modal bg-gradient">
    <form @submit.prevent="handleSubmit">
      <div class="inset-top">
        <div class="shadow"></div>
      </div>

      <div class="modal-content">
        <div class="row">
          <div class="modal-header">
            <h4>Encrypt Wallet</h4>
          </div>

          <div class="modal-text">
            <p class="modal-font">
              Enter the new password which will be used to unlock your wallet.
            </p>

            <p>
              Please use a secure password of seven or more random characters.
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
        this.encryptWallet().then(() => {
          // Clear any errors after successful wallet encryption.
          this.clearForm();
        });
      });
    },

    // Encrypt the users Wallet.
    encryptWallet: function() {
      return new Promise((resolve, reject) => {
        // Send RPC request to encrypt the users wallet with the provided password.
        wagerrRPC.client
          .encryptWallet(this.password)
          .then(function(resp) {
            // If successful response.
            if (resp.error === 'null') {
              M.toast({
                html:
                  '<span class="toast__bold-font">Success &nbsp;</span> ' +
                  resp.result,
                classes: 'green'
              });
            } else {
              M.toast({
                html:
                  '<span class="toast__bold-font">Error &nbsp;</span> ' +
                  resp.result,
                classes: 'wagerr-red-bg'
              });
            }

            resolve();
          })
          .catch(function(err) {
            M.toast({ html: err, classes: 'wagerr-red-bg' });
            console.error(err);
            reject();
          });
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
    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit();

    // Reset the form validation after opening the modal
    this.$validator.reset();
  }
};
</script>

<style lang="scss" scoped>
.modal {
  overflow-y: inherit;
}

.input-field span {
  margin-left: 45px;
}

.modal-content .options {
  width: 210px;
  margin-left: auto;
  margin-right: auto;
}

.options a,
.options button {
  margin-top: 15px;
}

.row {
  margin-bottom: 0;
}
</style>
