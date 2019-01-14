const {ipcMain} = require('electron');

import * as daemon from  '../../main/blockchain/daemon';
import {app, dialog} from 'electron';

//
ipcMain.on('salvage-wallet', (event, arg) => {
    let confirm = dialog.showMessageBox({
        type: 'question',
        buttons: ['Cancel', 'Confirm'],
        message: 'Are you sure?',
        cancelId: 0,
        detail: 'Attempt to recover private keys from corrupt wallet.dat file.'
    });

    if (confirm) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.exit(0);
        }, 5000);

    }
});

//
ipcMain.on('rescan-blockchain', (event, arg) => {
    let confirm = dialog.showMessageBox({
        type: 'question',
        buttons: ['Cancel', 'Confirm'],
        message: 'Are you sure?',
        cancelId: 0,
        detail: 'Rescan the block chain for missing transactions.'
    });

    if (confirm) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});

//
ipcMain.on('upgrade-wallet', (event, arg) => {
    let confirm = dialog.showMessageBox({
        type: 'question',
        buttons: ['Cancel', 'Confirm'],
        message: 'Are you sure?',
        cancelId: 0,
        detail: 'Upgrade wallet to latest format on startup.'
    });

    if (confirm) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});

//
ipcMain.on('reindex-blockchain', (event, arg) => {
    let confirm = dialog.showMessageBox({
        type: 'question',
        buttons: ['Cancel', 'Confirm'],
        message: 'Are you sure?',
        cancelId: 0,
        detail: 'Rebuild block chain index from current blk000??.dat files'
    });

    if (confirm) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});

//
ipcMain.on('resync-blockchain', (event, arg) => {
    let confirm = dialog.showMessageBox({
        type: 'question',
        buttons: ['Cancel', 'Confirm'],
        message: 'Are you sure?',
        cancelId: 0,
        detail: 'Delete all local block chain so wallet synchronises from scratch.'
    });

    if (confirm) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});

//
ipcMain.on('restart-wagerrd', (event, arg) => {
    let confirm = dialog.showMessageBox({
        type: 'question',
        buttons: ['Cancel', 'Confirm'],
        message: 'Are you sure?',
        cancelId: 0,
        detail: 'Restart the Wagerr Wallet.'
    });

    if (confirm) {
        daemon.stop();

        setTimeout(function () {
            daemon.launch(arg);
            app.relaunch();
            app.quit();
        }, 5000);
    }
});