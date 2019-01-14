'use strict';

// Import required modules.
import isDev from 'electron-is-dev';
import ipcMain from '../common/ipc/ipcMain';
import ipcRender from '../common/ipc/ipcRender';
import * as daemon from  './blockchain/daemon';
import * as blockchain from './blockchain/blockchain';
import {app, BrowserWindow, dialog} from 'electron';

let path = require('path');

// Main app URL.
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;

// Turn off warnings on build.
if ( !isDev ) {
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
}

// Set `__static` path to static files in production
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// The main window.
let mainWindow;
const appState = {}

/**
 * Render the main window for the Wagerr wallet.
 */
function createMainWindow () {

    // Initial window options.
    mainWindow = new BrowserWindow({
        title: 'Wagerr asasdasdasdWallet - ' + blockchain.testnet,
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

    mainWindow.webContents.closeDevTools();

    // Load the main browser window with the Wagerr vue application.
    mainWindow.loadURL(winURL);

    // Reset the main window on close.
    mainWindow.on('closed', () => {
        mainWindow = null
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
                    app.quit()
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
        ///mainWindow.focus();
    });

    // If running in dev mode then also open dev tools on the main window.
    // mainWindow.webContents.on('did-finish-load', () => {
    //     if (isDev) {
    //         //mainWindow.webContents.openDevTools()
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
async function init () {
    console.log('\x1b[32mInitialising Wagerr Wallet...\x1b[0m');

    // Check if the wagerrd binary exists. If not download it.
    let daemonExists = await daemon.wagerrdExists();

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
        daemon.launch();
    }

    // Render the main window.
    await createMainWindow();
}

// If electron app is ready start the daemon and render the UI.
app.on('ready', async () => {
    console.log('\x1b[32mElectron starting...\x1b[0m');
    await init();
});

// If user closes the window, kill the electron app.
app.on('window-all-closed', () => {
    //if (process.platform !== 'darwin') {
        app.quit();
    //}
});

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow();
    }
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
