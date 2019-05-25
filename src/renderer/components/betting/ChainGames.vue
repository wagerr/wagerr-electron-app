<template>
  <div id="chain-games" class="">
    <div class="row chain-container content">
      <div class="row cg-lotto-info card z-depth-2">
        <div class="lotto-left col s4">
          <i
            class="far fa-question-circle pull-right modal-trigger chain-info"
            data-target="lotto-info"
          ></i>

          <h2 class=""><span></span>Lotto Jackpot</h2>

          <div class="cg-dates text-center clearfix">
            <h6>Game Start:</h6>
            {{ gameStartTime | moment('MMM Do YYYY hh:mm A') }}
            <h6>Game End:</h6>
            {{ gameEndTime | moment('MMM Do YYYY hh:mm A') }}
          </div>

          <div class="bet-slip-options text-center clearfix chain-btns">
            <button
              class="waves-effect waves-light btn-large wagerr-red-bg pulse"
              @click="placeCGLottoBet"
            >
              Buy Ticket
            </button>
          </div>
        </div>
        <div class="lotto-right col s8">
          <!-- Lotto Info Modal -->
          <CGLottoInfo></CGLottoInfo>

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
              <h6>Potential Winnings</h6>

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
              <h6>Entrants</h6>

              <div v-if="loadingCGEvent">
                <spinner></spinner>
              </div>

              <div v-else class="cg-info">{{ noOfEntrants }}</div>
            </div>

            <div class="col s4 text-center stats">
              <h6>Entry</h6>

              <div v-if="loadingCGEvent">
                <spinner></spinner>
              </div>

              <div v-else class="cg-info">{{ entryFee }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-container">
        <h4>CG Lotto Bet History</h4>

        <c-g-lotto-bet-transaction-list></c-g-lotto-bet-transaction-list>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import wagerrRPC from '@/services/api/wagerrRPC';
import Spinner from '@/components/utilities/LoadingSpinner';
import CGLottoBetTransactionList from '@/components/betting/components/CGLottoBetTransactionList';
import CGLottoInfo from '@/components/betting/components/CGLottoInfo';

export default {
  name: 'CGLottoBets',
  components: { CGLottoBetTransactionList, CGLottoInfo, Spinner },

  beforeCreate: function() {
    document.body.className = 'lotto';
  },

  computed: {
    ...Vuex.mapGetters([
      'loadingCGEvent',
      'loadingCGDetails',
      'noOfEntrants',
      'entryFee',
      'gameID',
      'getNetworkType',
      'potSize',
      'gameStartBlock',
      'gameStartTime',
      'gameEndTime'
    ])
  },

  methods: {
    ...Vuex.mapActions(['listChainGamesEvents']),

    // Place a bet on the given event and sent the tx to the Wagerr blockchain.
    placeCGLottoBet: function() {
      let entryFeeInt = parseInt(100);

      wagerrRPC.client
        .placeChainGamesBet(this.gameID, entryFeeInt)
        .then(function(resp) {
          // If bet was successful then display bet TX-ID to the user.
          if (resp.error !== 'null') {
            M.toast({
              html:
                '<span class="toast__bold-font">Success &nbsp;</span> your bet has been placed: ' +
                resp.result,
              classes: 'green'
            });
          }

          // If bet was unsuccessful then show error to the user.
          else {
            M.toast({
              html:
                '<span class="toast__bold-font">Error &nbsp;</span> ' +
                resp.result,
              classes: 'wagerr-red-bg'
            });
          }
        })
        .catch(function(err) {
          // TODO Parse the error from the response.
          M.toast({ html: err, classes: 'wagerr-red-bg' });
          console.error(err);
        });
    },
    getCGWinnings(potAmount, rewardType) {
      let winningPercent = 0.8;
      let masternodePercent = 0.02;
      let burnPercent = 0.18;
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

  created() {
    this.listChainGamesEvents();

    this.timeout = setInterval(
      function() {
        this.listChainGamesEvents();
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
    clearTimeout(this.timeout);
  }
};
</script>
