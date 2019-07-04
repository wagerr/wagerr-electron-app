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
              id="unlock-passphrase"
              type="password"
              autofocus
            />

            <label for="unlock-passphrase"> Wallet Passphrase</label>

            <span v-if="errors.has('unlock-passphrase')" class="form-error">
              {{ errors.first('unlock-passphrase') }}
            </span>
          </div>

          <div
            class="input-field col s12"
            :style="
              unlockAnonymizeOnly === true
                ? 'display: none;'
                : 'display: block;'
            "
          >
            <i class="fas fa-clock prefix"></i>
            <input
              name="unlock-timeout"
              v-model="unlockTimeout"
              v-validate="{ required: !unlockAnonymizeOnly, numeric: true }"
              id="unlock-timeout"
              type="text"
            />

            <label for="unlock-timeout"> Wallet Unlock Time (seconds)</label>

            <span v-if="errors.has('unlock-timeout')" class="form-error">
              {{ errors.first('unlock-timeout') }}
            </span>
          </div>

          <div class="input-field col s12">
            <label>
              <input
                name="unlock-anonymize-only"
                v-model="unlockAnonymizeOnly"
                type="checkbox"
              />
              <span>Unlock for Staking Only</span>
            </label>
          </div>

          <div class="options">
            <a
              @click="clearForm"
              class="modal-close waves-effect waves-light btn wagerr-red-bg"
              >CANCEL</a
            >

            <button type="submit" class="waves-effect waves-light btn green">
              UNLOCK
            </button>
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

        // If the form is valid and we are only unlocking for staking, then set
        // the timeout value to 0.
        if (this.unlockAnonymizeOnly === true) {
          this.unlockTimeout = 0;
        }

        // If the form is valid then attempt to unlock the wallet.
        await this.unlockWallet([
          this.unlockPassphrase,
          this.unlockTimeout,
          this.unlockAnonymizeOnly
        ]);

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
      this.unlockPassphrase = '';
      this.unlockTimeout = '';
      this.unlockAnonymizeOnly = false;
      this.$validator.reset();
    }
  },

  data() {
    return {
      unlockPassphrase: '',
      unlockTimeout: '',
      unlockAnonymizeOnly: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables';

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
  margin-top: 20px;
}

.row {
  margin-bottom: 0;
}

[type='checkbox']:checked + span:not(.lever):before {
  border-right: 2px solid $wagerr_red;
  border-bottom: 2px solid $wagerr_red;
}
</style>
