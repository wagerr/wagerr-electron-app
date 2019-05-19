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
              Enter wallet password to unlock wallet and enable sending WGR and
              betting.
            </p>
          </div>

          <div class="input-field col s12">
            <i class="fas fa-unlock-alt prefix"></i>

            <input
              name="wallet-password"
              v-model="walletPassword"
              v-validate="'required'"
              id="wallet-password"
              type="password"
              autofocus
            />

            <label for="wallet-password"> Wallet Password</label>

            <span v-if="errors.has('wallet-password')" class="form-error">{{
              errors.first('wallet-password')
            }}</span>
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

        // If the form is valid then attempt to unlock the wallet.
        await this.unlockWallet(this.walletPassword);

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
      this.walletPassword = '';
      this.$validator.reset();
    }
  },

  data() {
    return {
      walletPassword: ''
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
.options button {
  margin-top: 20px;
}

.row {
  margin-bottom: 0;
}
</style>
