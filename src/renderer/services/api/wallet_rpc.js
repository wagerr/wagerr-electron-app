import wagerrRPC from '@/services/api/wagerrRPC';

export default {
  getBalance() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getBalance()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getExtendedBalance() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getExtendedBalance()
        .then(function(resp) {
          resolve(resp);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getTransaction(tx_id) {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getTransaction(tx_id)
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getWalletInfo() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getWalletInfo()
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
