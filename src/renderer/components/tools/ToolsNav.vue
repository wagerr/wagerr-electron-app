<template>
  <div class="second-nav tools-types">
    <h5>{{ $t('Tools & Info') }}</h5>
    <ul class="row">
      <router-link class="col s4" tag="li" to="/tools/info">
        <a>{{ $t('Info') }}</a>
      </router-link>

      <router-link class="col s4" tag="li" to="/tools/peers">
        <a>{{ $t('Peers') }}</a>
      </router-link>

      <router-link class="col s4" tag="li" to="/tools/address_book" exact>
        <a>{{ $t('Address Book') }}</a>
      </router-link>

      <router-link class="col s4" tag="li" to="/tools/masternode_setup">
        <a>{{ $t('Masternode Setup') }}</a>
      </router-link>

      <router-link
        class="col s4"
        tag="li"
        to="/tools/sign_verify_message"
        exact
      >
        <a>{{ $t('Sign/Verify Message') }}</a>
      </router-link>

      <router-link class="col s4" tag="li" to="/tools/wallet_repair">
        <a>{{ $t('Wallet Repair') }}</a>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ToolsNav'
};
</script>
