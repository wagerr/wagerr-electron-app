import path from 'path'
import PropertiesReader from 'properties-reader'

export const environment = Object.assign({
    DEVELOPMENT: 'development',
    TEST: 'test',
    PRODUCTION: 'production',
    NETWORK: process.env.NETWORK,
    PLATFORM: process.platform,
    ENV: process.env,
    current: process.env.NODE_ENV,
    isDev: () => environment.current === environment.DEVELOPMENT,
    isTest: () => environment.current === environment.TEST,
    isProduction: () => environment.current === environment.PRODUCTION,
    isMainnet: () => environment.NETWORK === 'mainnet'
}, process.env);

export const testnet = false;
export const rpcUser = 'Marty';
export const rpcPass = 'tester';
export const masternodeCollateral = 25000;
export const daemonName = "wagerrd";
export const port = testnet ? 50002 : 50003;
export const rpcPort = testnet ? 8332 : 8332;
export const minTxFee = 0.00010000 ;
export const dustLimit = 0.0000546;

// try {
//   const walletProperties = PropertiesReader(getCoinConfPath())
//   testnet = walletProperties.get('testnet') === 1
//   rpcUser = walletProperties.get('rpcuser') || 'Marty'
//   rpcPass = walletProperties.get('rpcpassword') || 'Marty'
// } catch (e) {
//   console.log(e)
// }

export function getCoinTestDataPath () {
    switch (environment.PLATFORM) {
        case 'darwin': {
            return path.join(environment.ENV.HOME, 'Library', 'Application Support', 'WAGERR', 'testnet4');
        }
        case 'win32': {
            return path.join(environment.ENV.APPDATA, 'wagerr', 'testnet4');
        }
        case 'linux': {
            return path.join(environment.ENV.HOME, '.wager', 'testnet4');
        }
        default: {
            console.log('Unsupported platform');
            process.exit(1);
        }
    }
}

export function getCoinDataPath () {
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
            console.log('Unsupported platform');
            process.exit(1)
        }
    }
}

export function getCoinConfPath () {
    return path.join(getCoinDataPath(), 'wagerr.conf');
}

export function getCoinMasternodeConfPath () {
    return path.join(testnet ? getCoinTestDataPath() : getCoinDataPath(), 'masternode.conf');
}
