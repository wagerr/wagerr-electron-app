<template>
  <div id="peers" class="settings-sub-section">
    <h4>Peers</h4>

    <table
      class="col-12 col-sm-12 col-md-12 col-lg-8 main-table card z-depth-2"
    >
      <thead>
        <tr>
          <th>Address:Port</th>

          <th>Version</th>

          <th>Ping Time</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="peer in getPeerInfo" :key="peer.id">
          <td>{{ peer.addr }}</td>

          <td>{{ peer.subver }}</td>

          <td>{{ peer.pingtime }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="getBannedInfo">
      <h3 class="text-center">Banned</h3>

      <table
        class="col-12 col-sm-12 col-md-12 col-lg-8 main-table card z-depth-2"
      >
        <thead>
          <tr>
            <th>Address:Port</th>

            <th>Version</th>

            <th>Ping Time</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="peer in getBannedInfo" :key="peer.id">
            <td>{{ peer.addr }}</td>

            <td>{{ peer.subver }}</td>

            <td>{{ peer.pingtime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';

export default {
  name: 'Peers',

  computed: {
    ...Vuex.mapGetters(['getPeerInfo', 'getBannedInfo'])
  },

  methods: {
    ...Vuex.mapActions(['updatePeerInfo', 'updateBannedInfo'])
  },

  created() {
    this.updatePeerInfo();
    this.updateBannedInfo();

    this.timeout = setInterval(
      function() {
        this.updatePeerInfo();
        this.updateBannedInfo();
      }.bind(this),
      3000
    );
  },

  data() {
    return {
      timeout: 0
    };
  },

  destroyed() {
    clearInterval(this.timeout);
  }
};
</script>

<style scoped></style>
