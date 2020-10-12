import wagerrRPC from '@/services/api/wagerrRPC';
import walletRPC from '@/services/api/wallet_rpc';

export default {
  listTransactions(length) {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .listTransactions('*', length)
        .then(function(resp) {
          resolve(resp.result.resverse());
        })
        .catch(function(err) {
          // TODO Handle error correctly.
          console.error(err);
          reject(err);
        });
    });
  },

  listTransactionRecords(length) {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .listTransactionRecords('*', length)
        .then(async function(resp) {
          const txRecords = resp.result.reverse();

          // Get the extra tx details for each tx record.
          const updatedTxPromises = txRecords.map(async function(tx) {
            const transaction = await walletRPC.getTransaction(tx.transactionid);
            return Object.assign({}, tx, transaction);
          });

          Promise.all(updatedTxPromises).then(updatedTxList => {
            resolve(updatedTxList);
          });
        })
        .catch(function(err) {
          // TODO Handle error correctly.
          console.error(err);
          reject(err);
      });
    });
  },

  hasUnconfirmedTransactions() {
    return new Promise(async (resolve, reject) => {
      try {
        const txs = await this.listTransactionRecords(15);
        const hasUnconfirmedTxs = txs.reduce((acc, tx) => acc || tx.confirmations === 0, false);
        resolve(hasUnconfirmedTxs);
      } catch (err) {
        reject(err);
      }
    });
  },

  getMyBets(length) {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        // TODO: Don't hardcode getMyBets once we resolve issues with Wagerr Core not returning
        //       all the results.
        // .getMyBets('*', length)
        .getMyBets('')
        .then(function(resp) {
          resolve(resp.result);
        })
        .catch(function(err) {
          // TODO Handle error correctly.
          console.error(err);
          reject(err);
        });
    });
  },

  listChainGameBets(length) {
    return new Promise((resolve, reject) => {
      wagerrRPC.client
        .listChainGamesBets('*', length)
        .then(function(resp) {
          resolve(resp.result.reverse());
        })
        .catch(function(err) {
          // TODO Handle error correctly.
          console.error(err);
          reject(err);
        });
    });
  },
};
