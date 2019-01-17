const {ipcMain} = require('electron');

import * as daemon from  '../../main/blockchain/daemon';
import {app, dialog} from 'electron';

// Handles the render process to salvage a wallet.
ipcMain.on('salvage-wallet', (event, arg) => {
    let cancel = dialog.showMessageBox({
        type: 'question',
        buttons: ['Confirm', 'Cancel'],
        message: 'Are you sure?',
        cancelId: 1,
        defaultId: 0,
        detail: 'Attempt to recover private keys from corrupt wallet.dat file.'
    });

    if (!cancel) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.exit(0);
        }, 5000);

    }
});

// Handles the render process of rescanning the locally stored blockchain.
ipcMain.on('rescan-blockchain', (event, arg) => {
    let cancel = dialog.showMessageBox({
        type: 'question',
        buttons: ['Confirm', 'Cancel'],
        message: 'Are you sure?',
        cancelId: 1,
        defaultId: 0,
        detail: 'Rescan the block chain for missing transactions.'
    });

    if (!cancel) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});

// Handles the render process of recovering transactions while keeping account info.
ipcMain.on('recover-tx-1', (event, arg) => {
    let cancel = dialog.showMessageBox({
        type: 'question',
        buttons: ['Confirm', 'Cancel'],
        message: 'Are you sure?',
        cancelId: 1,
        defaultId: 0,
        detail: 'Recover transactions from block chain, keep meta-data e.g. Account Owner.'
    });

    if (!cancel) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});

// Handles the render process of recovering transactions while dropping account info.
ipcMain.on('recover-tx-2', (event, arg) => {
    let cancel = dialog.showMessageBox({
        type: 'question',
        buttons: ['Confirm', 'Cancel'],
        message: 'Are you sure?',
        cancelId: 1,
        defaultId: 0,
        detail: 'Recover transactions from block chain, drop meta-data.'
    });

    if (!cancel) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});

// Handles the render process upgrading the wallet.
ipcMain.on('upgrade-wallet', (event, arg) => {
    let cancel = dialog.showMessageBox({
        type: 'question',
        buttons: ['Confirm', 'Cancel'],
        message: 'Are you sure?',
        cancelId: 1,
        defaultId: 0,
        detail: 'Upgrade wallet to latest format on startup.'
    });

    if (!cancel) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});

// Handles the render process of reindexing the locally stored blockchain.
ipcMain.on('reindex-blockchain', (event, arg) => {
    let cancel = dialog.showMessageBox({
        type: 'question',
        buttons: ['Confirm', 'Cancel'],
        message: 'Are you sure?',
        cancelId: 1,
        defaultId: 0,
        detail: 'Rebuild block chain index from current blk000??.dat files'
    });

    if (!cancel) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});

// Handles the render process of rescanning the locally stored blockchain.
ipcMain.on('resync-blockchain', (event, arg) => {
    let cancel = dialog.showMessageBox({
        type: 'question',
        buttons: ['Confirm', 'Cancel'],
        message: 'Are you sure?',
        cancelId: 1,
        defaultId: 0,
        detail: 'Delete all local block chain so wallet synchronises from scratch.'
    });

    if (!cancel) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});

// handles the render process of resyncing the blockchain.
ipcMain.on('restart-wagerrd', (event, arg) => {
    let cancel = dialog.showMessageBox({
        type: 'question',
        buttons: ['Confirm', 'Cancel'],
        message: 'Are you sure?',
        cancelId: 1,
        defaultId: 0,
        detail: 'Restart the Wagerr Wallet.'
    });

    if (!cancel) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});