<template>
  <div class="second-nav betting-types">
    <h5>Betting Types</h5>
    <ul class="row">
      <router-link class="col s4" tag="li" to="/betting/peerless">
        <a>Peerless</a>
      </router-link>

      <router-link class="col s4" tag="li" to="/betting/chain_games">
        <a>Chain Games</a>
      </router-link>

      <router-link class="col s4" tag="li" to="/betting/h2h">
        <a>Head to Head</a>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'bettingNav'
};
</script>
