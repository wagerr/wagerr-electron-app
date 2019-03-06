const { app, dialog } = require('electron');

function deamonRunningError () {
    let cancel = dialog.showMessageBox({
        type: 'error',
        buttons: ['Exit'],
        message: 'Wagerr Daemon Running',
        defaultId: 0,
        detail: 'Detected a running wagerrd process! \n\nPlease stop any wagerrd processes including the QT wallet before running this wallet. \n\nWallet will now exit.'
    });

    app.quit();
}

export default {
    deamonRunningError
}



