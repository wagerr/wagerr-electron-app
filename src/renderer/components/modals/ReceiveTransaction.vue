<template>

    <!-- Receive Transaction Modal -->

    <div id="receive-tx-modal" class="modal">

        <div class="modal-content">

            <div class="row">

                <div class="modal-header">

                    <h4>Receive Address</h4>

                </div>

                <div class="modal-text">

                    <br>

                    <p class="text-center">QR CODE HERE!</p>

                </div>

                <div class="input-field col s12 text-center">

                    <h6 class="wagerr-red">YOUR WAGERR ADDRESS</h6>

                    <h5>{{ accountAddress }}</h5>

                </div>

            </div>

        </div>

        <div class="modal-footer">

            <!--<button class="waves-effect waves-light btn green pull-left">Save QR Image</button>-->

            <a href="#!" class="modal-close waves-effect waves-light btn wagerr-red-bg">Close</a>

            <a v-clipboard="accountAddress" @click="copiedAlert()" class="waves-effect waves-light btn green">Copy Address</a>

        </div>

    </div>

</template>

<script>

import Vuex from 'vuex'

export default {
  name: 'RecieveTransaction',

  computed: {
    ...Vuex.mapGetters([
      'accountAddress',
    ])
  },

  methods: {
    ...Vuex.mapActions([
      'getAccountAddress'
    ]),

    copiedAlert: function () {
      M.toast({ html: '<span class="toast__bold-font">Success &nbsp;</span> Address copied to your clipboard.', classes: 'green' })
    }
  },

  data () {
    return {

    }
  },

  created () {

  },

  mounted () {
    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit()

    this.getAccountAddress()
  },
}

</script>

<style scoped>

</style>