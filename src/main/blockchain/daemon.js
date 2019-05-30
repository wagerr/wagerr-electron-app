import os from 'os';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import decompress from 'decompress';
import findProcess from 'find-process';
import { app, BrowserWindow, dialog } from 'electron';
import errDialog from '../alerts/errors';
import constants from '../constants/constants';
import * as blockchain from './blockchain';

const request = require('request');
const packageJSON = require('../../../package.json');

export default class Daemon {
  wagerrdProcess;

  constructor() {}

  /**
   * Launch the wagerrd process with the given list of command line args.
   */
  runCommand(cmd) {
    return new Promise(async resolve => {
      const cliPath = this.getExecutablePath('wagerr-cli');
      // Call wagerr cli to stop the wagerr daemon.
      const wagerrcliProcess = spawn(cliPath, [
        `-rpcuser=${blockchain.rpcUser}`,
        `-rpcpassword=${blockchain.rpcPass}`,
        `-rpcport=${blockchain.rpcPort}`,
        `${cmd}`
      ]);

      wagerrcliProcess.stdout.on('data', function(data) {
        console.log(`Daemon stdout: ${data}`);
        resolve(data.toString());
        // Here is where the output goes
      });
      wagerrcliProcess.stderr.on('data', function(data) {
        console.log(`Daemon stderr: ${data}`);
        resolve(data.toString());
        // Here is where the error output goes
      });
      wagerrcliProcess.on('close', function(code) {
        console.log(`Daemon closing code: ${code}`);
        // Here you can get the exit code of the script
      });
      // Wait while the wagerrd exits as this can varying in time.
    });
  }

  launch(args) {
    const wagerrdPath = this.getExecutablePath('wagerrd');
    const wagerrdArgs = this.getWagerrdArgs(args);

    console.log(`\x1b[32m Launching daemon: ${wagerrdPath}\x1b[32m`);
    console.log(`\x1b[32m Following args used: ${wagerrdArgs}\x1b[32m`);

    // Change file permissions so we can run the wagerrd.
    fs.chmod(wagerrdPath, '0777', err => {
      if (err) {
        console.error(err);
      }

      // Spawn the wagerrd and attach event callbacks.
      this.wagerrdProcess = spawn(wagerrdPath, wagerrdArgs);
      this.wagerrdProcess.stdout.on('data', data =>
        console.log(`Daemon: ${data}`)
      );
      this.wagerrdProcess.stderr.on('data', data =>
        console.error(`Daemon: ${data}`)
      );
      this.wagerrdProcess.on('error', data => errDialog.wagerrdError(data));
      this.wagerrdProcess.on('exit', data => errDialog.wagerrdStopped());
    });
  }

  /**
   * Stop the wagerrd process.
   *
   * @returns {Promise<void>}
   */
  stop() {
    return new Promise(async resolve => {
      let running = true;
      const cliPath = this.getExecutablePath('wagerr-cli');

      // Call wagerr cli to stop the wagerr daemon.
      const wagerrcliProcess = spawn(cliPath, [
        `-rpcuser=${blockchain.rpcUser}`,
        `-rpcpassword=${blockchain.rpcPass}`,
        `-rpcport=${blockchain.rpcPort}`,
        'stop'
      ]);
      wagerrcliProcess.stdout.on('data', data =>
        console.log(`Daemon: ${data}`)
      );
      // Wait while the wagerrd exits as this can varying in time.
      while (running) {
        running = await this.isWagerrdRunning();
      }

      resolve();
    });
  }

  /**
   * Returns a Wagerr executable file path.
   *
   * @returns string
   */
  getExecutablePath(name) {
    const binPath =
      process.env.NODE_ENV === 'development'
        ? path.join(__dirname, '..', '..', '..', 'bin')
        : path.join(process.resourcesPath, 'bin');
    const execName = os.platform() !== 'win32' ? name : `${name}.exe`;

    return path.join(binPath, execName);
  }

  /**
   * Check if the wagerr daemon process is running on the current system.
   * @returns {Promise<*>}
   */
  async isWagerrdRunning() {
    const processList = await findProcess('name', `${blockchain.daemonName}`);

    return processList.length > 0;
  }

  /**
   * Daemon constructor which builds the list of args used when launching the wagerrd.
   */
  getWagerrdArgs(args) {
    // Required args.
    const wagerrdArgs = [
      `-rpcuser=${blockchain.rpcUser}`,
      `-rpcpassword=${blockchain.rpcPass}`,
      `-rpcbind=127.0.0.1`,
      `-rpcport=${blockchain.rpcPort}`,
      `-server=1`
    ];

    // Add Supplied args if any.
    if (args) {
      wagerrdArgs.push(args);
    }

    return wagerrdArgs;
  }
}
