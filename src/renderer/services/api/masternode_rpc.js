import wagerrRPC from '@/services/api/wagerrRPC';

export default {
  getMasternodeCount() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getMasternodeCount()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });
  },

  getMNSyncStatus() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .mnSync('status')
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });
  }
};
