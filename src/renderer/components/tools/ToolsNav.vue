<template>
  <div class="second-nav tools-types">
    <h5>Tools &amp; Info</h5>
    <ul class="row">
      <li class="col s4">
        <router-link to="/tools/info">Info</router-link>
      </li>

      <li class="col s4">
        <router-link to="/tools/peers">Peers</router-link>
      </li>

      <li class="col s4">
        <router-link to="/tools/address_book" exact>Address Book</router-link>
      </li>

      <li class="col s4">
        <router-link to="/tools/masternode_setup">Masternode Setup</router-link>
      </li>

      <li class="col s4">
        <router-link to="/tools/sign_verify_message" exact>Sign/Verify Message</router-link>
      </li>

      <li class="col s4">
        <router-link to="/tools/wallet_repair">Wallet Repair</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ToolsNav'
};
</script>
