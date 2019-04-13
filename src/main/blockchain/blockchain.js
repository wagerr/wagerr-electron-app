import path from 'path';
import PropertiesReader from 'properties-reader';

// Blockchain variables.
let testnet       = 0;
let rpcUser       = 'wagerr';
let rpcPass       = 'bethehouse';
let daemonName    = 'wagerrd';
let mnoCollateral = 25000;
let rpcPort       = 8332;
let minTxFee      = 0.00010000;
let dustLimit     = 0.00005460;

// Define some env values.
const environment = Object.assign({
    DEVELOPMENT:  'development',
    TEST:         'test',
    PRODUCTION:   'production',
    NETWORK:      process.env.NETWORK,
    PLATFORM:     process.platform,
    ENV:          process.env,
    current:      process.env.NODE_ENV,
    isDev:        () => environment.current === environment.DEVELOPMENT,
    isTest:       () => environment.current === environment.TEST,
    isProduction: () => environment.current === environment.PRODUCTION,
    isMainnet:    () => environment.NETWORK === 'mainnet'
}, process.env);

/**
 * Check if the wagerr.conf file exists on the users system. If so then read the contents into state variables.
 * We'll use the hard coded default values if no wagerr.conf file exists.
 *
 * @returns {boolean}
 */
function readWagerrConf(){
    try {
        const walletProperties = PropertiesReader(getWagerrConfPath());

        testnet = walletProperties.get('testnet');

        if (walletProperties.get('rpcuser')) {
            rpcUser = walletProperties.get('rpcuser');
        }

        if (walletProperties.get('rpcpassword')) {
            rpcPass = walletProperties.get('rpcpassword');
        }

        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Get the Wagerr testnet data folder path for the users specific OS platform.
 */
function getWagerrTestnetDataPath () {
    switch (environment.PLATFORM) {
        case 'darwin': {
            return path.join(environment.ENV.HOME, 'Library', 'Application Support', 'WAGERR', 'testnet4');
        }
        case 'win32': {
            return path.join(environment.ENV.APPDATA, 'wagerr', 'testnet4');
        }
        case 'linux': {
            return path.join(environment.ENV.HOME, '.wagerr', 'testnet4');
        }
        default: {
            console.error('Unsupported platform');
            process.exit(1);
        }
    }
}

/**
 * Get the Wagerr data folder path for the users specific OS platform.
 *
 * @returns {*}
 */
function getWagerrDataPath () {
    switch (environment.PLATFORM) {
        case 'darwin': {
            return path.join(environment.ENV.HOME, 'Library', 'Application Support', 'WAGERR');
        }
        case 'win32': {
            return path.join(environment.ENV.APPDATA, 'wagerr');
        }
        case 'linux': {
            return path.join(environment.ENV.HOME, '.wagerr');
        }
        default: {
            console.log('Unsupported platform!');
            process.exit(1)
        }
    }
}

/**
 * Get the wagerr.conf file path for the users specific OS platform.
 *
 * @returns {*}
 */
function getWagerrConfPath () {
    return path.join(getWagerrDataPath(), 'wagerr.conf');
}

/**
 * Get the Wagerr masternode.conf file path for the users specific OS platform.
 *
 * @returns {*}
 */
function getCoinMasternodeConfPath () {
    return path.join(testnet ? getCoinTestDataPath() : getCoinDataPath(), 'masternode.conf');
}

export {
    testnet,
    rpcUser,
    rpcPass,
    daemonName,
    readWagerrConf,
    getWagerrTestnetDataPath,
    getWagerrDataPath,
    getWagerrConfPath,
    getCoinMasternodeConfPath,
};