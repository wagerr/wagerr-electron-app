<template>
  <div class="second-nav betting-types">
    <h5>Betting Types</h5>
    <ul class="row">
      <li class="col s4">
        <router-link to="/betting/peerless">Peerless</router-link>
      </li>

      <li class="col s4">
        <router-link to="/betting/chain_games">Chain Games</router-link>
      </li>

      <li class="col s4">
        <router-link to="/betting/h2h">Head to Head</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'bettingNav'
};
</script>
