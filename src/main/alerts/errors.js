const { app, dialog, BrowserWindow } = require('electron');

function deamonRunningError() {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'error',
    title: 'Wagerr daemon already running!',
    buttons: ['Confirm'],
    message: 'Wagerr daemon already running!',
    defaultId: 0,
    detail:
      'Detected a running wagerrd process! \n\n Warning: Running this wallet with an already running deamon can cause inconsistent behaviour.'
  });
  app.quit();
}

function noPeersConnectionError() {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'error',
    title: 'Wagerr Network Error',
    buttons: ['Confirm'],
    message: 'Could not connect to the Wagerr network!',
    detail:
      'No peers found. \n\nWarning: Some wallet features may not work without a Wagerr network connection.'
  });
}

function wagerrdStopped() {
  // dialog.showMessageBox( BrowserWindow.getFocusedWindow(),{
  //     type: 'error',
  //     title: 'Wagerr daemon stopped!',
  //     buttons: ['Confirm'],
  //     message: 'Wagerr daemon stopped!',
  //     detail: 'Wallet will now exit.'
  // });
}

function wagerrdError(err) {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'error',
    title: 'Wagerr daemon error!',
    buttons: ['OK'],
    message: 'Wagerr Daemon Error!',
    detail: err.toString()
  });
}

function wagerrdUnresponsive() {
  dialog.showMessageBox(
    BrowserWindow.getFocusedWindow(),
    {
      type: 'warning',
      buttons: ['Wait', 'Quit'],
      title: 'Wagerr Unresponsive',
      defaultId: 1,
      message: 'WAGERR is not responding. Would you like to quit?',
      cancelId: 0
    },
    buttonIndex => {
      if (buttonIndex === 1) {
        app.quit();
      }
    }
  );
}

export default {
  deamonRunningError,
  noPeersConnectionError,
  wagerrdStopped,
  wagerrdError,
  wagerrdUnresponsive
};
