import wagerrRPC from '@/services/api/wagerrRPC';
import moment from 'moment';

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

  // Returns the block time of the block represented by the hash passed as argument or the best block time if no argument is received
  async getBlockTime(blockHash) {
    // If the blockHash is not passed as an argument, get best block hash from blockchain
    if (!blockHash) {
      blockHash = (await this.getBlockchainInfo()).bestblockhash;
    }
    return (await this.getBlockInfo(blockHash)).time * 1000;
  },

  async getBlockDurationBehind(blockHash) {
    let bestBlockTime = await this.getBlockTime(blockHash);
    let bestBlockTimeDifference = moment().diff(bestBlockTime, 'seconds');
    return moment.duration(bestBlockTimeDifference, 'seconds');
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
