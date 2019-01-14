<template>

    <div id="wallet-repair" class="settings-sub-section">

        <h3 class="text-center">Wallet Repair Options</h3>

        <p class="text-center">The buttons below will restart the wagerrd with some command line options. You can also do this manually by using hte command to the left of each button.</p>

        <ul class="collection">

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn" @click="salvageWallet">Salvage Wallet</button>

                 Attempt to recover private keys from corrupt wallet.dat file.

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn" @click="rescanBlockchain">Rescan Blockchain Files</button>

                Rescan the block chain for missing transactions.

            </li>

            <!--<li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn">Recover Transactions 1</button>

                Recover transactions from block chain, keep meta-data e.g. Account Owner.

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn">Recover Transactions 2</button>

                Recover transactions from block chain, drop meta-data.

            </li>-->

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn" @click="upgradeWallet">Upgrade Wallet Format</button>

                Upgrade wallet to latest format on startup.

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light  red darken-4 btn" @click="reindexBlockchain">Rebuild Index</button>

                Rebuild block chain index from current blk000??.dat files.

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn" @click="resyncBlockchain">Delete Block Chain Folders</button>

                Delete all local block chain so wallet synchronises from scratch.

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

</style>
