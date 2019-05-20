import { app, BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import { checkForUpdates } from './updater/updater';
import menus from './menu/menus';
import errors from './alerts/errors';

import Daemon from './blockchain/daemon';
import * as blockchain from './blockchain/blockchain';

const { ipcMain } = require('electron');

// import isDev from 'electron-is-dev';
const path = require('path');
const ProgressBar = require('electron-progressbar');

// Main app URL.
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

// Set `__static` path to static files in production
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}

// Globals
let daemon;
let mainWindow = null;
global.restarting = false;

let closeWindowFlag = false;
let closeProgressBar = null;
let forcelyQuit = false;
/**
 * Render the main window for the Wagerr wallet.
 */
async function createMainWindow() {
  // Initial window options.
  mainWindow = new BrowserWindow({
    backgroundColor: '#2B2C2D',
    height: 700,
    width: 1200,
    minHeight: 700,
    minWidth: 1200,
    show: false,
    icon: path.join(__dirname, '../renderer/assets/images/icons/png/256.png'),
    useContentSize: true
  });

  // Close the web developer's console.
  // mainWindow.webContents.closeDevTools();

  // Load the main browser window with the Wagerr vue application.
  mainWindow.loadURL(winURL);

  // Add the main application menu to the UI.
  menus.initMainMenu();

  // Close the window action
  mainWindow.on('close', async event => {
    if (closeWindowFlag === false && process.platform !== 'darwin') {
      // Prevent the default close action before daemon is completely stopped.
      closeWindowFlag = true;
      event.preventDefault();

      // Make the progress bar to show the status of close actions
      closeProgressBar = new ProgressBar({
        text: 'Closing the Window...',
        detail: 'Stopping Wagerr Daemon...',
        closeOnComplete: true
      });
      closeProgressBar._window.webContents.closeDevTools();

      // Stop the daemon and close the app completely.
      if (daemon && !global.restarting) {
        await daemon.stop();
        closeProgressBar.detail = 'Wagger Daemon Stopped...';
        setTimeout(() => {
          closeProgressBar.close();
          app.quit();
        }, 1000);
      }
    }
  });

  // Reset the main window on close.
  mainWindow.on('closed', async () => {
    mainWindow = null;
  });

  // Show a popup dialog if the main window is unresponsive.
  mainWindow.on('unresponsive', () => {
    errors.wagerrdUnresponsive();
  });

  // Once electron app is ready then display the vue UI.
  mainWindow.once('ready-to-show', () => {
    const network = blockchain.testnet === 0 ? 'Mainnet' : 'Testnet';
    const title = `Wagerr Wallet - ${network}`;

    mainWindow.setTitle(title);
    mainWindow.show();
    mainWindow.focus();
  });

  // If running in dev mode then also open dev tools on the main window.
  mainWindow.webContents.on('did-finish-load', () => {
    // console.log('did-finish-loading...');
    // mainWindow.webContents.openDevTools()
  });

  // If the main window has crashed, clear it.
  mainWindow.webContents.on('crashed', () => {
    mainWindow = null;
  });

  // Reset the wallet restarting setting.
  global.restarting = false;
}

/**
 * Start the Wagerr daemon and render the UI so the Wagerr Vue App can communicate with
 * the RPC functions exposed by wagerrd.
 *
 * @returns {Promise<void>}
 */
async function init(args) {
  console.log('\x1b[32mInitialising Wagerr Wallet...\x1b[0m');
  daemon = new Daemon();

  // Check if the wagerrd binary exists.
  const wagerrExe = daemon.getExecutablePath('wagerrd');
  const wagerrcliExe = daemon.getExecutablePath('wagerr-cli');

  if (!fs.existsSync(wagerrExe) || !fs.existsSync(wagerrcliExe)) {
    console.error(
      '\x1b[32mThe wagerrd and wagerr-cli binaries do not exist. Please download and place in the bin directory.\x1b[0m'
    );
    process.exit(1);
  }

  // Check if the wagerr.conf file exists. If not use default values.
  const confExists = blockchain.readWagerrConf();

  if (!confExists) {
    console.error(
      '\x1b[32mDefault wagerr.conf values used as no file exists\x1b[0m'
    );
  }

  // Check if the Wagerr daemon is already running.
  const isRunning = await daemon.isWagerrdRunning();

  // If not then start it.
  if (!isRunning) {
    daemon.launch(args);
  } else {
    // Show popup warning the users a wagerrd instance is all ready running.
    forcelyQuit = true;
    errors.deamonRunningError();
  }

  // Render the main window.
  await createMainWindow();
}

app.on('ready', async () => {
  console.log('\x1b[32mWagerr Electron App starting...\x1b[0m');

  // Check for updates only for the packaged app.
  if (process.env.NODE_ENV === 'production') {
    checkForUpdates();

    // If no updates available continue with initialising the app,
    // otherwise, updater.js would have caught the update-available event
    // and downloaded and restarted the app.
    autoUpdater.on('update-not-available', async () => {
      await init();
    });
  } else {
    await init();
  }
});

app.on('before-quit', async () => {
  console.log('\x1b[32mbefore-quit\x1b[0m');
});

app.on('will-quit', async () => {
  console.log('\x1b[32mwill-quit\x1b[0m');

  if (process.platform === 'darwin' && !forcelyQuit) {
    await daemon.stop();
  }
});

app.on('window-all-closed', async () => {
  console.log('\x1b[32mwindow-all-closed\x1b[0m');
});

app.on('activate', async () => {
  if (!mainWindow) {
    await createMainWindow();
  }
});

// TODO - Move code to more appropriate location or new file.
ipcMain.on('runCommand', async (event, arg) => {
  event.returnValue = await daemon.runCommand(arg);
});

/**
 * Wallet repair main IPC handlers
 */
ipcMain.on('salvage-wallet', async (event, arg) => {
  const cancel = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'question',
    buttons: ['Confirm', 'Cancel'],
    message: 'Are you sure?',
    cancelId: 1,
    defaultId: 0,
    detail: 'Attempt to recover private keys from corrupt wallet.dat file.'
  });

  if (!cancel) {
    global.restarting = true;

    await daemon.stop().catch(function() {
      console.log('Wagerrd may not have shutdown correctly.');
    });
    await mainWindow.close();
    await init(arg);
  }
});

// Handles the render process of rescanning the locally stored blockchain.
ipcMain.on('rescan-blockchain', async (event, arg) => {
  const cancel = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'question',
    buttons: ['Confirm', 'Cancel'],
    message: 'Are you sure?',
    cancelId: 1,
    defaultId: 0,
    detail: 'Rescan the block chain for missing transactions.'
  });

  if (!cancel) {
    global.restarting = true;

    await daemon.stop().catch(function() {
      console.log('Wagerrd may not have shutdown correctly.');
    });
    await mainWindow.close();
    await init(arg);
  }
});

// Handles the render process of recovering transactions while keeping account info.
ipcMain.on('recover-tx-1', async (event, arg) => {
  const cancel = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'question',
    buttons: ['Confirm', 'Cancel'],
    message: 'Are you sure?',
    cancelId: 1,
    defaultId: 0,
    detail:
      'Recover transactions from block chain, keep meta-data e.g. Account Owner.'
  });

  if (!cancel) {
    global.restarting = true;

    await daemon.stop().catch(function() {
      console.log('Wagerrd may not have shutdown correctly.');
    });
    await mainWindow.close();
    await init(arg);
  }
});

// Handles the render process of recovering transactions while dropping account info.
ipcMain.on('recover-tx-2', async (event, arg) => {
  const cancel = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'question',
    buttons: ['Confirm', 'Cancel'],
    message: 'Are you sure?',
    cancelId: 1,
    defaultId: 0,
    detail: 'Recover transactions from block chain, drop meta-data.'
  });

  if (!cancel) {
    global.restarting = true;

    await daemon.stop().catch(function() {
      console.log('Wagerrd may not have shutdown correctly.');
    });
    await mainWindow.close();
    await init(arg);
  }
});

// Handles the render process upgrading the wallet.
ipcMain.on('upgrade-wallet', async (event, arg) => {
  const cancel = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'question',
    buttons: ['Confirm', 'Cancel'],
    message: 'Are you sure?',
    cancelId: 1,
    defaultId: 0,
    detail: 'Upgrade wallet to latest format on startup.'
  });

  if (!cancel) {
    global.restarting = true;

    await daemon.stop().catch(function() {
      console.log('Wagerrd may not have shutdown correctly.');
    });
    await mainWindow.close();
    await init(arg);
  }
});

// Handles the render process of reindexing the locally stored blockchain.
ipcMain.on('reindex-blockchain', async (event, arg) => {
  const cancel = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'question',
    buttons: ['Confirm', 'Cancel'],
    message: 'Are you sure?',
    cancelId: 1,
    defaultId: 0,
    detail: 'Rebuild block chain index from current blk000??.dat files'
  });

  if (!cancel) {
    global.restarting = true;

    await daemon.stop().catch(function() {
      console.log('Wagerrd may not have shutdown correctly.');
    });
    await mainWindow.close();
    await init(arg);
  }
});

// Handles the render process of rescanning the locally stored blockchain.
ipcMain.on('resync-blockchain', async (event, arg) => {
  const cancel = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'question',
    buttons: ['Confirm', 'Cancel'],
    message: 'Are you sure?',
    cancelId: 1,
    defaultId: 0,
    detail: 'Delete local block chain so wallet synchronises from scratch.'
  });

  if (!cancel) {
    global.restarting = true;

    await daemon.stop().catch(function() {
      console.log('Wagerrd may not have shutdown correctly.');
    });
    await mainWindow.close();
    await init(arg);
  }
});

// Handles the render process of resyncing the blockchain.
ipcMain.on('restart-wagerrd', async (event, arg) => {
  const cancel = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'question',
    buttons: ['Confirm', 'Cancel'],
    message: 'Are you sure?',
    cancelId: 1,
    defaultId: 0,
    detail: 'Restart the Wagerr Wallet.'
  });

  if (!cancel) {
    global.restarting = true;

    await daemon.stop().catch(function() {
      console.log('Wagerrd may not have shutdown correctly.');
    });
    await mainWindow.close();
    await init(arg);
  }
});

// Send the RPC username to the render process.
ipcMain.on('rpc-username', event => {
  event.returnValue = blockchain.rpcUser;
});

// Send the RPC password to the render process.
ipcMain.on('rpc-password', event => {
  event.returnValue = blockchain.rpcPass;
});

// Show error dialog informing user that the wallet could not connect to wagerr network.
ipcMain.on('no-peers', () => {
  errors.noPeersConnectionError();
});
