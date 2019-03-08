import * as WagerrdRPC from 'wagerrd-rpc';
import PropertiesReader from "properties-reader";
import {getWagerrdPath, testnet} from "../../../main/blockchain/blockchain";
const { ipcRenderer } = require('electron');

// Get rpc credentials from the main process. These values are read from the wagerr.conf file in the main
// process when the app is initialising. Default values are used if the wagerr.conf does not exist or doesnt
// have the values set.
let rpcUser = ipcRenderer.sendSync('rpc-username');
let rpcPass = ipcRenderer.sendSync('rpc-password');

export default {
  client: new WagerrdRPC({
    protocol: 'http',
    user: rpcUser,
    pass: rpcPass,
    host: '127.0.0.1',
    port: '8332'
  })
}
