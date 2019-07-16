<template>
  <!-- Unlock Wallet Modal -->

  <div id="unlock-wallet-modal" class="modal bg-gradient">
    <form @submit.prevent="handleSubmit">
      <div class="inset-top">
        <div class="shadow"></div>
      </div>

      <div class="modal-content">
        <div class="row">
          <div class="modal-header">
            <h4>Unlock Wallet</h4>
          </div>

          <div class="modal-text">
            <p class="modal-font">
              Enter wallet passphrase to unlock wallet and enable sending WGR
              and betting.
            </p>
          </div>

          <div class="input-field col s12">
            <i class="fas fa-unlock-alt prefix"></i>

            <input
              name="unlock-passphrase"
              v-model="unlockPassphrase"
              v-validate="'required'"
              data-vv-as="Wallet Passphrase"
              ref="unlock-passphrase"
              id="unlock-passphrase"
              type="password"
              autofocus
            />

            <label id="unlock-passphrase-label" for="unlock-passphrase">
              Wallet Passphrase
            </label>

            <span v-if="errors.has('unlock-passphrase')" class="form-error">
              {{ errors.first('unlock-passphrase') }}
            </span>
          </div>

          <div class="input-field col s12">
            <i class="fas fa-unlock-alt prefix"></i>

            <input
              name="confirm-unlock-passphrase"
              v-model="confirmUnlockPassphrase"
              v-validate="'required|confirmed:unlock-passphrase'"
              data-vv-as="Confirm Wallet Passphrase"
              id="confirm-unlock-passphrase"
              type="password"
            />

            <label
              id="confirm-unlock-passphrase-label"
              for="confirm-unlock-passphrase"
            >
              Confirm Wallet Passphrase
            </label>

            <span
              v-if="errors.has('confirm-unlock-passphrase')"
              class="form-error"
            >
              {{ errors.first('confirm-unlock-passphrase') }}
            </span>
          </div>

          <div class="options">
            <input
              @click="clearForm"
              type="reset"
              class="modal-close waves-effect waves-light btn wagerr-red-bg"
              value="Cancel"
            />

            <input
              @click="unlockAnonymizeOnly = true"
              type="submit"
              class="waves-effect waves-light btn blue"
              value="Unlock for Staking Only"
            />

            <input
              type="submit"
              class="waves-effect waves-light btn green"
              value="Unlock"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Vuex from 'vuex';

export default {
  name: 'UnlockWallet',

  computed: {
    ...Vuex.mapGetters(['walletLoaded', 'walletUnlocked'])
  },

  methods: {
    ...Vuex.mapActions(['lockWallet', 'unlockWallet']),

    // Handle the unlock wallet from validation and id valid unlock the wallet.
    handleSubmit: function() {
      this.$validator.validate().then(async valid => {
        if (!valid) {
          return;
        }

        // If the form is valid then attempt to unlock the wallet.
        await this.unlockWallet([
          this.unlockPassphrase,
          this.unlockTimeout,
          this.unlockAnonymizeOnly
        ]).catch(() => {
          // If there is an error in unlocking the wallet clear the form and
          // reset all the values back to default.
          this.clearForm();
        });

        if (this.walletUnlocked) {
          // Clear any errors after successful wallet unlock.
          this.clearForm();

          let elem = document.querySelector('#unlock-wallet-modal');
          let instance = M.Modal.getInstance(elem);
          instance.close();
        }
      });
    },

    clearForm: function() {
      // Reset input values to default.
      this.unlockPassphrase = null;
      this.confirmUnlockPassphrase = null;
      this.unlockAnonymizeOnly = false;

      // Reset the form validator to remove any validation error messages.
      this.$validator.reset();

      // Remove the active class from the input field labels.
      let inputFields = [];
      inputFields.push(document.getElementById('unlock-passphrase-label'));
      inputFields.push(
        document.getElementById('confirm-unlock-passphrase-label')
      );

      for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].classList.remove('active');
      }
    }
  },

  data() {
    return {
      unlockPassphrase: null,
      confirmUnlockPassphrase: null,
      unlockTimeout: '0',
      unlockAnonymizeOnly: false
    };
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
.options input {
  margin-top: 20px;
}

.row {
  margin-bottom: 0;
}
</style>
