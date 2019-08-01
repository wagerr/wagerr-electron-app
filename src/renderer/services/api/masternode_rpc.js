import fs from 'fs';
import wagerrRPC from '@/services/api/wagerrRPC';
import { getCoinMasternodeConfPath } from '../../../main/blockchain/blockchain';

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
        .listMasternodes()
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
        .startmasternode('many', 'true')
        .then(function(resp) {
          resolve(resp);
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
  },

  generatePrivateKey() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .createMasternodeKey()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });
  },

  masternodeOutputs() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .getMasternodeOutputs()
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });
  },

  async createMasternode(arg) {
    let mnConfig = await this.getMasternodeConfigSync();
    const confString = `\n${arg.alias} ${arg.ipAddress}:${arg.port} ${arg.privateKey} ${arg.masternodeOutputs} ${arg.masternodeOutputIndex}`;
    const writeLines = mnConfig.split('\n');
    let dupeLine = false;

    writeLines.forEach(line => {
      if (line.trim() === confString.trim()) dupeLine = true;
    });

    if (!dupeLine) mnConfig += confString;
    fs.writeFileSync(getCoinMasternodeConfPath(), mnConfig);
  },

  masternodeStartAlias(arg) {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .startmasternode('alias', 'true', arg.alias)
        .then(function(resp) {
          resolve(resp);
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });
  },

  masternodeStartMissing() {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .startmasternode('missing', 'true')
        .then(function(resp) {
          resolve(resp);
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });
  }
};
