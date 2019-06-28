import ElectronStore from 'electron-store';

const preferencesStore = new ElectronStore({
  name: `preferences`
});
const addressBookStore = new ElectronStore({
  name: `address_book`
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
