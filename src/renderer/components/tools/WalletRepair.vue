<template>
  <div id="wallet-repair" class="settings-sub-section">
    <h4>{{ $t('Wallet Repair Options') }}</h4>

    <p>
      {{ $t('The buttons below will restart the Wagerr wallet with some command line  options.') }}
      {{ $t('Please ensure you back up your wallet.dat before proceeding.') }}
    </p>

    <ul class="collection">
      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="salvageWallet"
        >
          {{ $t('Salvage Wallet') }}
        </button>

        <span class="command">-salvagewallet</span>
        <span class="desc"
          >{{ $t('Attempt to recover private keys from corrupt wallet.dat file.') }}</span
        >
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="rescanBlockchain"
        >
          {{ $t('Rescan Blockchain Files') }}
        </button>

        <span class="command">-rescan</span>
        <span class="desc">
          {{ $t('Rescan the blockchain for missing transactions.') }}
        </span
        >
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="recoverTxes1"
        >
          {{ $t('Recover Transactions 1') }}
        </button>

        <span class="command">-zapwallettxes=1</span>
        <span class="desc">
          {{ $t('Recover transactions from blockchain, keep meta-data e.g. Account Owner.') }}
        </span
        >
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="recoverTxes2"
        >
          {{ $t('Recover Transactions 2') }}
        </button>

        <span class="command">-zapwallettxes=2</span>
        <span class="desc">
          {{ $t('Recover transactions from blockchain, drop meta-data.') }}
        </span
        >
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="upgradeWallet"
        >
          {{ $t('Upgrade Wallet Format') }}
        </button>

        <span class="command">-upgradewallet</span>
        <span class="desc">
          {{ $t('Upgrade wallet to latest format on startup.') }}
        </span>
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light  red darken-4 btn"
          @click="reindexBlockchain"
        >
          {{ $t('Rebuild Index') }}
        </button>

        <span class="command">-reindex</span>
        <span class="desc">
          {{ $t('Rebuild blockchain index from current blk000??.dat files.') }}
        </span
        >
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="resyncBlockchain"
        >
          {{ $t('Delete Blockchain') }}
        </button>

        <span class="command">-resync</span>
        <span class="desc">
          {{ $t('Delete all local blockchain so wallet synchronises from scratch.') }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import Vuex from 'vuex';
import ipcRenderer from '../../../common/ipc/ipcRenderer';

export default {
  name: 'WalletRepair',

  methods: {
    ...Vuex.mapActions([]),

    salvageWallet: function() {
      ipcRenderer.salvageWallet();
    },

    rescanBlockchain: function() {
      ipcRenderer.rescanBlockchain();
    },

    recoverTxes1: function() {
      ipcRenderer.recoverTxes1();
    },

    recoverTxes2: function() {
      ipcRenderer.recoverTxes2();
    },

    upgradeWallet: function() {
      ipcRenderer.upgradeWallet();
    },

    reindexBlockchain: function() {
      ipcRenderer.reindexBlockchain();
    },

    resyncBlockchain: function() {
      ipcRenderer.resyncBlockchain();
    }
  }
};
</script>

<style lang="scss" scoped>
  .desc {
    // In case of long description, this avoids unbalanced column width between rows
    flex-shrink: 1000;
  }
</style>