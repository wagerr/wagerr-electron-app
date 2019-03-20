const {dialog, BrowserWindow} = require('electron');

function deamonRunningError () {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {

        type: 'error',
        buttons: ['Confirm'],
        message: 'Wagerr daemon already running!',
        defaultId: 0,
        detail: 'Detected a running wagerrd process! \n\n Warning: Running this wallet with an already running deamon can cause inconsistent behaviour.'
    });
}

function noPeersConnectionError () {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
        type: 'error',
        title: 'Wagerr Network Error',
        buttons: ['Confirm'],
        message: 'Could not connect to the Wagerr network!',
        defaultId: 0,
        detail: 'No peers found. \n\nWarning: Some wallet features may not work without a Wagerr network connection.'
    });
}

export default {
    deamonRunningError,
    noPeersConnectionError
}



