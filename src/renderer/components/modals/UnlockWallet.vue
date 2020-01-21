<template>
  <!-- Unlock Wallet Modal -->
  <div id="unlock-wallet-modal" class="modal bg-gradient no-auto-init">
    <div class="modal-content">
      <!-- Prevent the submit event from reloading the page -->
      <form @submit.prevent="handleSubmit">
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

            <p v-if="isStartup" class="pwd-startup-checkbox">
              <label>
                <input
                  name="passwordOnStartup"
                  type="checkbox"
                  id="passwordOnStartup"
                  :checked="getPasswordOnStartup"
                  @click="togglePasswordOnStartup()"
                />
                <span style="">Always ask for password on startup</span>
              </label>
            </p>
          </div>

          <div class="options">
            <a
              @click="clearForm()"
              class="modal-close waves-effect waves-light btn wagerr-red-bg"
            >
              Cancel
            </a>
            <a
              @click="unlockAnonymizeOnly = true; handleSubmit();"
              class="waves-effect waves-light btn blue"
            >
              Unlock for Staking Only
            </a>
            <a
              @click="handleSubmit()"
              class="waves-effect waves-light btn green"
            >
              Unlock
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'UnlockWallet',
  props: ['isStartup'],
  data() {
    return {
      checked: false,
      unlockPassphrase: null,
      unlockTimeout: '0',
      unlockAnonymizeOnly: false
    };
  },

  computed: {
    ...mapGetters(['walletLoaded', 'walletUnlocked', 'getPasswordOnStartup'])
  },

  methods: {
    ...mapActions(['lockWallet', 'unlockWallet', 'togglePasswordOnStartup']),

    // Handle the unlock wallet from validation and id valid unlock the wallet.
    handleSubmit: function() {
      this.$validator.validate().then(async valid => {
        if (!valid) {
          return;
        }

        try {
          // If the form is valid then attempt to unlock the wallet.
          await this.unlockWallet([
            this.unlockPassphrase,
            this.unlockTimeout,
            this.unlockAnonymizeOnly
          ]);
        } catch {
          // If there is an error in unlocking the wallet clear the form and
          // reset all the values back to default.
          this.clearForm();
        };

        if (this.walletUnlocked) {
          // Clear any errors after successful wallet unlock.
          this.clearForm();

          let elem = document.getElementById('unlock-wallet-modal');
          let instance = M.Modal.getInstance(elem);
          instance.close();
        }
      });
    },

    clearForm: function() {
      // Reset input values to default.
      this.unlockPassphrase = null;
      this.unlockAnonymizeOnly = false;

      // Reset the form validator to remove any validation error messages.
      this.$validator.reset();

      // Remove the active class from the input field labels.
      document
        .getElementById('unlock-passphrase-label')
        .classList.remove('active');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables.scss';

.modal {
  overflow-y: inherit;
}

.input-field {
  span {
    margin-left: 45px;
  }

  .pwd-startup-checkbox {
    text-align: right;
  }
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

[type='checkbox']:checked + span:not(.lever):before {
    border-right: 2px solid $wagerr-red;
    border-bottom: 2px solid $wagerr-red;
  }
</style>
