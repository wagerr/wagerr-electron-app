<template>
  <div class="second-nav tools-types">
    <h5>Tools &amp; Info</h5>
    <ul class="row">
      <router-link class="col s4" tag="li" to="/tools/info">
        <a>Info</a>
      </router-link>

      <router-link class="col s4" tag="li" to="/tools/peers">
        <a>Peers</a>
      </router-link>

      <router-link class="col s4" tag="li" to="/tools/wallet_repair">
        <a>Wallet Repair</a>
      </router-link>

      <li class="col s4">
        <a href="#" @click="onOpenConf">Wagerr.Conf</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { getWagerrConfPath } from '../../../main/blockchain/blockchain';
import { shell } from 'electron';
const fs = require('fs');
const path = require('path');

export default {
  name: 'ToolsNav',
  data() {
    return {
      confPath: getWagerrConfPath()
    };
  },
  computed: {},
  created() {},
  methods: {
    onOpenConf: function() {
      shell.openItem(this.confPath);
    }
  }
};
</script>
