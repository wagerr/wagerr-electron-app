export const mainnetParams = {
  DEFAULT_PORT: 55002,
  RPC_PORT: 55003,

  BLOCK_EXPLORER_URL: 'https://explorer.wagerr.com'
};

export const testnetParams = {
  DEFAULT_PORT: 55004,
  RPC_PORT: 55005,

  BLOCK_EXPLORER_URL: 'https://explorer2.wagerr.com'
};

export const bettingParams = {
  ODDS_DIVISOR: 10000,
  MIN_BET_AMOUNT: 25,
  MAX_BET_AMOUNT: 10000,
  NETWORK_SHARE: 0.06
};

export const syncMethods = {
  SCAN_BLOCKS: 1,
  DOWNLOAD_SNAPSHOT: 2
}

// Download snapshot treshold in weeks
export const blockchainSnapshot = {
  TRESHOLD_IN_WEEKS: 4,
  LATEST_RELEASE_URL_FROM_GITHUB: 'https://api.github.com/repos/wagerr/Wagerr-Blockchain-Snapshots/releases/latest',
  RELATIVE_DATA_PATH: 'snapshots/',
  DEFAULT_FILENAME: 'snapshot.zip'
}