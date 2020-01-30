<template>
  <!-- Receive Transaction Modal -->

  <div id="receive-tx-modal" class="modal">
    <div class="modal-content">
      <div class="row">
        <div class="modal-text">
          <div class="card barcode text-center z-depth-3">
            <QrCode :value="accountAddress" width="145"></QrCode>
          </div>
        </div>

        <div class="col s12 text-center">
          <h5 class="wagerr-red address-label">YOUR WAGERR ADDRESS</h5>

          <h5 class="address">{{ accountAddress }}</h5>
        </div>

        <div class="options text-center">
          <div class="circle-icon">
            <el-tooltip content="Copy">
              <span class="inner-circle">
                <a
                  v-clipboard="accountAddress"
                  @click="copiedAlert()"
                  class="circle-icon-link"
                >
                  <i class="far fa-copy"></i>
                </a>
              </span>
            </el-tooltip>
          </div>

          <div class="circle-icon">
            <el-tooltip content="Email">
              <span class="inner-circle">
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
            </el-tooltip>
          </div>

          <div class="circle-icon">
            <el-tooltip content="Open in block explorer">
              <span class="inner-circle">
                <a
                  @click="blockExplorerUrl"
                  class="circle-icon-link"
                >
                  <i class="fas fa-link"></i>
                </a>
              </span>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import QrCode from '../utilities/QrCode.vue';

import {
  testnetParams,
  mainnetParams
} from '../../../main/constants/constants';

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
          ? testnetParams.BLOCK_EXPLORER_URL
          : mainnetParams.BLOCK_EXPLORER_URL;

      shell.openExternal(explorerUrl + '/#/address/' + this.accountAddress);
    }
  },

  components: {
    QrCode
  }
};
</script>
