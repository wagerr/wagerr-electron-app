const { ipcRenderer } = require('electron');

function salvageWallet () {
    //return new Promise((resolve, reject) => {
    ipcRenderer.send('salvage-wallet', '-salvagewallet');
    //})
}

function rescanBlockchain () {
    //return new Promise((resolve, reject) => {
    ipcRenderer.send('rescan-blockchain', '-rescan');
    //})
}

function upgradeWallet () {
    //return new Promise((resolve, reject) => {
    ipcRenderer.send('upgrade-wallet', '-upgradewallet');
    //})
}

function reindexBlockchain () {
    //return new Promise((resolve, reject) => {
    ipcRenderer.send('reindex-blockchain', '-reindex');
    //})
}

function resyncBlockchain () {
    //return new Promise((resolve, reject) => {
    ipcRenderer.send('resync-blockchain', '-resync');
    //})
}

function restartWallet () {
    //return new Promise((resolve, reject) => {
    ipcRenderer.send('restart-wagerrd');
    //})
}

export default{
    salvageWallet,
    rescanBlockchain,
    upgradeWallet,
    reindexBlockchain,
    resyncBlockchain,
    restartWallet
}