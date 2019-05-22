<template>
  <div class="page-masternodes">
    <div class="col-title">
      <span class="masternode-title">{{ $t('masternode.masternode') }}</span>
      <default-button class="setup-button" @click="gotoSettingsMasternode">{{
        $t('masternode.setup_masternode')
      }}</default-button>
    </div>
    <el-table
      ref="myTable"
      @current-change="handleCurrentChange"
      row-key="pubkey"
      max-height="550"
      :data="masternodesRows"
      highlight-current-row
      header-row-class-name="el-table-masternodes-header"
      class="el-table-masternodes"
      row-class-name="table-recent-transactions-row"
      style="width: 100%"
    >
      <el-table-column
        class-name="col-alias"
        :label="this.$t('masternode.table_alias')"
        prop="alias"
        width="225"
      ></el-table-column>
      <el-table-column
        prop="address"
        :label="this.$t('masternode.table_address')"
      ></el-table-column>
      <el-table-column
        prop="status"
        :label="this.$t('masternode.table_status')"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="active"
        :label="this.$t('masternode.table_active')"
        width="140"
      ></el-table-column>
    </el-table>
    <div class="button-container">
      <default-button @click="onStartMasternodeAlias">{{
        this.$t('masternode.start_alias')
      }}</default-button>
      <default-button @click="onStartMasternodeMany">{{
        this.$t('masternode.start_many')
      }}</default-button>
      <default-button @click="onStartMasternodeMissing">{{
        this.$t('masternode.start_missing')
      }}</default-button>
      <default-button @click="getMasternodeStatus">{{
        this.$t('masternode.update_status')
      }}</default-button>
    </div>
    <!-- Wallet Unlock -->
    <unlock-dialog
      v-bind:isVisible.sync="isUnlockWalletWindowOpen"
      v-on:unlock="onWalletUnlock"
      :unlock-time="5"
      :toggleMenuLock="false"
      :show-staking-only="false"
    ></unlock-dialog>
  </div>
</template>
<script src="./Masternodes.js"></script>
<style src="./Masternodes.scss" lang="scss" scoped></style>
