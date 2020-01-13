import ElectronStore from 'electron-store';
import { guessLanguageLocale, guessFormatLocale } from '../i18n/i18nHelpers';

// Abstraction class for the ElectronStore library
// It takes the network (testnet/mainnet) in consideration
// Also sets the language and formatting (dates, times, numbers ) of the app in case it has never been set before
class Store {
  constructor() {
    this._isTestnet = null;
    this._preferences = null;
    this._addressBook = null;
  }
  
  async initialize(_isTestnet) {
    if (typeof _isTestnet !== 'boolean') {
      throw new Error(`Store.initialize() parameter '_isTestnet' must be a boolean.`);
    }

    this._isTestnet = _isTestnet;

    const storeNameSuffix = this._isTestnet ? '_testnet' : '';

    this._preferences = new ElectronStore({
      name: `preferences${storeNameSuffix}`
    });
    this._addressBook = new ElectronStore({
      name: `address_book${storeNameSuffix}`
    });

    if (!this._preferences.has('languageLocale')) {
      this._preferences.set('languageLocale', await guessLanguageLocale());
    }

    if (!this._preferences.has('formatLocale')) {
      this._preferences.set('formatLocale', await guessFormatLocale());
    }
  }

  get preferences() {
    this._isInitialized();
    return this._preferences;
  }
  
  get addressBook() {
    this._isInitialized();        
    return this._addressBook;
  }

  _isInitialized() {
    if (this._isTestnet === null) {
      throw new Error('Store class instance has not been initialized.');
    }
  }  
}

export default new Store();
