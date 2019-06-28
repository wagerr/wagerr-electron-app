<template>
  <div id="information">
    <h4>Address Book</h4>

    <div>
      <button>Receiving Addresses</button>
      <button>Sending Addresses</button>
    </div>

    <div class="row text-center">
      <div class="col s6">
        <div class="info-block table-container">
          <table class="main-table card z-depth-2">
            <thead>
              <tr>
                <th colspan="2">Account 1</th> <!-- (NOTE: this value comes from `listaccounts`) -->
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>
                  <input placeholder="(no label)" /> <!-- (NOTE: labels will be stored locally using `electron-store`) -->
                </th>

                <td class="number">TDvE6m3qJuzK7G8VWPdcTbMoCaUD5kngXL</td> <!-- (NOTE: these address values come from `getaddressesbyaccount "account_name"`) -->
              </tr>

              <tr class="info-row">
                <th>Betting Address</th> <!-- (NOTE: labels will be stored locally using `electron-store`) -->

                <td class="number">THL61Zp2fiGxjvSiL4RjQM3LbouGPVngX1</td> <!-- (NOTE: these address values come from `getaddressesbyaccount "account_name"`) -->
              </tr>

              <tr class="info-row">
                <th>Income Address</th> <!-- (NOTE: labels will be stored locally using `electron-store`) -->

                <td class="number">TMX7efs82591Wi4dsM8tvsk5VocPYW6aRA</td> <!-- (NOTE: these address values come from `getaddressesbyaccount "account_name"`) -->
              </tr>
            </tbody>
          </table>

          <table class="main-table card z-depth-2">
            <thead>
              <tr>
                <th colspan="2">Account 2</th> <!-- (NOTE: this value comes from `listaccounts`) -->
              </tr>
            </thead>

            <tbody>
              <tr class="info-row">
                <th>
                  <input placeholder="(no label)" /> <!-- (NOTE: labels will be stored locally using `electron-store`) -->
                </th>

                <td class="number">TDvE6m3qJuzK7G8VWPdcTbMoCaUD5kngXL</td> <!-- (NOTE: these address values come from `getaddressesbyaccount "account_name"`) -->
              </tr>

              <tr class="info-row">
                <th>Betting Address</th> <!-- (NOTE: labels will be stored locally using `electron-store`) -->

                <td class="number">THL61Zp2fiGxjvSiL4RjQM3LbouGPVngX1</td> <!-- (NOTE: these address values come from `getaddressesbyaccount "account_name"`) -->
              </tr>

              <tr class="info-row">
                <th>Income Address</th> <!-- (NOTE: labels will be stored locally using `electron-store`) -->

                <td class="number">TMX7efs82591Wi4dsM8tvsk5VocPYW6aRA</td> <!-- (NOTE: these address values come from `getaddressesbyaccount "account_name"`) -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import Store from 'electron-store';

export default {
  name: 'AddressBook'
};
</script>
