<template>
  <div id="information">
    <h4>Wagerr Wallet &amp; Network Info</h4>

    <div class="row text-center">
      <div class="col s6">
        <div class="info-block table-container">
          <table class="main-table card z-depth-2">
            <thead>
              <tr>
                <th colspan="2">Wallet Info</th>
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>Wallet Version</th>

                <td class="number">{{ walletVersion }}</td>
              </tr>

              <tr class="info-row">
                <th>Daemon Version</th>

                <td class="number">{{ formatNetworkVersion(getNetworkVersion) }}</td>
              </tr>

              <tr class="info-row">
                <th>Transactions</th>

                <td class="number">{{ getTxCount }}</td>
              </tr>

              <tr class="info-row">
                <th>DataDir</th>

                <td class="datadir">{{ dataDir }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col s6">
        <div class="info-block table-container">
          <table class="main-table card z-depth-2">
            <thead>
              <tr>
                <th colspan="2">Blockchain Info</th>
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>Block Count</th>

                <td class="number">{{ getBlocks }}</td>
              </tr>

              <tr class="info-row">
                <th>Last Block</th>

                <td class="date">{{ this.lastBlockTime }}</td>
              </tr>

              <tr class="info-row">
                <th>Money Supply</th>

                <td class="number">{{ Number(getMoneySupply.toFixed(2)) }}</td>
              </tr>

              <tr class="info-row">
                <th>Blockchain Synced</th>

                <td class="blockchain-synced">
                  <i
                    :class="[
                      getChainSyncStatus
                        ? 'far fa-check-circle'
                        : 'fas fa-sync-alt'
                    ]"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="row text-center">
      <div class="col s6">
        <div class="info-block table-container">
          <table class="main-table card z-depth-2">
            <thead>
              <tr>
                <th colspan="2">Network Info</th>
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>Network</th>

                <td class="words">{{ getNetworkType }}</td>
              </tr>

              <tr class="info-row">
                <th>Peers</th>

                <td class="number">{{ getNumConnections }}</td>
              </tr>

              <tr class="info-row">
                <th>Protocol Version</th>

                <td class="number">{{ getProtocolVersion }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col s6">
        <div class="info-block table-container">
          <table class="main-table card z-depth-2">
            <thead>
              <tr>
                <th colspan="2">MasterNode Info</th>
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>Masternodes</th>

                <td class="number">{{ getNumMasternodes }}</td>
              </tr>

              <tr class="info-row">
                <th>Staking Status</th>

                <td class="words">
                  <i
                    :class="[
                      getStakingStatus
                        ? 'far fa-check-circle'
                        : 'far fa-times-circle'
                    ]"
                  ></i>
                </td>
              </tr>

              <tr class="info-row">
                <th>MN Sync Status</th>

                <td class="words">
                  <i
                    :class="[
                      getMsyncStatus
                        ? 'far fa-check-circle'
                        : 'far fa-times-circle'
                    ]"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import moment from 'moment';

export default {
  name: 'Information',

  computed: {
    ...Vuex.mapGetters([
      'daemonVersion',
      'dataDir',
      'getNetworkType',
      'getNetworkVersion',
      'getNumConnections',
      'getNumMasternodes',
      'getBlocks',
      'getMoneySupply',
      'getProtocolVersion',
      'getTxCount',
      'walletVersion',
      'getStakingStatus',
      'getMsyncStatus',
      'getChainSyncStatus'
    ])
  },

  methods: {
    ...Vuex.mapActions([
      'updateBlocks',
      'walletInfo',
      'updateInfo',
      'updateStakingStatus',
      'updateNumMasternodes',
      'updateChainSyncStatus'
    ]),

    formatNetworkVersion: function(version) {
      let majorVersion = parseInt(version.toString().slice(0, 1));
      majorVersion = (majorVersion === 0 ? 0 : majorVersion);
      let minorVersion = parseInt(version.toString().slice(1, 3));
      minorVersion = (minorVersion === 0 ? 0 : minorVersion);
      let revisionVersion = parseInt(version.toString().slice(3, 5));
      revisionVersion = (revisionVersion === 0 ? 0 : revisionVersion);
      let buildVersion = parseInt(version.toString().slice(5, 7));
      buildVersion = (buildVersion === 0 ? 0 : buildVersion);

      return majorVersion + "." + minorVersion + "." + revisionVersion + "." + buildVersion;
    }
  },

  created() {
    this.blockCount = this.getBlocks;

    this.walletInfo();
    this.updateInfo();
    this.updateStakingStatus();
    this.updateNumMasternodes();
    this.updateChainSyncStatus();

    this.timeout = setInterval(
      function() {
        this.walletInfo();
        this.updateInfo();
        this.updateStakingStatus();
        this.updateNumMasternodes();
        this.updateChainSyncStatus();

        if (this.blockCount !== this.getBlocks) {
          this.blockCount = this.getBlocks;
          this.lastBlockTime = moment().format('MMM Do YYYY, h:mm:ss a');
        }
      }.bind(this),
      3000
    );
  },

  data() {
    return {
      timeout: 0,
      blockCount: 0,
      lastBlockTime: moment().format('MMM Do YYYY, h:mm:ss a')
    };
  },

  destroyed() {
    clearInterval(this.timeout);
  }
};
</script>
