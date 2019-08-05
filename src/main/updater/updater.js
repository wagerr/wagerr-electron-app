import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import { init } from '../index';
import { spawnLogger } from '../logger/logger';

const ProgressBar = require('electron-progressbar');

const logger = spawnLogger();

let downloadProgressBar = null;

// Don't automatically being downloaded the update when available, instead we
// give the user an option to cancel the update.
autoUpdater.autoDownload = false;

// Show and log any error when going through the update process.
autoUpdater.on('error', error => {
  logger.error('There was an error while updating the app');
  dialog.showErrorBox(
    'Error: ',
    error == null ? 'unknown' : (error.stack || error).toString()
  );

  // If there is an error with the updater quit the app.
  app.quit();
});

// An update is available, ask the user if they would like to update.
autoUpdater.on('update-available', () => {
  logger.info('Update available');

  dialog.showMessageBox(
    {
      type: 'info',
      title: 'Wagerr Electron App - Update Available',
      message: 'An update is available, do you want to update now?',
      buttons: ['Yes', 'No']
    },
    async buttonIndex => {
      // If the user selects 'Yes', download the update.
      if (buttonIndex === 0) {
        // Show a progress bar of the update status
        downloadProgressBar = new ProgressBar({
          title: 'Wagerr Electron App - Update Available',
          text: 'Downloading the update...',
          closeOnComplete: true
        });

        // Download the update.
        autoUpdater.downloadUpdate();
      } else {
        // If the user does not select 'Yes' start the app.
        await init();
      }
    }
  );
});

// If no updates available continue with initialising the app.
autoUpdater.on('update-not-available', async () => {
  logger.info('No update available, continuing with launch');
  await init();
});

// As the update is downloaded update the progress bar.
autoUpdater.on('download-progress', downloadProgress => {
  // Convert bytes per second to megabits per second.
  let Mbps = downloadProgress.bytesPerSecond / 125000;
  Mbps = Mbps.toFixed(2);

  // Convert bytes transferred to  megabytes transferred.
  let MBTransferred = downloadProgress.transferred / 1000000;
  MBTransferred = MBTransferred.toFixed(2);

  // Convert bytes total to  megabytes total.
  let MBTotal = downloadProgress.total / 1000000;
  MBTotal = MBTotal.toFixed(2);

  // Set a custom message that updates the download values when the
  // `download-progress` event is emitted.
  let downloadStatsMessage = `Downloaded ${MBTransferred} MB out of ${MBTotal} MB`;
  downloadStatsMessage += ` (${downloadProgress.percent.toFixed(2)}%)`;
  downloadStatsMessage += ` @ ${Mbps} Mbps`;

  // Log the update process.
  logger.info(downloadStatsMessage);

  // Display the custom message on the dialog.
  downloadProgressBar.detail = downloadStatsMessage;
});

// Once the update has been downloaded show a success message to the user, then
// quit and install the update and relaunch the app.
autoUpdater.on('update-downloaded', () => {
  logger.info('Update downloaded');

  // Close the progress bar.
  downloadProgressBar.setCompleted();

  dialog.showMessageBox(
    {
      title: 'Wagerr Electron App - Update Available',
      message: 'Update downloaded, application will now quit for update.'
    },
    () => {
      setImmediate(() => autoUpdater.quitAndInstall());
    }
  );
});

export function checkForUpdates() {
  autoUpdater.checkForUpdates();
}
