<template>
  <div id="preferences" class="content row">
    <div class="col s12">
      <h4>{{ $t('Preferences') }}</h4>

      <div class="row text-center">
        <div class="col s12">
          <div class="preferences-block table-container">
            <table class="main-table card z-depth-2">
              <tbody>
                <tr class="info-row">
                  <td>{{ $t('Odds Display') }}</td>
                  <td class="aligncenter">
                    <div class="inline">
                        <p>
                          <label>
                            <input
                              name="oddsFormat"
                              type="radio"
                              id="odds_choice_decimal"
                              :value="getOddsFormats.decimal"
                              @change="changeOddsFormat"
                              :checked="
                                oddsFormatChecked(getOddsFormats.decimal)
                              "
                            />
                            <span>{{ $t('Decimal') }}</span>
                          </label>
                        </p>
                        <p>
                          <label>
                            <input
                              name="oddsFormat"
                              type="radio"
                              id="odds_choice_fraction"
                              :value="getOddsFormats.fraction"
                              @change="changeOddsFormat"
                              :checked="
                                oddsFormatChecked(getOddsFormats.fraction)
                              "
                            />
                            <span>{{ $t('Fraction') }}</span>
                          </label>
                        </p>
                        <p>
                          <label>
                            <input
                              name="oddsFormat"
                              type="radio"
                              id="odds_choice_american"
                              :value="getOddsFormats.american"
                              @change="changeOddsFormat"
                              :checked="
                                oddsFormatChecked(getOddsFormats.american)
                              "
                            />
                            <span>{{ $t('American') }}</span>
                          </label>
                        </p>
                      <br />
                    </div>
                  </td>
                </tr>
                <tr class="info-row">
                  <td>
                    {{ $t('Language') }}
                  </td>
                  <td class="aligncenter">
                    <select
                      class="browser-default preference"
                      @change="changeLanguageLocale"
                    >
                        <option
                          v-for="language in languageLocales"
                          :selected="language.code === getLanguageLocale"
                          :key="language.code"
                          :value="language.code"
                        >
                          {{ language.name }}
                        </option>
                    </select>
                  </td>
                </tr>
                <tr class="info-row">
                  <td>
                    {{ $t('Formats') }}
                    <small>
                      {{ $t('(Dates, times and numbers)') }}
                    </small>
                  </td>
                  <td class="aligncenter">
                    <select
                      class="browser-default preference"
                      @change="changeFormatLocale"
                    >
                        <option
                          v-for="format in formatLocales"
                          :selected="format.code === getFormatLocale"
                          :key="format.code"
                          :value="format.code"
                        >
                          {{ format.name }}
                        </option>
                    </select>
                    <p class="locale-formats">
                      <small>
                        <span class="format-subject">
                          {{ $t('Dates and Times:') }}
                        </span>
                        {{ new Date() | moment('LLL') }}
                        &nbsp; &nbsp;
                        <span class="format-subject">
                          {{ $t('Numbers:') }}
                        </span>
                        {{ $n(9999.99, 'decimal', getFormatLocale)}}
                      </small>
                    </p>
                  </td>
                </tr>
                <tr class="info-row">
                  <td>{{ $t('Timezone') }}</td>
                  <td class="aligncenter">
                    <div class="inline">
                        <p>
                          <label>
                            <input
                              name="timezoneOption"
                              type="radio"
                              value="auto"
                              @change="changeTimezoneOption"
                              :checked="getTimezoneOption === 'auto'"
                            />
                            <span>{{ $t('Auto-detect') }}</span>
                          </label>
                        </p>
                        <p>
                          <label>
                            <input
                              name="timezoneOption"
                              type="radio"
                              value="fixed"
                              @change="changeTimezoneOption"
                              :checked="getTimezoneOption === 'fixed'"
                            />
                            <span>{{ $t('Fixed') }}</span>
                          </label>
                        </p>
                        <select
                          class="browser-default preference"
                          :disabled="getTimezoneOption === 'auto'"
                          @change="changeTimezone"
                        >
                          <option v-for="tz in timezones" :selected="tz === getTimezone" :key="tz">
                            {{ tz }}
                          </option>
                        </select>
                      <br />
                    </div>
                  </td>
                </tr>
                <tr class="info-row">
                  <td>
                    {{ $t('Include Wagerr network share in betting odds? (Experimental)') }}
                  </td>
                  <td class="aligncenter">
                    <div id="show-network-share-choice">
                      <p>
                        <label>
                          <input
                            name="showNetworkShare"
                            type="checkbox"
                            id="showNetworkShare"
                            :value="getShowNetworkShare"
                            @change="toggleShowNetworkShare"
                            :checked="getShowNetworkShare"
                          />
                          <span style="padding-left: 0px;"></span>
                        </label>
                      </p>
                      <br />
                    </div>
                  </td>
                </tr>
                <tr class="info-row">
                  <td>{{ $t('Open wagerr.conf file') }}</td>

                  <button class="btn" @click="onOpenConf">{{ $t('Open') }}</button>
                </tr>
                <tr class="info-row">
                  <td>{{ $t('Backup wallet') }}</td>

                  <button class="btn" @click="backupWallet">{{ $t('Export') }}</button>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { remote, shell } from 'electron';
import Store from 'electron-store';
import { mapGetters, mapActions } from 'vuex';
import wagerrRPC from '@/services/api/wagerrRPC';
import { getWagerrConfPath } from '../../main/blockchain/blockchain';
import moment from 'moment';
import { FORMAT_LOCALES_I18N } from '../constants/constants';
import { LANGUAGE_LOCALES } from '../../common/constants/constants';
import ipcRenderer from '../../common/ipc/ipcRenderer';

export default {
  name: 'Preferences',

  data: function() {
    return {
      confPath: getWagerrConfPath()
    };
  },

  computed: {
    ...mapGetters([
      'getLanguageLocale',
      'getFormatLocale',
      'getOddsFormats',
      'getOddsFormat',
      'getTimezoneOption',
      'getTimezone',
      'getShowNetworkShare'
    ]),
    languageLocales: () => LANGUAGE_LOCALES,
    formatLocales: () => FORMAT_LOCALES_I18N(),
    timezones: function() {
      return moment.tz.names();
    }
  },

  methods: {
    ...mapActions(['updateOddsFormat', 'toggleShowNetworkShare']),

    changeOddsFormat: function(event) {
      this.$store.dispatch('updateOddsFormat', Number(event.target.value));
    },

    changeTimezoneOption: function(event) {
      const timezoneOption = event.target.value;
      this.$store.dispatch('updateTimezoneOption', timezoneOption);

      if (timezoneOption === 'auto') {
        this.$store.dispatch('updateTimezone', moment.tz.guess());
      } else if (timezoneOption === 'fixed') {
        this.$store.dispatch('updateTimezone', this.getTimezone);
      }
    },

    changeTimezone: function(event) {
      const newTimezone = event.target.value;
      this.$store.dispatch('updateTimezone', newTimezone);
    },

    changeLanguageLocale: function(event) {
      let lang = event.target.value;

      // Change language in main process
      ipcRenderer.changeLanguage(lang);
      // Save new language preference in the store
      this.$store.dispatch('updateLanguageLocale', {languageLocale: lang, vm: this});
    },

    changeFormatLocale: function(event) {
      const format = event.target.value;
      this.$store.dispatch('updateFormatLocale', {formatLocale: format});
    },

    oddsFormatChecked: function(format) {
      return format == this.getOddsFormat;
    },

    onOpenConf: function() {
      shell.openItem(this.confPath);
    },

    backupWallet: function() {
      let folderPath = remote.dialog.showOpenDialog({
        title: 'Backup Wallet.dat file.',
        buttonLabel: 'Select Folder',
        properties: ['openDirectory'],
        buttons: ['Confirm', 'Cancel'],
        cancelId: 1,
        defaultId: 0
      });

      if (folderPath) {
        wagerrRPC.client
          .backupWallet(folderPath)
          .then(function(resp) {
            console.log(resp);
            M.toast({
              html:
                '<span class="toast__bold-font">Success &nbsp;</span> Wallet backup up located here: ' +
                folderPath,
              classes: 'green'
            });
          })
          .catch(function(err) {
            M.toast({ html: err, classes: 'wagerr-red-bg' });
            console.log(err);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';

.preferences-block {
  table {
    thead {
      th {
        text-align: center;
        font-size: 18px;
      }
    }

    tbody {
      th {
        padding: 10px 15px;
        font-size: 15px;
        line-height: 20px;
        vertical-align: top;
        white-space: nowrap;
      }

      td {
        padding: 10px 15px !important;
        font-size: 14px;
        line-height: 20px;
        vertical-align: top;
        #show-network-share-choice span.isActive {
          text-decoration: none;
        }
        #show-network-share-choice span {
          text-decoration: line-through;
        }
        .locale-formats {
          margin-top: 5px;
          margin-bottom: 0px;
          font-weight: normal;
          .format-subject {
            color: #666
          }
        }
      }
    }
  }
  .aligncenter {
    text-align: center;
  }

  button {
    margin: 5px;
  }
  [type='radio'] + span {
    padding-left: 30px !important;
  }
  [type='radio']:checked + span {
    color: $wagerr-red;
  }
  [type='radio']:checked + span:after {
    background-color: $wagerr-red;
    border: 2px solid $wagerr-red;
  }

  [type='checkbox']:checked + span:not(.lever):before {
    border-right: 2px solid $wagerr-red;
    border-bottom: 2px solid $wagerr-red;
  }
  div.inline p {
    display: inline-block;
    padding: 0 10px;
  }
  select.preference {
    max-width: 300px;
    margin: auto;
  }
}
</style>
