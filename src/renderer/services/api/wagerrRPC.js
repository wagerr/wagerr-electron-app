import { ipcRenderer } from 'electron';
import * as WagerrdRPC from 'wagerrd-rpc';

const rpcPort = ipcRenderer.sendSync('wagerrd-rpc-port');
const rpcUser = ipcRenderer.sendSync('wagerrd-rpc-user');
const rpcPassword = ipcRenderer.sendSync('wagerrd-rpc-password');

export default {
  client: new WagerrdRPC({
    protocol: 'http',
    user: rpcUser,
    pass: rpcPassword,
    host: '127.0.0.1',
    port: rpcPort
  })
};
