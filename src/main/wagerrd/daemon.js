import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import findProcess from 'find-process';
import { ipcMain } from 'electron';
import PropertiesReader from 'properties-reader';
import errDialog from '../alerts/errors';
import { OS_PLATFORM, USER_HOME_DIR, WAGERRD_DEFAULTS } from './constants';

class Daemon {
  rpcPassword;
  rpcPort;
  rpcUser;
  testnet;
  wagerrdProcess;

  constructor() {
    this.readConfigFile();

    // Send the Wagerr config path to the render process.
    ipcMain.on('wagerrd-config-path', (event) => {
      event.returnValue = this.configPath;
    });

    // Send the Wagerr data dir path to the render process.
    ipcMain.on('wagerrd-data-dir', (event) => {
      event.returnValue = this.getDataDir(this.testnet);
    });

    // Send the RPC password to the render process.
    ipcMain.on('wagerrd-masternode-config-path', (event) => {
      event.returnValue = this.masternodeConfigPath;
    });

    // Send the Wagerr masternode path to the render process.
    ipcMain.on('wagerrd-rpc-password', (event) => {
      event.returnValue = this.rpcPassword;
    });

    // Send the RPC port to the render process.
    ipcMain.on('wagerrd-rpc-port', (event) => {
      event.returnValue = this.rpcPort;
    });

    // Send the RPC user to the render process.
    ipcMain.on('wagerrd-rpc-user', (event) => {
      event.returnValue = this.rpcUser;
    });
  }

  get testnet() {
    return this._testnet;
  }

  set testnet(value) {
    this._testnet = value;
  }

  get configPath() {
    return path.join(this.getDataDir(false), 'wagerr.conf');
  }

  get masternodeConfigPath() {
    return path.join(
      this.testnet ? this.getDataDir(true) : this.getDataDir(false),
      'masternode.conf'
    );
  }

  /**
   * Get the Wagerr data directory for the users specific OS platform.
   *
   * @returns {string}
   */
  getDataDir(isTestnet) {
    let dataPath;

    switch (OS_PLATFORM) {
      case 'darwin':
        dataPath = path.join(USER_HOME_DIR, 'Library', 'Application Support', 'WAGERR');
        break;
      case 'win32':
        dataPath = path.join(USER_HOME_DIR, 'wagerr');
        break;
      case 'linux':
        dataPath = path.join(USER_HOME_DIR, '.wagerr');
        break;
      default:
        console.log('Unsupported platform!');
        process.exit(1);
    }

    return isTestnet ? path.join(dataPath, 'testnet4') : dataPath;
  }

  /**
   * Returns the Wagerr executable file path.
   *
   * @param  {string} name
   * @return {string}
   */
  getExecutablePath(name) {
    const binPath =
      process.env.NODE_ENV === 'development'
        ? path.join(__dirname, '..', '..', '..', 'bin')
        : path.join(process.resourcesPath, 'bin');
    const execName = OS_PLATFORM !== 'win32' ? name : `${name}.exe`;

    return path.join(binPath, execName);
  }

  /**
   * Check if the wagerr.conf file exists on the users system. If so then read the contents into
   * state variables. We'll use the hard coded default values if no wagerr.conf file exists.
   */
  readConfigFile() {
    let configProperties;
    try {
      configProperties = PropertiesReader(this.configPath);
    } catch (err) {
      console.error('Error reading Wagerr config file.');
      process.exit(1);
    }

    this.testnet = configProperties.get('testnet') === 1 ? true : WAGERRD_DEFAULTS.TESTNET;
    this.rpcUser = configProperties.get('rpcuser') || WAGERRD_DEFAULTS.RPC_USER;
    this.rpcPassword = configProperties.get('rpcpassword') || WAGERRD_DEFAULTS.RPC_PASSWORD;
    this.rpcPort =
      configProperties.get('rpcport') || this.testnet
        ? WAGERRD_DEFAULTS.RPC_PORT_TESTNET
        : WAGERRD_DEFAULTS.RPC_PORT_MAINNET;
  }

  /**
   * Launch the wagerrd process with the given list of command line args.
   */
  launch(window, args) {
    const wagerrdPath = this.getExecutablePath('wagerrd');
    const wagerrdArgs = [
      `-rpcbind=127.0.0.1`,
      `-rpcallowip=127.0.0.1`,
      `-rpcport=${this.rpcPort}`,
      `-rpcuser=${this.rpcUser}`,
      `-rpcpassword=${this.rpcPassword}`,
      `-testnet=${Number(this.testnet)}`,
      ...args
    ];

    console.log(`\x1b[32m Launching daemon: ${wagerrdPath}\x1b[32m`);
    console.log(`\x1b[32m Following args used: ${wagerrdArgs}\x1b[32m`);

    // Change file permissions so we can run the wagerrd.
    fs.chmod(wagerrdPath, '0777', (err) => {
      if (err) {
        console.error(err);
      }

      // Spawn the wagerrd and attach event callbacks.
      this.wagerrdProcess = spawn(wagerrdPath, wagerrdArgs);

      this.wagerrdProcess.stdout.on('data', (data) => {
        console.log(`Daemon: ${data}`);
      });

      this.wagerrdProcess.stderr.on('data', (data) => {
        if (data.includes('Error loading block database')) {
          // this.wagerrdProcess.stop();
          window.webContents.send('wagerr-corrupt-database');
        } else {
          console.error(`Daemon: ${data}`);
        }
      });

      this.wagerrdProcess.on('error', (data) => {
        errDialog.wagerrdError(data);
      });

      this.wagerrdProcess.on('exit', (data) => errDialog.wagerrdStopped());
    });
  }

  /**
   * Stop the wagerrd process.
   *
   * @returns {Promise<void>}
   */
  async stop() {
    let running = true;
    const cliPath = this.getExecutablePath('wagerr-cli');

    // Call `wagerr-cli` to stop the Wagerr daemon.
    const wagerrcliProcess = spawn(cliPath, [
      `-rpcport=${this.rpcPort}`,
      `-rpcuser=${this.rpcUser}`,
      `-rpcpassword=${this.rpcPassword}`,
      'stop'
    ]);

    wagerrcliProcess.stdout.on('data', (data) => console.log(`Daemon: ${data}`));

    // Wait while the wagerrd exits as this can varying in time.
    while (running) {
      running = await this.isWagerrdRunning();
    }

    return Promise.resolve();
  }

  async runCommand(cmd) {
    const cliPath = this.getExecutablePath('wagerr-cli');

    // Pass command to `wagerr-cli`.
    const wagerrcliProcess = spawn(cliPath, [
      `-rpcport=${this.rpcPort}`,
      `-rpcuser=${this.rpcUser}`,
      `-rpcpassword=${this.rpcPassword}`,
      'stop'
    ]);

    wagerrcliProcess.stdout.on('data', function (data) {
      console.log(`Daemon stdout: ${data}`);
      return Promise.resolve(data.toString());
    });

    wagerrcliProcess.stderr.on('data', function (data) {
      console.log(`Daemon stderr: ${data}`);
      return Promise.resolve(data.toString());
    });

    wagerrcliProcess.on('close', function (code) {
      console.log(`Daemon closing code: ${code}`);
    });
  }

  /**
   * Check if the wagerr daemon process is running on the current system.
   *
   * @returns {Promise<boolean>}
   */
  async isWagerrdRunning() {
    const processList = await findProcess('name', 'wagerrd');

    return processList.length > 0;
  }
}

export default Daemon;
