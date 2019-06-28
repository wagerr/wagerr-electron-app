import wagerrRPC from '@/services/api/wagerrRPC';

export default {
  getListAccounts() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .listaccounts()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getAddressesByAccount(account) {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getaddressesbyaccount(account)
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  }
};
