const { ipcRenderer } = require('electron');

async function runCommand(cmd) {
  const res = await ipcRenderer.sendSync('runCommand', cmd);
  return res;
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

function noPeers() {
  ipcRenderer.send('no-peers');
}

export default {
  salvageWallet,
  rescanBlockchain,
  recoverTxes1,
  recoverTxes2,
  upgradeWallet,
  reindexBlockchain,
  resyncBlockchain,
  restartWallet,
  noPeers,
  runCommand
};
