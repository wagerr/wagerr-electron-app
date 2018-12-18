<template>

    <div id="information" class="">

        <h3 class="text-center">Information</h3>

        <div class="row">

            <div class="col s4">

                <h5>General</h5>

                <table>

                    <tr>

                        <th>Client name</th>

                        <td>{{ networkInfo.subversion }}</td>

                    </tr>

                    <tr>

                        <th>Client version</th>

                        <td>{{ networkInfo.version }}</td>

                    </tr>

                    <tr>

                        <th>Open SSL version</th>

                        <td>{{ openSSLv }}</td>

                    </tr>

                    <tr>

                        <th>Berkeley DB version</th>

                        <td>{{ berkeleyDBv }}</td>

                    </tr>

                    <tr>

                        <th>Build date</th>

                        <td>{{ buildDate }}</td>

                    </tr>

                    <tr>

                        <th>Data directory</th>

                        <td>{{ dataDir }}</td>

                    </tr>

                </table>

            </div>

            <div class="col s4">

                <h5>Network</h5>

                <table>

                    <tr>

                        <th>Name</th>

                        <td>{{ getNetworkType }}</td>

                    </tr>

                    <tr>

                        <th>Number of connections</th>

                        <td>{{ getNumConnections }}</td>

                    </tr>

                    <tr>

                        <th>Number of Masternodes</th>

                        <td>{{ getNumMasternodes }}</td>

                    </tr>

                    <tr>

                        <th>Protocol version</th>

                        <td>{{ networkInfo.protocolversion }}</td>

                    </tr>

                </table>

            </div>

            <div class="col s4">

                <h5>Block Chain</h5>

                <table>

                    <tr>

                        <th>Current No of blocks</th>

                        <td>{{ getBlocks }}</td>

                    </tr>

                    <tr>

                        <th>Time since last block</th>

                        <td>{{ this.lastBlockTime }}</td>

                    </tr>

                </table>

            </div>

        </div>

    </div>

</template>

<script>

    import Vuex from 'vuex';
    import moment from 'moment';
    import blockchainRPC from '../../services/api/blockchain_rpc';
    import networkRPC from '../../services/api/network_rpc';

    export default {
        name: 'Information',

        computed: {
            ...Vuex.mapGetters([
                'clientName',
                'clientVersion',
                'openSSLv',
                'berkeleyDBv',
                'buildDate',
                'startUpTime',
                'dataDir',
                'getNetworkType',
                'getNumConnections',
                'getNumMasternodes',
                'getBlocks'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'updateBlocks'
            ]),

            async checkBlockCount () {
                let blockchainInfo = await blockchainRPC.getBlockchainInfo();

                if (blockchainInfo.blocks >= this.getBlocks) {

                    this.updateBlocks(blockchainInfo.blocks);
                    this.lastBlockTime = moment().format('MMM Do YYYY, h:mm:ss a');
                }
            },

        },

        created () {
            this.networkInfo = networkRPC.getNetworkInfo();
            this.checkBlockCount();

        },

        data () {
            return {
                blockchainInfo: {},
                networkInfo: {},
                lastBlockTime: moment().format('MMM Do YYYY, h:mm:ss a')
            }
        },

    }
</script>

<style scoped>

</style>
