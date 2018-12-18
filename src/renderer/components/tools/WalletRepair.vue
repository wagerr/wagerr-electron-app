<template>

    <div id="wallet-repair" class="settings-sub-section">

        <h3 class="text-center">Wallet Repair Options</h3>

        <p class="text-center">The buttons below will restart the wagerrd with some command line options. You can also do this manually by using hte command to the left of each button.</p>

        <ul class="collection">

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn">Salvage Wallet</button> - ./wagerr-cli -salvagewallet (Attempt to recover private keys from corrupt wallet.dat file.)

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn">Rescan Blockchain Files</button> - ./wagerr-cli -rescan (Rescan the block chain for missing transactions)

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn">Recover Transactions 1</button> - ./wagerr-cli -zapwallettxes=1 (Recover transactions from block chain, keep meta-data e.g. Account Owner)

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn">Recover Transactions 2</button> - ./wagerr-cli -zapwallettxes=2 (Recover transactions from block chain, drop meta-data)

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn">Upgrade Wallet Format</button> - ./wagerr-cli -upgradewallet (Upgrade wallet to latest format on startup)

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light  red darken-4 btn ">Rebuild Index</button> - ./wagerr-cli -reindex (Rebuild block chain index from current blk000??.dat files)

            </li>

            <li class="collection-item">

                <button class="waves-effect waves-light red darken-4 btn">Delete Block Chain Folders</button>- ./wagerr-cli -resync (Delete all local block chain so wallet synchronises from scratch)

            </li>

        </ul>

    </div>

</template>

<script>

export default {
  name: 'WalletRepair'
}

</script>

<style scoped>

  button{
    width: 250px;
  }

</style>
