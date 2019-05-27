import wagerrRPC from '@/services/api/wagerrRPC';
import { getCoinMasternodeConfPath } from '../../../main/blockchain/blockchain';
import fs from 'fs';

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
  },

  getMasternodeList() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .masternode('list')
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });
  },

  masternodeStartMany() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .masternodeStartMany()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });
  },
  async getMasternodeConfigSync() {
    const mnConfigFile = getCoinMasternodeConfPath();
    try {
      fs.statSync(mnConfigFile);
    } catch (err) {
      // file doesn't exist so create it
      fs.writeFileSync(getCoinMasternodeConfPath(), '');
    }

    return fs.readFileSync(mnConfigFile, 'utf8');

    // console.log(mnConfigFile);
    // return new Promise((resolve, reject) => {
    //     fs.statSync(mnConfigFile)
    //         .then(() => fs.chmodSync(mnConfigFile, "0777"))
    //         .catch(e => fs.writeFileSync(getCoinMasternodeConfPath(), " "))
    //         .catch(e => reject(e));

    //     resolve(fs.readFileSync(mnConfigFile, "utf8"));
    // });
  }
};
