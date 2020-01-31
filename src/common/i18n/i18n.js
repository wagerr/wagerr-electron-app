import VueI18n from 'vue-i18n';
import Vue from 'vue';
import localeMessages from '../locales/index';
import { FORMAT_LOCALES } from '../constants/constants';

// Vue-i18n doc: https://kazupon.github.io/vue-i18n/
// Wagerr Electron App offers the same format locales (date, times and numbers) as momentjs library.
// To translate text we rely on the vue-i18n library
// To format numbers we use vue-i18n library, that relies in the Intl javascript object (we pass getFormatLocale in every call)
// To format dates and times we use momentjs

// We create the numbers format object for each format locale offered by momentjs to pass it to vue-i18n
let numberFormats = FORMAT_LOCALES.reduce((acc, current) => {
  acc[current.code] = {
    integer: {
      maximumFractionDigits: 0,
    },
    decimal: {
      maximumFractionDigits: 4
    },
    decimalShort: {
      maximumFractionDigits: 2
    }
  }

  return acc;
}, {});

// Vue-i18n configuration object
// Check library documentation for more config options
  const vueI18nConfig = {  
  // fallback language when translation is not available
  fallbackLocale: 'en',
  formatFallbackMessages: true,
  // set locale messages,
  messages: localeMessages,
  // we pass the getFormatLocale every time we format a number
  numberFormats
}

Vue.use(VueI18n);
export default new VueI18n(vueI18nConfig);