'use strict';

// Import required modules.
import Daemon from './daemon';
import isDev from 'electron-is-dev';
import findProcess from 'find-process';
import { daemonName } from './blockchain';
import {app, BrowserWindow, dialog} from 'electron';
import { downloadWagerrDaemon, wagerrdExists } from './download-wagerr-daemon'

const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// The main window.
let mainWindow;

/**
 * Render the main window for the Wagerr wallet.
 */
function createMainWindow () {

    // Initial window options.
    mainWindow = new BrowserWindow({
        title: 'Wagerr Wallet',
        backgroundColor: '#2B2C2D',
        height: 700,
        width: 1200,
        minHeight: 700,
        minWidth: 1200,
        show: false,
        //useContentSize: true,
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
        mainWindow.show();
        mainWindow.focus();
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
 * Start the Wagerr daemon and render the UI so the Wagerr Vue App can communicate with the RPC functions exposed by wagerrd.
 *
 * @returns {Promise<void>}
 */
async function init () {
    console.log('\x1b[32mInitialising the Wagerr Wallet...\x1b[0m');

    // Download the wagerr daemon and wait till its done.
    let exists = wagerrdExists();

    if (exists) {
        console.log('\x1b[32mWagerr Daemon already exists!\x1b[0m');
    }
    else{
        await downloadWagerrDaemon();
    }

    // Check if the Wagerr daemon is already running.
    const processList = await findProcess('name', `daemon/${daemonName}`);
    const isDaemonRunning = false;

    console.log('\x1b[32mIs wagerrd running: ' + isDaemonRunning, processList, '\x1b[32m');

    // If not then start it.
    if (! isDaemonRunning) {
        let daemon = new Daemon();

        daemon.on('exit', () => {
            console.log('daemon on exit');

            if (!isDev) {
                daemon = null;

                if (! appState.isQuitting) {
                    dialog.showErrorBox(
                        'Daemon has Exited',
                        'The daemon may have encountered an unexpected error, or another daemon instance is already running. \n\n'
                    )
                }
                app.quit();
            }
        });

        // Launch the Wagerr Daemon.
        daemon.launch();
    }

    // Render the main window.
    await createMainWindow();
}

// If electron app is ready start the daemon and render the UI.
app.on('ready', async () => {
    console.log('\x1b[32mElectron Ready!\x1b[0m');
    await init();
});

// If user closes the window, kill the electron app.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
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
