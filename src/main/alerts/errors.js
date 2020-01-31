import { app, dialog, BrowserWindow } from 'electron';
import i18n from '../../common/i18n/i18n';

function deamonRunningError() {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'error',
    title: i18n.t('Warning'),
    buttons: [i18n.t('Confirm')],
    message: i18n.t('Wagerr daemon already running!'),
    defaultId: 0,
    detail:
      i18n.t('Detected a running wagerrd process!') + '\n\n' + i18n.t('Warning: Running this wallet with an already running deamon can cause inconsistent behaviour.')
  });
  app.quit();
}

function noPeersConnectionError() {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'error',
    title: i18n.t('Wagerr Network Error'),
    buttons: [i18n.t('Confirm')],
    message: i18n.t('Could not connect to the Wagerr network!'),
    detail:
      `${i18n.t('No peers found.')}
      ${i18n.t('Warning: Some wallet features may not work without a Wagerr network connection.')}`
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
    title: i18n.t('Error!'),
    buttons: [i18n.t('OK')],
    message: i18n.t('Wagerr Daemon Error!'),
    detail: err.toString()
  });
}

function wagerrdUnresponsive() {
  dialog.showMessageBox(
    BrowserWindow.getFocusedWindow(),
    {
      type: 'warning',
      buttons: [i18n.t('Wait'), i18n.t('Quit')],
      title: i18n.t('Wagerr Unresponsive'),
      defaultId: 1,
      message: i18n.t('Wagerr is not responding. Would you like to quit?'),
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
