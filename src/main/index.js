'use strict';

// import isDev from 'electron-is-dev';
let path = require('path');

import menus from './menu/menus';
import errors from './alerts/errors';
const {ipcMain} = require('electron');
import Daemon from  './blockchain/daemon';
import * as blockchain from './blockchain/blockchain';
import {app, BrowserWindow, dialog, Menu} from 'electron';

// Main app URL.
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;

// Set `__static` path to static files in production
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let daemon;
let mainWindow;

/**
 * Render the main window for the Wagerr wallet.
 */
function createMainWindow () {

    // Initial window options.
    mainWindow = new BrowserWindow({
        backgroundColor: '#2B2C2D',
        height: 700,
        width: 1200,
        minHeight: 700,
        minWidth: 1200,
        show: false,
        icon:  path.join(__dirname, '../renderer/assets/images/icons/png/256.png'),
        useContentSize: true
        // webPreferences: {
        //     // Disable renderer process's webSecurity on development to enable CORS.
        //     webSecurity: !isDev,
        //     //nodeIntegration: false,
        //     plugins: true
        // }
    });

    //mainWindow.webContents.closeDevTools();

    // Load the main browser window with the Wagerr vue application.
    mainWindow.loadURL(winURL);

    // Add the main application menu to the UI.
    menus.initMainMenu();

    // Reset the main window on close.
    mainWindow.on('closed', async () => {
        mainWindow = null;
    });

    // Show a popup dialog if the main window is unresponsive.
    mainWindow.on('unresponsive', () => {
        dialog.showMessageBox(
            mainWindow,
            {
                type: 'warning',
                buttons: ['Wait', 'Quit'],
                title: 'Wagerr Unresponsive',
                defaultId: 1,
                message: 'WAGERR is not responding. Would you like to quit?',
                cancelId: 0
            },
            buttonIndex => {
                if (buttonIndex === 1){
                    app.quit();
                }
            }
        )
    });

    // Once electron app is ready then display the vue UI.
    mainWindow.once('ready-to-show', () => {
        let network = blockchain.testnet === 0 ? 'Mainnet' : 'Testnet';
        let title = 'Wagerr Wallet - ' + network;

        mainWindow.setTitle(title);
        mainWindow.show();
        mainWindow.focus();
    });

    // If running in dev mode then also open dev tools on the main window.
    // mainWindow.webContents.on('did-finish-load', () => {
    //     if (isDev) {
    //         mainWindow.webContents.openDevTools()
    //     }
    // });

    // If the main window has crashed, clear it.
    mainWindow.webContents.on('crashed', () => {
        mainWindow = null
    });
}

/**
 * Start the Wagerr daemon and render the UI so the Wagerr Vue App can communicate with
 * the RPC functions exposed by wagerrd.
 *
 * @returns {Promise<void>}
 */
async function init (args) {
    console.log('\x1b[32mInitialising Wagerr Wallet...\x1b[0m');
    daemon = new Daemon();

    // Check if the wagerrd binary exists. If not download it.
    let daemonExists = daemon.wagerrdExists();

    if (!daemonExists) {
        await daemon.downloadWagerrDaemon();
    }

    // Check if the wagerr.conf file exists. If not use default values.
    let confExists = blockchain.readWagerrConf();

    if (!confExists) {
        console.error('\x1b[32mDefault wagerr.conf values used as no file exists\x1b[0m');
    }

    // Check if the Wagerr daemon is already running.
    let isRunning = await daemon.isWagerrdRunning();

    // If not then start it.
    if (!isRunning) {
         daemon.launch(args);
    }
    else{
        // Show popup warning the users a wagerrd instance is allreaday running
        errors.deamonRunningError()
    }

    // Render the main window.
    await createMainWindow();
}

// If electron app is ready start the daemon and render the UI.
app.on('ready', async () => {
    console.log('\x1b[32mElectron starting...\x1b[0m');
    await init();

});

app.on('will-quit', () => {
    console.log('\x1b[32mwill-quit\x1b[0m');

    if (mainWindow) {
        mainWindow = null;
    }
});

app.on('before-quit', async () => {
    console.log('\x1b[32mbefore-quit\x1b[0m');
    await daemon.stop();
});

// If user closes the window, kill the electron app.
app.on('window-all-closed', async () => {
    console.log('\x1b[32mwindow-all-closed\x1b[0m');

    if (process.platform !== 'darwin') {
        if (daemon) {
            await daemon.stop();
            //app.quit();
        }
    }
});

app.on('activate',async () => {
    if (!mainWindow) {
        await createMainWindow();
    }
});



// TODO - Move code to more appropriate location or new file.
/**
 * Wallet repair main IPC handlers
 */
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
        daemon.stop().catch(function () {
            console.log('Wagerrd may not have shutdown correctly.')
        });

        setTimeout(function () {
            mainWindow.close();
            init(arg);
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
        daemon.stop().catch(function () {
            console.log('Wagerrd may not have shutdown correctly.')
        });

        setTimeout(function () {
            mainWindow.close();
            init(arg);
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
        daemon.stop().catch(function () {
            console.log('Wagerrd may not have shutdown correctly.')
        });

        setTimeout(function () {
            mainWindow.close();
            init(arg)
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
        daemon.stop().catch(function () {
            console.log('Wagerrd may not have shutdown correctly.')
        });

        setTimeout(function () {
            mainWindow.close();
            init(arg)
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
        daemon.stop().catch(function () {
            console.log('Wagerrd may not have shutdown correctly.')
        });

        setTimeout(function () {
            mainWindow.close();
            init(arg);
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
        daemon.stop().catch(function () {
            console.log('Wagerrd may not have shutdown correctly.')
        });

        setTimeout(function () {
            mainWindow.close();
            init(arg);
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
        daemon.stop().catch(function () {
            console.log('Wagerrd may not have shutdown correctly.')
        });

        setTimeout(function () {
            mainWindow.close();
            init(arg);
        }, 5000);
    }
});

// Handles the render process of resyncing the blockchain.
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
        daemon.stop().catch(function () {
            console.log('Could not kill wagerrd process.')
        });

        setTimeout(function () {
            mainWindow.close();
            init(arg)
        }, 5000);
    }
});

// Send the RPC username to the render process.
ipcMain.on('rpc-username', (event) => {
    console.log(blockchain.rpcUser);
    event.returnValue = blockchain.rpcUser
});

// Send the RPC password to the render process.
ipcMain.on('rpc-password', (event) => {
    console.log(blockchain.rpcPass);
    event.returnValue = blockchain.rpcPass
});

// Show error dialog informing user that the wallet could not connect to wagerr network.
ipcMain.on('no-peers', (event, arg) => {
    errors.noPeersConnectionError();
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
