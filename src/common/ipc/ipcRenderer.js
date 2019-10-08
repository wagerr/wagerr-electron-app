const { ipcRenderer } = require('electron');

function log(level, message) {
  ipcRenderer.send('log-message', level, message);
}

async function runCommand(cmd) {
  const res = await ipcRenderer.sendSync('runCommand', cmd);
  return res;
}

function encryptWallet() {
  ipcRenderer.send('encrypt-wallet');
}

function salvageWallet() {
  ipcRenderer.send('salvage-wallet', '-salvagewallet');
}

function rescanBlockchain() {
  ipcRenderer.send('rescan-blockchain', '-rescan');
}

function recoverTxes1() {
  ipcRenderer.send('recover-tx-1', '-zapwallettxes=1');
}

function recoverTxes2() {
  ipcRenderer.send('recover-tx-2', '-zapwallettxes=2');
}

function upgradeWallet() {
  ipcRenderer.send('upgrade-wallet', '-upgradewallet');
}

function reindexBlockchain() {
  ipcRenderer.send('reindex-blockchain', '-reindex');
}

function resyncBlockchain() {
  ipcRenderer.send('resync-blockchain', '-resync');
}

function restartWallet() {
  ipcRenderer.send('restart-wagerrd');
}

function restartWalletForce() {
  console.log('ipc renderer');
  ipcRenderer.send('restart-wagerrd-force');
}

function noPeers() {
  ipcRenderer.send('no-peers');
}

async function stopDaemon() {
  const res = await ipcRenderer.sendSync('stop-daemon');
  console.log('Daemon has stopped with res: ' + res);
  return res;
}

export default {
  log,
  encryptWallet,
  salvageWallet,
  rescanBlockchain,
  recoverTxes1,
  recoverTxes2,
  upgradeWallet,
  reindexBlockchain,
  resyncBlockchain,
  restartWallet,
  restartWalletForce,
  noPeers,
  runCommand,
  stopDaemon
};
