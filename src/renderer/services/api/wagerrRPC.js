import * as WagerrdRPC from 'wagerrd-rpc';
import PropertiesReader from 'properties-reader';
import { getWagerrConfPath } from '../../../main/blockchain/blockchain';

const { ipcRenderer } = require('electron');

// Get rpc credentials from the main process. These values are read from the wagerr.conf file in the main
// process when the app is initialising. Default values are used if the wagerr.conf does not exist or doesnt
// have the values set.
const rpcUser = ipcRenderer.sendSync('rpc-username');
const rpcPass = ipcRenderer.sendSync('rpc-password');

// Check if testnet=1 in wagerr.conf
const walletProperties = PropertiesReader(getWagerrConfPath());
const testnet = walletProperties.get('testnet');

// Assign RPC port number according to defaults or grab from wagerr.conf
let rpcPort = testnet ? '55005' : '55003';

if (walletProperties.get('rpcport')) {
  rpcPort = walletProperties.get('rpcport');
}

export default {
  client: new WagerrdRPC({
    protocol: 'http',
    user: rpcUser,
    pass: rpcPass,
    host: '127.0.0.1',
    port: rpcPort
  })
};
