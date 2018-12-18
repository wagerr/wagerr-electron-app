import wagerrRPC from '@/services/api/wagerrRPC';

export default {

    getNetworkInfo () {
        return new Promise((resolve, reject) => {
            wagerrRPC.client.getNetworkInfo()
                .then(function (resp) {
                    resolve(resp.result);
                })
                .catch(function (err) {
                    console.error(err);
                    reject(err);
                })
        })
    },

    getPeerInfo () {
        return new Promise((resolve, reject) => {
            wagerrRPC.client.getPeerInfo()
                .then(function (resp) {
                    resolve(resp.result);
                })
                .catch(function (err) {
                    console.error(err);
                    reject(err);
                })
        })
    }

}