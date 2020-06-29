import { BrowserWindow, Menu, app, dialog, ipcMain } from 'electron';
import ProgressBar from 'electron-progressbar';
import fs from 'fs';
import path from 'path';
import errors from './alerts/errors';
import {
  readWagerrConf,
  rpcPass,
  rpcUser,
  testnet
} from './blockchain/blockchain';
import Daemon from './blockchain/daemon';
import { spawnLogger } from './logger/logger';
import menu from './menu/menu';
import { checkForUpdates } from './updater/updater';
import { version as appVersion } from '../../package.json';

const logger = spawnLogger();

// Main app URL.
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

// Globals
let daemon;
let mainWindow = null;
global.restarting = false;

let closeWindowFlag = false;
let closeProgressBar = null;
let forcelyQuit = false;

// If in development mode use 'electron-debug' which adds useful debug features to the app.
if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

// Install defined Electron/Chrome devtools extensions.
const installExtensions = async () => {
  logger.debug('Installing Electron/Chrome devtools extensions');

  const {
    default: installExtension,
    VUEJS_DEVTOOLS,
  } = require('electron-devtools-installer');

  installExtension(VUEJS_DEVTOOLS)
    .then((name) => logger.debug(`Added devtools extension:  ${name}`))
    .catch((err) => logger.error('An error occurred: ', err));
};

/**
 * Render the main window for the Wagerr Electron App.
 */
async function createMainWindow() {
  logger.info('Rendering main window');

  const windowOptions = {
    width: 1275,
    height: 700,
    minWidth: 1275,
    minHeight: 700,
    icon: path.join(__dirname, '../renderer/assets/images/icons/png/256.png'),
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#2B2C2D',
    webPreferences: {
      nodeIntegration: true
    }
  };

  mainWindow = new BrowserWindow(windowOptions);

  // Load the main browser window with the Wagerr vue application.
  mainWindow.loadURL(winURL);

  // Add the main application menu to the UI.
  Menu.setApplicationMenu(menu);

  // Prepare for the window to be closed.
  mainWindow.on('close', async event => {
    if (closeWindowFlag === false && process.platform !== 'darwin') {
      // Stop the daemon and close the app completely, but only if the app is
      // not being restarted. If the app is just being restarted, like if we
      // use 'zapwallettxes', we don't want to quit the app, just close the
      // mainWindow instead.
      if (daemon && !global.restarting) {
        // Prevent the default close action before daemon is completely stopped.
        closeWindowFlag = true;
        event.preventDefault();

        // Make the progress bar to show the status of close actions.
        closeProgressBar = new ProgressBar({
          text: 'Closing the Window...',
          detail: 'Stopping Wagerr daemon...',
          closeOnComplete: true
        });

        // Close the devtools window.
        closeProgressBar._window.webContents.closeDevTools();

        // Send the `stop` command to the daemon and wait for to shutdown.
        await daemon.stop();

        // Notify the user the daemon has shutdown.
        closeProgressBar.detail = 'Wagger daemon stopped...';

        // Close the shutdown progress bar window and quit the app.
        setTimeout(() => {
          closeProgressBar.close();
          app.quit();
        }, 1000);
      }
    }
  });

  // The window is now closed.
  mainWindow.on('closed', async () => {
    // Reset the main window on close.
    mainWindow = null;
  });

  // Show a popup dialog if the main window is unresponsive.
  mainWindow.on('unresponsive', () => {
    errors.wagerrdUnresponsive();
  });

  // Once electron app is ready then display the vue UI.
  mainWindow.once('ready-to-show', () => {
    const network = testnet === 1 ? ' - Testnet' : '';
    const title = `Wagerr Electron App${network}`;

    mainWindow.setTitle(title);
    mainWindow.show();
    setImmediate(() => {
      mainWindow.focus();
    });
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
export async function init(args) {
  logger.info('Initialising Wagerr Electron App');
  daemon = new Daemon();

  // Check if the wagerrd binary exists.
  const wagerrExe = daemon.getExecutablePath('wagerrd');
  const wagerrcliExe = daemon.getExecutablePath('wagerr-cli');

  if (!fs.existsSync(wagerrExe) || !fs.existsSync(wagerrcliExe)) {
    logger.error(
      'The wagerrd and wagerr-cli binaries do not exist. Please download and place in the bin directory.'
    );
    process.exit(1);
  }

  // Check if the wagerr.conf file exists. If not use default values.
  const confExists = readWagerrConf();

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
  logger.info(`Wagerr Electron App version v${appVersion}`);
  logger.info('Finished initializing and ready to start');

  // If running in development mode, install some Electron/Chrome devtools extensions like vue-devtools.
  if (process.env.NODE_ENV === 'development') {
    await installExtensions();
  }

  // Check for updates only for the packaged app.
  if (process.env.NODE_ENV === 'production') {
    logger.info('Checking for an update');
    checkForUpdates();
  } else {
    logger.debug('Skipping update check when running in development mode');
    await init();
  }
});

// Catch the 'window-all-closed' event and (right now) do nothing with it. If
// you do not subscribe to this event and all windows are closed, the default
// behavior is to quit the app. We want finer grained control of when the app
// is quit, because sometimes we just want to restart the app (like after
// encrypting etc.).
// https://electronjs.org/docs/api/app#event-window-all-closed
app.on('window-all-closed', event => {
  logger.info('All windows have been closed');
});

app.on('before-quit', async () => {
  logger.info('Preparing to close all windows');
});

app.on('will-quit', async () => {
  logger.info('Application will quit');

  if (process.platform === 'darwin' && !forcelyQuit) {
    await daemon.stop();
  }
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
 * Encrypt wallet IPC handlers
 */
ipcMain.on('encrypt-wallet', async (event, arg) => {
  global.restarting = true;

  await mainWindow.close();
  await init(arg);
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
      logger.warn('wagerrd may not have shutdown correctly.');
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
      logger.warn('wagerrd may not have shutdown correctly.');
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
      logger.warn('wagerrd may not have shutdown correctly.');
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
      logger.warn('wagerrd may not have shutdown correctly.');
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
      logger.warn('wagerrd may not have shutdown correctly.');
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
      logger.warn('wagerrd may not have shutdown correctly.');
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
      logger.warn('wagerrd may not have shutdown correctly.');
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
    restartWagerrd(arg);
  }
});

ipcMain.on('restart-wagerrd-force', async (event, arg) => {
  restartWagerrd();
});

async function restartWagerrd(arg) {
  global.restarting = true;

  await daemon.stop().catch(function() {
    logger.warn('wagerrd may not have shutdown correctly.');
  });
  await mainWindow.close();
  await init(arg);
}

ipcMain.on('stop-daemon', async (event, arg) => {
  event.returnValue = await daemon.stop();
});

// Send the RPC username to the render process.
ipcMain.on('rpc-username', event => {
  event.returnValue = rpcUser;
});

// Send the RPC password to the render process.
ipcMain.on('rpc-password', event => {
  event.returnValue = rpcPass;
});

// Show error dialog informing user that the wallet could not connect to wagerr network.
ipcMain.on('no-peers', () => {
  errors.noPeersConnectionError();
});

ipcMain.on('log-message', (event, ...args) => {
  logger.log(...args);
});
