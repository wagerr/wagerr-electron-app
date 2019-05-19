import wagerrRPC from '@/services/api/wagerrRPC';

export default {
  getBlockchainInfo() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getBlockchainInfo()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getBlockInfo(blockHash) {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getBlock(blockHash)
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getBlockCount() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getBlockCount()
        .then(function(resp) {
          resolve(resp);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  }
};
