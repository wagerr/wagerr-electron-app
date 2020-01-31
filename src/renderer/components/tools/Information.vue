<template>
  <div id="information">
    <h4 v-html="$t('Wagerr Wallet &amp; Network Info')"></h4>

    <div class="row text-center">
      <div class="col s6">
        <div class="info-block table-container">
          <table class="main-table card z-depth-2">
            <thead>
              <tr>
                <th colspan="2">{{ $t('Wallet Info') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="info-row">
                <th>{{ $t('Wallet Version') }}</th>

                <td class="number">{{ walletVersion }}</td>
              </tr>

              <tr class="info-row">
                <th>{{ $t('Daemon Version') }}</th>

                <td class="number">
                  {{ formatNetworkVersion(getNetworkVersion) }}
                </td>
              </tr>

              <tr class="info-row">
                <th>{{ $t('Transactions') }}</th>

                <td class="number">{{ $n(getTxCount, 'integer') }}</td>
              </tr>

              <tr class="info-row">
                <th>{{ $t('DataDir') }}</th>

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
                <th colspan="2">{{ $t('Blockchain Info') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>{{ $t('Block Count') }}</th>
                <td class="number">{{ $n(getBlocks, 'integer') }}</td>
              </tr>

              <tr class="info-row">
                <th>{{ $t('Last Block') }}</th>
                <td class="date">{{ this.lastBlockTime }}</td>
              </tr>

              <tr class="info-row">
                <th>{{ $t('Money Supply') }}</th>
                <td class="number">{{ $n(getMoneySupply, 'decimalShort') }}</td>
              </tr>

              <tr class="info-row">
                <th>{{ $t('Blockchain Synced') }}</th>
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
                <th colspan="2">{{ $t('Network Info') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>{{ $t('Network') }}</th>

                <td class="words">{{ getNetworkType }}</td>
              </tr>

              <tr class="info-row">
                <th>{{ $t('Peers') }}</th>

                <td class="number">{{ $n(getNumConnections, 'integer') }}</td>
              </tr>

              <tr class="info-row">
                <th>{{ $t('Protocol Version') }}</th>

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
                <th colspan="2">{{ $t('MasterNode Info') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>{{ $t('Masternodes') }}</th>

                <td class="number">{{ $n(getNumMasternodes, 'integer') }}</td>
              </tr>

              <tr class="info-row">
                <th>{{ $t('Staking Status') }}</th>

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
                <th>{{ $t('MN Sync Status') }}</th>

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
      majorVersion = majorVersion === 0 ? 0 : majorVersion;
      let minorVersion = parseInt(version.toString().slice(1, 3));
      minorVersion = minorVersion === 0 ? 0 : minorVersion;
      let revisionVersion = parseInt(version.toString().slice(3, 5));
      revisionVersion = revisionVersion === 0 ? 0 : revisionVersion;
      let buildVersion = parseInt(version.toString().slice(5, 7));
      buildVersion = buildVersion === 0 ? 0 : buildVersion;

      return (
        majorVersion +
        '.' +
        minorVersion +
        '.' +
        revisionVersion +
        '.' +
        buildVersion
      );
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
          // TODO this just shows current date, not last block time
          this.lastBlockTime = moment().format('lll');
        }
      }.bind(this),
      3000
    );
  },

  data() {
    return {
      timeout: 0,
      blockCount: 0,
      lastBlockTime: moment().format('lll')
    };
  },

  destroyed() {
    clearInterval(this.timeout);
  }
};
</script>
