const fs = require('fs');
const os = require('os');
const axios = require('axios');
const fsPath = require('fs-path');
const decompress = require('decompress');
const packageJSON = require('../../package.json');

// Supported platforms.
const OSX_64   = 'osx64';
const FILE_EXT = 'tar.gz';
const WIN_32   = 'win32';
const WIN_64   = 'win64';
const MAC      = 'darwin';
const LINUX    = 'linux';

/**
 * Download the correct Wagerr Daemon version for a users enviornment.
 *
 * @param targetPlatform
 * @returns {Promise}
 */
export const downloadWagerrDaemon = targetPlatform => {
    return new Promise((resolve, reject) => {

        const daemonURLTemplate = packageJSON.wagerrSettings.daemonUrlTemplate;
        const daemonVersion     = packageJSON.wagerrSettings.daemonVersion;
        let daemonFileName      = packageJSON.wagerrSettings.daemonFileName;
        const daemonDir         = packageJSON.wagerrSettings.daemonDir;
        let daemonOriginalName  = packageJSON.wagerrSettings.daemonOriginalName;

        let buildingPlatform = targetPlatform || os.platform()

        let daemonPlatform = 'osx64';
        let daemonExt      = 'tar.gz';

        // Mac
        if (buildingPlatform === 'darwin') {
            daemonPlatform = 'osx64';
            daemonExt      = 'tar.gz';
        }

        // Linux
        if (buildingPlatform === 'linux') {
            daemonPlatform = 'x86_64-linux-gnu';
            daemonExt      = 'tar.gz';
        }

        // Windows
        if (buildingPlatform === 'win32') {
            daemonPlatform     = 'win64';
            daemonExt          = 'zip';
            daemonFileName     = daemonFileName + '.exe';
            daemonOriginalName = daemonOriginalName + '.exe';
        }

        // Create the URL used to download the Wagerr daemon.
        const daemonURL = daemonURLTemplate
          .replace(/DAEMONVER/g, daemonVersion)
          .replace(/OSNAME/g, daemonPlatform)
          .replace(/OSEXT/g, daemonExt);
        const tmpZipPath = 'dist/daemon.' + daemonExt;

        console.log('\x1b[32m' + daemonURL, '\nDownloading daemon...\x1b[32m');

        // Send get request to download.
        axios.get(daemonURL, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/zip'
            }
        })

        .then(
            result => new Promise((resolve, reject) => {
                fsPath.writeFile(tmpZipPath, result.data, error => {
                    if (error) return reject(error);
                    return resolve()
                })
            })
        )
        .then(() => {
            return decompress(tmpZipPath, 'static/daemon/', {
                filter: file => {
                    return file.path === daemonFileName;
                },
                strip: 2
            })
        })
        .then(() => {
            //console.log('\x1b[32m Renaming Daemon...\x1b[32m');
            fs.rename(`static/daemon/wagerrd`, `${daemonDir}/${daemonOriginalName}`, function (error) {
                if (error) return reject(error);
                return resolve()
            })
        })
        .then(() => {
            console.log('\x1b[32m Daemon downloaded successfully!\x1b[0m');
            resolve(true)
        })
        .catch(error => {
            console.error(
              `\x1b[31merror\x1b[0m Daemon download failed due to: \x1b[35m${error}\x1b[0m`
            );
            reject(error)
        })
    })
};

/**
 * Checks if the wagerrd executable exists in the correct location.
 *
 * @returns {boolean}
 */
export const wagerrdExists = function() {
    return fs.existsSync('static/daemon/wagerrd') || fs.existsSync('static/daemon/wagerrd.exe')
};
