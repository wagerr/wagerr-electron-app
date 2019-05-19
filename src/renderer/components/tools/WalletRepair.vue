<template>
  <div id="wallet-repair" class="settings-sub-section">
    <h4>Wallet Repair Options</h4>

    <p>
      The buttons below will restart the Wagerr wallet with some command line
      options. Please ensure you back up your wallet.dat before proceeding.
    </p>

    <ul class="collection">
      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="salvageWallet"
        >
          Salvage Wallet
        </button>

        <span class="command">-salvagewallet</span>
        <span class="desc"
          >Attempt to recover private keys from corrupt wallet.dat file.</span
        >
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="rescanBlockchain"
        >
          Rescan Blockchain Files
        </button>

        <span class="command">-rescan</span>
        <span class="desc"
          >Rescan the block chain for missing transactions.</span
        >
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="recoverTxes1"
        >
          Recover Transactions 1
        </button>

        <span class="command">-zapwallettxes=1</span>
        <span class="desc"
          >Recover transactions from block chain, keep meta-data e.g. Account
          Owner.</span
        >
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="recoverTxes2"
        >
          Recover Transactions 2
        </button>

        <span class="command">-zapwallettxes=2</span>
        <span class="desc"
          >Recover transactions from block chain, drop meta-data.</span
        >
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="upgradeWallet"
        >
          Upgrade Wallet Format
        </button>

        <span class="command">-upgradewallet</span>
        <span class="desc">Upgrade wallet to latest format on startup.</span>
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light  red darken-4 btn"
          @click="reindexBlockchain"
        >
          Rebuild Index
        </button>

        <span class="command">-reindex</span>
        <span class="desc"
          >Rebuild block chain index from current blk000??.dat files.</span
        >
      </li>

      <li class="collection-item">
        <button
          class="waves-effect waves-light red darken-4 btn"
          @click="resyncBlockchain"
        >
          Delete Block Chain Folders
        </button>

        <span class="command">-resync</span>
        <span class="desc"
          >Delete all local block chain so wallet synchronises from
          scratch.</span
        >
      </li>
    </ul>
  </div>
</template>

<script>
import Vuex from 'vuex';
import ipcRender from '../../../common/ipc/ipcRender';

export default {
  name: 'WalletRepair',

  methods: {
    ...Vuex.mapActions([]),

    salvageWallet: function() {
      ipcRender.salvageWallet();
    },

    rescanBlockchain: function() {
      ipcRender.rescanBlockchain();
    },

    recoverTxes1: function() {
      ipcRender.recoverTxes1();
    },

    recoverTxes2: function() {
      ipcRender.recoverTxes2();
    },

    upgradeWallet: function() {
      ipcRender.upgradeWallet();
    },

    reindexBlockchain: function() {
      ipcRender.reindexBlockchain();
    },

    resyncBlockchain: function() {
      ipcRender.resyncBlockchain();
    }
  }
};
</script>
