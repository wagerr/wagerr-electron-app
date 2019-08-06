<template>
  <div id="confirm-lotto-entry" class="modal bg-gradient">
    <form @submit.prevent="onSubmit">
      <div class="modal-content">
        <div class="row">
          <div class="modal-header">
            <h4>Confirm Lotto Entry</h4>
          </div>

          <div class="options">
            <a class="modal-close waves-effect waves-light btn wagerr-red-bg">
              Cancel
            </a>

            <button type="submit" class="waves-effect waves-light btn green">
              Buy Ticket
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import wagerrRPC from '@/services/api/wagerrRPC';

export default {
  name: 'ConfirmLottoEntryModal',

  computed: {
    ...mapGetters(['entryFee', 'gameID'])
  },

  methods: {
    // Prevent the submit event from reloading the page with `@submit.prevent`
    // and write our own submit handler.
    onSubmit: function() {
      // Purchase the lotto entry if user clicks 'Buy Ticket'.
      this.placeCGLottoBet();
    },

    // Purchase a lotto entry for the given event.
    placeCGLottoBet: function() {
      wagerrRPC.client
        .placeChainGamesBet(this.gameID, this.entryFee)
        .then(function(resp) {
          // If bet was successful then display bet  to the user.
          if (resp.error !== 'null') {
            M.toast({
              html:
                '<span class="toast__bold-font">Success &nbsp;</span> your bet has been placed: ' +
                resp.result,
              classes: 'green'
            });

            let elem = document.getElementById('confirm-lotto-entry');
            let instance = M.Modal.getInstance(elem);
            instance.close();
          }

          // If bet was unsuccessful then show error to the user.
          else {
            M.toast({
              html:
                '<span class="toast__bold-font">Error &nbsp;</span> ' +
                resp.result,
              classes: 'wagerr-red-bg'
            });
          }
        })
        .catch(function(err) {
          // TODO Parse the error from the response.
          M.toast({ html: err, classes: 'wagerr-red-bg' });
          console.error(err);
        });
    }
  }
};
</script>
