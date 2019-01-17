<template>

    <div id="wallet-repair" class="settings-sub-section">

        <h3 class="text-center">Wallet Repair Options</h3>

        <p class="text-center">The buttons below will restart the Wagerr wallet with some command line options. Please ensure you back up your wallet.dat before proceeding.</p>

        <ul class="collection">

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn" @click="salvageWallet">Salvage Wallet</button>

                <span>-salvagewallet</span> Attempt to recover private keys from corrupt wallet.dat file.

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn" @click="rescanBlockchain">Rescan Blockchain Files</button>

                <span>-rescan</span> Rescan the block chain for missing transactions.

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn" @click="recoverTxes1">Recover Transactions 1</button>

                <span>-zapwallettxes=1</span> Recover transactions from block chain, keep meta-data e.g. Account Owner.

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn" @click="recoverTxes2">Recover Transactions 2</button>

                <span>-zapwallettxes=2</span> Recover transactions from block chain, drop meta-data.

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn" @click="upgradeWallet">Upgrade Wallet Format</button>

                <span>-upgradewallet</span> Upgrade wallet to latest format on startup.

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light  red darken-4 btn" @click="reindexBlockchain">Rebuild Index</button>

                <span>-reindex</span> Rebuild block chain index from current blk000??.dat files.

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn" @click="resyncBlockchain">Delete Block Chain Folders</button>

                <span>-rescan</span> Delete all local block chain so wallet synchronises from scratch.

            </li>

        </ul>

    </div>

</template>

<script>

    import Vuex from 'vuex'
    import ipcRender from '../../../common/ipc/ipcRender';

    export default {
        name: 'WalletRepair',

        methods: {
            ...Vuex.mapActions([

            ]),

            salvageWallet: function () {
                ipcRender.salvageWallet();
            },

            rescanBlockchain: function () {
                ipcRender.rescanBlockchain();
            },

            recoverTxes1: function () {
                ipcRender.recoverTxes1();
            },

            recoverTxes2: function () {
                ipcRender.recoverTxes2();
            },

            upgradeWallet: function () {
                ipcRender.upgradeWallet();
            },

            reindexBlockchain: function() {
                ipcRender.reindexBlockchain();
            },

            resyncBlockchain: function () {
                ipcRender.resyncBlockchain();
            }
        }
    }

</script>

<style scoped>

    button{
        width: 250px;
    }

    li span{
        width: 140px;
        display: inline-block;
        margin-right: 20px;
        margin-left: 20px;
    }

</style>
