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

    constructor () {

    }

    /**
     * Launch the wagerrd process with the given list of command line args.
     */
    launch (args) {
        let wagerrdPath = this.getExecutablePath('wagerrd');
        let wagerrdArgs = this.getWagerrdArgs(args);

        console.log('\x1b[32m Launching daemon: ' + wagerrdPath + '\x1b[32m');
        console.log('\x1b[32m Following args used: ' + wagerrdArgs + '\x1b[32m');

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
            let cliPath = this.getExecutablePath('wagerr-cli');

            // Call wagerr cli to stop the wagerr daemon.
            let wagerrcliProcess = spawn(cliPath, [`-rpcuser=${blockchain.rpcUser}`, `-rpcpassword=${blockchain.rpcPass}`, `-rpcport=${blockchain.rpcPort}`, 'stop']);

            wagerrcliProcess.stdout.on('data', data => console.log(`Daemon: ${data}`));

            // Wait while the wagerrd exits as this can varying in time.
            while (running){
                running = await this.isWagerrdRunning();
            }

            resolve();
        })
    }

    /**
     * Returns a Wagerr executable file path.
     *
     * @returns string
     */
    getExecutablePath(name) {
        let binPath = process.env.NODE_ENV === "development"
            ? path.join(__dirname, "..", "..", "..", "bin")
            : path.join(process.resourcesPath, "bin");
        let execName = os.platform() !== "win32" ? name : name + ".exe";

        return path.join(binPath, execName);
    }

    /**
     * Check if the wagerr daemon process is running on the current system.
     * @returns {Promise<*>}
     */
    async isWagerrdRunning () {
        let processList = await findProcess('name', `${blockchain.daemonName}`);

        return processList.length > 0;
    }

    /**
     * Daemon constructor which builds the list of args used when launching the wagerrd.
     */
    getWagerrdArgs (args) {
        // Required args.
        let wagerrdArgs = [`-rpcuser=${blockchain.rpcUser}`, `-rpcpassword=${blockchain.rpcPass}`, `-rpcbind=127.0.0.1`, `-rpcport=${blockchain.rpcPort}` ,`-server=1` ];

        // Add Supplied args if any.
        if (args) {
            wagerrdArgs.push(args);
        }

        return wagerrdArgs;
    }
}
