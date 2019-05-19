<template>
  <!-- Change Password Modal -->

  <div id="change-wallet-password" class="modal bg-gradient">
    <form @submit.prevent="handleSubmit">
      <div class="inset-top">
        <div class="shadow"></div>
      </div>

      <div class="modal-content">
        <div class="row">
          <div class="modal-header">
            <h4>Change Password</h4>
          </div>

          <div class="modal-text">
            <p class="modal-font">
              Enter the old and new password to update the password used to
              unlock the wallet.
            </p>
          </div>

          <div class="input-field col s12">
            <input
              v-model="oldPassword"
              v-validate="'required'"
              id="old-password"
              name="old-password"
              type="password"
              autofocus
            />

            <label for="old-password">Old Password</label>

            <span v-if="errors.has('old-password')" class="form-error">{{
              errors.first('old-password')
            }}</span>
          </div>

          <div class="input-field col s12">
            <input
              v-model="newPassword"
              v-validate="'required'"
              ref="new-password"
              id="new-password"
              name="new-password"
              type="password"
            />

            <label for="new-password">New Password</label>

            <span v-if="errors.has('new-password')" class="form-error">{{
              errors.first('new-password')
            }}</span>
          </div>

          <div class="input-field col s12">
            <input
              v-model="confPassword"
              v-validate="'required|confirmed:new-password'"
              id="conf-password"
              name="conf-password"
              type="password"
            />

            <label for="conf-password">Confirm Password</label>

            <span v-if="errors.has('conf-password')" class="form-error">{{
              errors.first('conf-password')
            }}</span>
          </div>

          <div class="options">
            <a
              @click="clearForm()"
              class="modal-close waves-effect waves-light btn wagerr-red-bg"
              >CANCEL</a
            >

            <button type="submit" class="waves-effect waves-light btn green">
              UPDATE
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
  name: 'ChangePassword',

  methods: {
    // Validate the change password form and call the update password method if valid.
    handleSubmit: function() {
      this.$validator.validate().then(valid => {
        if (!valid) {
          return;
        }

        // If the form is valid then update the wallet password.
        this.changePassword();
      });
    },

    // Update the wallet password using the JSON RPC call the the wagerrd.
    changePassword: function() {
      let self = this;

      wagerrRPC.client
        .walletPassphraseChange(this.oldPassword, this.newPassword)
        .then(function(resp) {
          M.toast({
            html:
              '<span class="toast__bold-font">Success &nbsp;</span> Wallet password has been updated.',
            classes: 'green'
          });

          self.clearForm();
        })
        .catch(function(err) {
          M.toast({ html: err, classes: 'wagerr-red-bg' });
          console.debug(err);
        });
    },

    // Clear the form data and errors.
    clearForm: function() {
      this.oldPassword = '';
      this.newPassword = '';
      this.confPassword = '';
      this.$validator.reset();
    }
  },

  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confPassword: ''
    };
  },

  mounted() {
    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit();

    this.$validator.reset();
  },

  destroyed() {
    this.clearForm();
    this.$validator.reset();
  }
};
</script>

<style lang="scss" scoped>
.row {
  margin-bottom: 0;
}

.modal {
  padding: 0;
  overflow-y: inherit;
  min-height: 0 !important;
  max-height: 80%;
}

.modal-content .options {
  width: 200px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 10px;
}

.options a,
.options button {
  margin-top: 20px;
}
</style>
