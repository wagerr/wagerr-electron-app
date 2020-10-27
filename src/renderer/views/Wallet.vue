<template>
  <div id="wallet" class="content">
    <div class="row wallet-container">
      <div class="wallet-left col s4">
        <div class="wallet-balance card z-depth-2 bg-gradient">
          <h1 class="text-center"><span></span>Balance</h1>

          <div class="dashboard-balance row">
            <div class="col s12 text-center total-balance">
              {{ walletLoaded ? balance : 'Loading...' }}
              {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
              <h6>Currently Available</h6>
            </div>

            <div class="col s6 right-align">Pending:</div>

            <div class="col s6">
              {{ walletLoaded ? pending : 'Loading...' }}
              {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
            </div>

            <div class="col s6 right-align">Immature:</div>

            <div class="col s6">
              {{ walletLoaded ? immature : 'Loading...' }}
              {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
            </div>

            <div class="col s6 right-align">Locked:</div>

            <div class="col s6">
              {{ walletLoaded ? lockedBalance : 'Loading...' }}
              {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
            </div>

            <div class="label col s6 right-align">Zerocoin:</div>

            <div class="col s6">{{ walletLoaded ? zerocoin : 'Loading...' }} zWGR</div>
          </div>

          <!--<div class="dashboard-staking"><span class="amount">0</span> staking</div>-->

          <div class="text-center wallet-btns">
            <a
              class="waves-effect waves-red wallet-action btn-large modal-trigger wagerr-red-bg z-depth-2"
              data-target="send-tx-modal"
              >Send</a
            >

            <a
              class="waves-effect waves-red wallet-action btn-large modal-trigger wagerr-red-bg z-depth-2"
              data-target="receive-tx-modal"
              @click="getAccountAddress"
            >
              Receive
            </a>
          </div>
        </div>
      </div>
      <div class="wallet-right col s8">
        <div class="table-container wagerr-transactions">
          <!-- Include the wallet transaction list. -->
          <transaction-list></transaction-list>
          <send-transaction></send-transaction>
          <receive-transaction></receive-transaction>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import TransactionList from '../components/wallet/TransactionList.vue';
import SendTransaction from '../components/wallet/SendTransaction.vue';
import ReceiveTransaction from '../components/wallet/ReceiveTransaction.vue';

export default {
  name: 'Wallet',

  components: { TransactionList, SendTransaction, ReceiveTransaction },

  data() {
    return {
      timeout: null
    };
  },

  computed: {
    ...Vuex.mapGetters([
      'balance',
      'immature',
      'pending',
      'lockedBalance',
      'zerocoin',
      'walletLoaded',
      'accountAddress',
      'getNetworkType'
    ])
  },

  mounted() {
    this.$initMaterialize();

    this.timeout = setInterval(() => {
      this.walletExtendedBalance();
      this.getWGRTransactionRecords(100);
    }, 30000);
  },

  beforeDestroy() {
    clearInterval(this.timeout);
  },

  methods: {
    ...Vuex.mapActions(['getAccountAddress', 'walletExtendedBalance', 'getWGRTransactionRecords'])
  }
};
</script>
