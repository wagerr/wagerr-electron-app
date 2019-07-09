import ElectronStore from 'electron-store';
import network from '@/store/modules/network';

const electronPrefix = network.getNetworkType === 'Testnet' ? '_testnet' : '';
const preferencesStore = new ElectronStore({
  name: `preferences${electronPrefix}`
});
const addressBookStore = new ElectronStore({
  name: `address_book${electronPrefix}`
});

export const addressBook = {
  set(key, val) {
    return addressBookStore.set(key, val);
  },
  get(key) {
    return addressBookStore.get(key);
  },
  has(key) {
    return addressBookStore.has(key);
  }
};

export const preferences = {
  set(key, val) {
    return preferencesStore.set(key, val);
  },
  get(key) {
    return preferencesStore.get(key);
  },
  has(key) {
    return preferencesStore.has(key);
  }
};
