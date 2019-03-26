import os from 'os';
import fs from 'fs';
import path from 'path';
import {spawn} from 'child_process';
import decompress from 'decompress';
import findProcess from "find-process";
import errDialog from '../alerts/errors';
import {app, BrowserWindow} from 'electron';
import constants from '../constants/constants';
import * as blockchain from '../blockchain/blockchain';

const request = require('request');
const packageJSON = require('../../../package.json');

export default class Daemon {

    wagerrdProcess;
    downloadWin;

    constructor () {

    }

    /**
     * Launch the wagerrd process with the given list of command line args.
     */
    launch (args) {
        let wagerrdPath = this.getWagerrdPath();
        let wagerrdArgs = this.getWagerrdArgs(args);

        console.log('\x1b[32m Launching daemon:' + wagerrdPath + '\x1b[32m');
        console.log('\x1b[32m Following args used:' + wagerrdArgs + '\x1b[32m');

        // Change file permissions so we can run the wagerrd.
        fs.chmod(wagerrdPath, '0777', (err) => {
            if (err) {
                console.error(err)
            }

            // Spawn the wagerrd and attach event callbacks.
            this.wagerrdProcess = spawn(wagerrdPath, wagerrdArgs);
            this.wagerrdProcess.stdout.on('data', data => console.log(`Daemon: ${data}`));
            this.wagerrdProcess.stderr.on('data', data => console.error(`Daemon: ${data}`));
            this.wagerrdProcess.on('error', data => errDialog.wagerrdError(data));
            this.wagerrdProcess.on('exit', data => errDialog.wagerrdStopped());
        });
    }

    /**
     * Stop the wagerrd process.
     *
     * @returns {Promise<void>}
     */
    stop () {
        return new Promise(async (resolve) => {

            let running = true;
            let cliPath = this.getWagerrCliPath();

            // Call wagerr cli to stop the wagerr daemon.
            let wagerrcliProcess = spawn(cliPath, ['stop']);

            wagerrcliProcess.stdout.on('data', data => console.log(`Daemon: ${data}`));

            // Wait while the wagerrd exits as this can varying in time.
            while (running){
                running = await this.isWagerrdRunning();
            }

            resolve();
        })
    }

    /**
     * Download the correct Wagerr Daemon version for a users environment.
     *
     * @returns {Promise}
     */
    async downloadWagerrDaemon () {
        return new Promise((resolve, reject) => {

            // First show the wagerr daemon download window so we can show progress to user.
            this.showDownloadDameonWindow();

            // Check the users platform so we can download the right wagerr daemon and wagerr-cli.
            let platform = os.platform();

            let daemonPlatform = '';
            let daemonExt      = '';
            let receivedBytes  = 0;
            let totalBytes     = 0;

            // Mac
            if (platform === constants.MAC) {
                daemonPlatform = constants.OSX_64;
                daemonExt      = constants.TAR_EXT;
            }
            // Linux
            if (platform === constants.LINUX) {
                daemonPlatform = constants.LINUX_X86_64;
                daemonExt      = constants.TAR_EXT;
            }
            // Windows
            if (platform === constants.WIN_32) {
                daemonPlatform = constants.WIN_64;
                daemonExt      = constants.ZIP_EXT;
            }

            // Create the URL used to download the Wagerr daemon and cli.
            const daemonURLTemplate = packageJSON.wagerrSettings.daemonUrlTemplate;
            const daemonVersion     = packageJSON.wagerrSettings.daemonVersion;

            const daemonURL = daemonURLTemplate
                .replace(/DAEMONVER/g, daemonVersion)
                .replace(/OSNAME/g, daemonPlatform)
                .replace(/OSEXT/g, daemonExt);

            const tmpZipPath = app.getPath('userData') + '/daemon.' + daemonExt;

            console.log('\x1b[32m' + daemonURL, '\nDownloading daemon...\x1b[32m');

            // Send GET request to download the wagerr daemon and cli.
            let req = request({
                method: 'GET',
                uri: daemonURL
            });

            // Write data to disk.
            let out = fs.createWriteStream(tmpZipPath);
            req.pipe(out);

            // Get the total download size in bytes.
            req.on('response', function (data) {
                totalBytes = parseInt(data.headers['content-length']);
            });

            // Update the download status by sending the percentage to the download render window.
            req.on('data', function (chunk) {
                receivedBytes += chunk.length;
                let percentage = Math.round((receivedBytes * 100) / totalBytes);

                this.downloadWin.webContents.send('download-percentage', percentage);
            }.bind(this));

            // When download is finished, unpack the tar file to extract the wagerr daemon and wagerr-cli.
            req.on('end', function () {
                decompress(tmpZipPath, app.getPath('userData'), {
                    filter: file => {
                        return file.path === blockchain.daemonName || file.path === blockchain.cliName;
                    },
                    strip: 2
                })
                .then(() => {
                    console.log('\x1b[32m Wagerr daemon and cli downloaded sucessfully...\x1b[32m');
                    this.downloadWin.close();
                    resolve();
                })
                .catch(error => {
                    console.error(`\x1b[31m error \x1b[0m Wagerr daemon and cli download failed due to: \x1b[35m${error}\x1b[0m`);
                    reject(error);
                });
            }.bind(this))
        });
    }

    /**
     * Checks if the wagerrd executable exists in the correct location.
     *
     * @returns {boolean}
     */
    wagerrdExists () {
        return fs.existsSync(app.getPath('userData') + `/${blockchain.daemonName}${os.platform() === 'win32' ? '.exe' : ''}`);
    }

    /**
     * Check if the wagerr daemon process is running on the current system.
     * @returns {Promise<*>}
     */
    async isWagerrdRunning () {
        let processList = await findProcess('name', `${blockchain.daemonName}`);

        let platform = os.platform();

        if (platform === 'linux'){
            return processList.length > 1;
        }
        else {
            return processList.length > 0;
        }
    }

    /**
     * Returns the wagerrd file path.
     *
     * @returns string
     */
    getWagerrdPath () {
        return process.env.WAGERR_DAEMON || app.getPath('userData') + `/${blockchain.daemonName}${os.platform() === 'win32' ? '.exe' : ''}`
    }

    /**
     * Returns the wagerr-cli file path.
     *
     * @returns string
     */
    getWagerrCliPath () {
        return process.env.WAGERR_DAEMON || app.getPath('userData') + '/' + `${blockchain.cliName}${os.platform() === 'win32' ? '.exe' : ''}`
    }

    /**
     * Daemon constructor which builds the list of args used when launching the wagerrd.
     */
    getWagerrdArgs (args) {
        // Required args.
        let wagerrdArgs = [`-rpcuser=${blockchain.rpcUser}`, `-rpcpassword=${blockchain.rpcPass}`, `-rpcbind=127.0.0.1`, `-rpcport=8332` ,`-server=1` ];

        // Add Supplied args if any.
        if (args) {
            wagerrdArgs.push(args);
        }

        return wagerrdArgs;
    }

    /**
     * Creates the browser window to show the download status of the wagerr daemon.
     */
    showDownloadDameonWindow () {
        // Create the browser window.
        this.downloadWin = new BrowserWindow({
            backgroundColor: '#2B2C2D',
            height: 270,
            width: 500,
            minHeight: 270,
            minWidth: 500,
            show: false,
            icon:  path.join(__dirname, '../renderer/assets/images/icons/png/256.png'),
        });

        // Emitted when the window is closed.
        this.downloadWin.on('closed', () => {
            this.downloadWin = null
        });

        this.downloadWin.webContents.closeDevTools();

        this.downloadWin.loadFile(path.join(__static,'/html/download_daemon.html'));

        // Once download status window ready then show it.
        this.downloadWin.once('ready-to-show', () => {
            this.downloadWin.show();
            this.downloadWin.focus();
        });

    }

}
