<template>
  <!-- Receive Transaction Modal -->

  <div id="receive-tx-modal" class="modal">
    <div class="modal-content">
      <div class="row">
        <div class="modal-text">
          <div class="card barcode text-center z-depth-3">
            <qrcode-vue
              :value="accountAddress"
              :size="145"
              background="#FFFFFF"
              foreground="#000000"
              level="H"
            ></qrcode-vue>
          </div>
        </div>

        <div class="col s12 text-center">
          <h5 class="wagerr-red address-label">YOUR WAGERR ADDRESS</h5>

          <h5 class="address">{{ accountAddress }}</h5>
        </div>

        <div class="options text-center">
          <div class="circle-icon">
            <span
              class="inner-circle tooltipped"
              data-position="bottom"
              data-tooltip="Copy"
            >
              <a
                v-clipboard="accountAddress"
                @click="copiedAlert()"
                class="circle-icon-link"
              >
                <i class="far fa-copy"></i>
              </a>
            </span>
          </div>

          <div class="circle-icon">
            <span
              class="inner-circle tooltipped"
              data-position="bottom"
              data-tooltip="Email"
            >
              <a
                class="circle-icon-link"
                :href="
                  'mailto:wagerr@example.com?Subject=Wagerr Wallet Address&Body=My Wagerr address is: ' +
                    accountAddress
                "
                target="_top"
              >
                <i class="far fa-envelope"></i>
              </a>
            </span>
          </div>

          <div class="circle-icon">
            <span
              class="inner-circle tooltipped"
              data-position="bottom"
              data-tooltip="Open in block explorer"
            >
              <a class="circle-icon-link" @click="blockExplorerUrl">
                <i class="fas fa-link"></i>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import QrcodeVue from 'qrcode.vue';

import constants from '../../../main/constants/constants';

export default {
  name: 'RecieveTransaction',

  computed: {
    ...Vuex.mapGetters(['accountAddress', 'getNetworkType'])
  },

  methods: {
    ...Vuex.mapActions(['getAccountAddress']),

    copiedAlert: function() {
      M.toast({
        html:
          '<span class="toast__bold-font">Success &nbsp;</span> Address copied to your clipboard.',
        classes: 'green'
      });
    },

    // Create the Wagerr block explorer URL to view the wallet address.
    blockExplorerUrl() {
      let shell = require('electron').shell;
      let explorerUrl =
        this.getNetworkType === 'Testnet'
          ? constants.TESTNET_EXP_URL
          : constants.MAINNET_EXP_URL;

      shell.openExternal(explorerUrl + '/#/address/' + this.accountAddress);
    }
  },

  mounted() {
    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit();

    this.getAccountAddress();
  },

  components: {
    QrcodeVue
  }
};
</script>
