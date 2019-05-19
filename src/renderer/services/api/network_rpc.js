import wagerrRPC from '@/services/api/wagerrRPC';

export default {
  getNetworkInfo() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getNetworkInfo()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getPeerInfo() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getPeerInfo()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getBannedInfo() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .listBanned()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getInfo() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getInfo()
        .then(function(resp) {
          resolve(resp);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getStakingStatus() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getStakingStatus()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  },

  getMasterNodeNum() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getMasternodeCount()
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
