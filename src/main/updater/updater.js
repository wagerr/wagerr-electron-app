import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

const ProgressBar = require('electron-progressbar');

let downloadProgressBar = null;

autoUpdater.autoDownload = false;

autoUpdater.on('error', error => {
  dialog.showErrorBox(
    'Error: ',
    error == null ? 'unknown' : (error.stack || error).toString()
  );
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox(
    {
      type: 'info',
      title: 'Wagerr Electron App - Update Available',
      message: 'An update is available, do you want to update now?',
      buttons: ['Yes', 'No']
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        // Show a progress bar of the update status
        downloadProgressBar = new ProgressBar({
          title: 'Wagerr Electron App - Update Available',
          text: 'Downloading the update...',
          closeOnComplete: true
        });

        // Start the update
        autoUpdater.downloadUpdate();
      } else {
        app.quit();
      }
    }
  );
});

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

  // Display the custom message on the dialog.
  downloadProgressBar.detail = downloadStatsMessage;
});

autoUpdater.on('update-downloaded', () => {
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
