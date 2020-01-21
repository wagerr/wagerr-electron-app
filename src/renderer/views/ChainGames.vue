<template>
  <div id="chain-games" class="">
    <div class="row chain-container content">
      <div class="row cg-lotto-info card z-depth-2">
        <div class="lotto-left col s4">
          <i
            class="far fa-question-circle pull-right modal-trigger chain-info"
            data-target="lotto-info"
          ></i>

          <!-- Lotto Info Modal -->
          <LottoInfoModal></LottoInfoModal>

          <h2 class=""><span></span>Lotto Jackpot</h2>

          <div class="cg-dates text-center clearfix">
            <h6>Game Start:</h6>
            {{ loadingCGEvent ? '-' : getLottoStartTime() }}
            <h6>Game End:</h6>
            {{ loadingCGEvent ? '-' : getLottoEndTime() }}
          </div>

          <div class="bet-slip-options text-center clearfix chain-btns">
            <button
              class="waves-effect waves-light btn-large wagerr-red-bg modal-trigger"
              data-target="confirm-lotto-entry"
              v-bind:class="{ disabled: loadingCGEvent }"
            >
              Buy Ticket
            </button>

            <!-- Confirm Lotto Entry Modal -->
            <ConfirmLottoEntryModal></ConfirmLottoEntryModal>

            <span class="cost">
              (Entry Fee: {{ entryFee }}
              <span class="currency">
                {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
              </span>
              )
            </span>
          </div>
        </div>
        <div class="lotto-right col s8">
          <div v-if="loadingCGEvent" class="text-center">
            <spinner></spinner>
          </div>

          <div v-else class="cg-jackpot text-center">
            <h3>Current Jackpot</h3>
            {{ potSize }}
            <span class="currency">{{
              getNetworkType === 'Testnet' ? 'tWGR' : 'WGR'
            }}</span>
          </div>

          <div class="all-stats">
            <div class="col s4 text-center stats">
              <h6>Winner's Prize</h6>

              <div v-if="loadingCGEvent">
                <spinner></spinner>
              </div>

              <div v-else class="cg-info">
                {{ getCGWinnings(potSize, 'bet') }}
                <span class="currency">{{
                  getNetworkType === 'Testnet' ? 'tWGR' : 'WGR'
                }}</span>
              </div>
            </div>

            <div class="col s4 text-center  stats">
              <h6>Masternode Reward</h6>

              <div v-if="loadingCGEvent">
                <spinner></spinner>
              </div>

              <div v-else class="cg-info">
                {{ getCGWinnings(potSize, 'masternode') }}
                <span class="currency">{{
                  getNetworkType === 'Testnet' ? 'tWGR' : 'WGR'
                }}</span>
              </div>
            </div>

            <div class="col s4 text-center stats">
              <h6>Burn</h6>

              <div v-if="loadingCGEvent">
                <spinner></spinner>
              </div>

              <div v-else class="cg-info">
                {{ getCGWinnings(potSize, 'burn') }}
                <span class="currency">{{
                  getNetworkType === 'Testnet' ? 'tWGR' : 'WGR'
                }}</span>
              </div>
            </div>
          </div>

          <div class="all-stats bottom-row">
            <div class="col s4 text-center stats">
              <h6>Lotto ID</h6>

              <div v-if="loadingCGEvent">
                <spinner></spinner>
              </div>

              <div v-else class="cg-info">{{ gameID }}</div>
            </div>

            <div class="col s4 text-center  stats">
              <h6>Tickets Sold</h6>

              <div v-if="loadingCGEvent">
                <spinner></spinner>
              </div>

              <div v-else class="cg-info">{{ noOfEntrants }}</div>
            </div>

            <div class="col s4 text-center stats">
              <h6>Ticket Price</h6>

              <div v-if="loadingCGEvent">
                <spinner></spinner>
              </div>

              <div v-else class="cg-info">
                {{ entryFee }}
                <span class="currency">
                  {{ getNetworkType === 'Testnet' ? 'tWGR' : 'WGR' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-container">
        <h4>CG Lotto Bet History</h4>

        <ChainGamesTransactionHistory></ChainGamesTransactionHistory>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import ChainGamesTransactionHistory from '@/components/ChainGames/ChainGamesTransactionHistory';
import ConfirmLottoEntryModal from '@/components/ChainGames/ConfirmLottoEntryModal.vue';
import LottoInfoModal from '@/components/ChainGames/LottoInfoModal';
import Spinner from '@/components/utilities/LoadingSpinner';

export default {
  name: 'ChainGames',

  components: {
    ChainGamesTransactionHistory,
    ConfirmLottoEntryModal,
    LottoInfoModal,
    Spinner
  },

  data() {
    return {
      listChainGamesEventsIID: 0
    };
  },

  computed: {
    ...mapGetters([
      'loadingCGEvent',
      'noOfEntrants',
      'entryFee',
      'gameID',
      'getNetworkType',
      'potSize',
      'gameStartTime',
      'gameEndTime'
    ])
  },

  methods: {
    ...mapActions(['listChainGamesEvents']),

    getLottoStartTime: function() {
      return moment.unix(this.gameStartTime).format('MMM Do YYYY hh:mm A');
    },

    getLottoEndTime: function() {
      return moment.unix(this.gameEndTime).format('MMM Do YYYY hh:mm A');
    },

    getCGWinnings(potAmount, rewardType) {
      const winningPercent = 0.8;
      const masternodePercent = 0.02;
      const burnPercent = 0.18;

      switch (rewardType) {
        case 'bet':
          return potAmount * winningPercent;
        case 'masternode':
          return potAmount * masternodePercent;
        case 'burn':
          return potAmount * burnPercent;
      }
    }
  },

  mounted() {
    this.$initMaterialize();
    this.listChainGamesEvents();

    this.listChainGamesEventsIID = setInterval(
      function() {
        this.listChainGamesEvents();
      }.bind(this),
      60000
    );
  },

  destroyed() {
    clearInterval(this.listChainGamesEventsIID);
  }
};
</script>
