<template>

  <div id="peers" class="settings-sub-section">

      <h3 class="text-center">Peers</h3>

      <table class="col-12 col-sm-12 col-md-12 col-lg-8">

          <thead>

              <tr>

                  <th>Address:Port</th>

                  <th>Version</th>

                  <th>Ping Time</th>

              </tr>

          </thead>

          <tbody>

              <tr v-for="(peer) in peerInfo" :key="peer.id">

                <td>{{ peer.addr }}</td>

                <td>{{ peer.subver }}</td>

                <td>{{ peer.pingtime }}</td>

              </tr>

          </tbody>

      </table>

  </div>

</template>

<script>

    import Vuex from 'vuex'
    import networkRPC from '@/services/api/network_rpc'

    export default {
        name: 'Peers',

        computed: {
            ...Vuex.mapGetters([
                'peerList'
            ])
        },

        methods: {
            ...Vuex.mapActions([
                'getPeerinfo'
            ])
        },

        async created () {
            this.peerInfo = await networkRPC.getPeerInfo();
        },

        data () {
            return {
                peerInfo: {}
            }
        }
    }

</script>

<style scoped>

</style>
