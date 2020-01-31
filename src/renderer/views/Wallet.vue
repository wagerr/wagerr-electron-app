<template>
  <div id="wallet" class="content">
    <div class="row wallet-container">
      <div class="wallet-left col s4">
        <div class="wallet-balance card z-depth-2 bg-gradient">
          <h1 class="text-center">
            <span></span>
            {{ $t('Balance') }}
          </h1>

          <div class="dashboard-balance row">
            <div class="col s12 text-center total-balance">
              {{ walletLoaded ? $n(balance, 'decimal') : $t('Loading...') }}
              {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
              <h6>{{ $t('Currently Available') }}</h6>
            </div>

            <div class="col s6 right-align">
              {{ $t('Pending') }}:
            </div>

            <div class="col s6">
              {{ walletLoaded ? $n(pending, 'decimal') : $t('Loading...') }}
              {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
            </div>

            <div class="col s6 right-align">
              {{ $t('Immature') }}:
            </div>

            <div class="col s6">
              {{ walletLoaded ? $n(immature, 'decimal') : $t('Loading...') }}
              {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
            </div>

            <div class="col s6 right-align">
              {{ $t('Locked') }}:</div>

            <div class="col s6">
              {{ walletLoaded ? $n(lockedBalance, 'decimal') : $t('Loading...') }}
              {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
            </div>

            <div class="label col s6 right-align">Zerocoin:</div>

            <div class="col s6">
              {{ walletLoaded ? $n(zerocoin, 'decimal') : $t('Loading...') }} zWGR
            </div>
          </div>

          <!--<div class="dashboard-staking"><span class="amount">0</span> staking</div>-->
          <div class="text-center wallet-btns">
            <a
              class="waves-effect waves-red wallet-action btn-large modal-trigger wagerr-red-bg z-depth-2"
              data-target="send-tx-modal"
              >{{ $t('Send') }}</a
            >

            <a
              class="waves-effect waves-red wallet-action btn-large modal-trigger wagerr-red-bg z-depth-2"
              @click="this.getAccountAddress"
              data-target="receive-tx-modal"
              >{{ $t('Receive') }}</a
            >
          </div>
        </div>
      </div>
      <div class="wallet-right col s8">
        <!-- Include the send & receive modals -->
        <send-transaction></send-transaction>
        <receive-transaction></receive-transaction>

        <div class="table-container wagerr-transactions">
          <!-- Include the wallet transaction list. -->
          <transaction-list></transaction-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import SendTransaction from '@/components/wallet/SendTransaction';
import ReceiveTransaction from '@/components/wallet/ReceiveTransaction';
import TransactionList from '@/components/wallet/TransactionList';

export default {
  name: 'Wallet',
  components: { SendTransaction, ReceiveTransaction, TransactionList },

  computed: {
    ...Vuex.mapGetters([
      'balance',
      'immature',
      'pending',
      'lockedBalance',
      'zerocoin',
      'walletLoaded',
      'accountAddress',
      'wgrTransactionList',
      'getNetworkType'
    ])
  },

  methods: {
    ...Vuex.mapActions([
      'getAccountAddress',
      'walletExtendedBalance',
      'getWGRTransactionList',
      'getWGRTransactionRecords'
    ])
  },

  data() {
    return {
      timeout: 0
    };
  },

  mounted() {
    setInterval(
      function() {
        this.walletExtendedBalance();
      }.bind(this),
      1000
    );

    this.timeout = setInterval(
      function() {
        this.getWGRTransactionRecords(100);
      }.bind(this),
      2000
    );
  },

  destroyed() {
    clearInterval(this.timeout);
  }
};
</script>
