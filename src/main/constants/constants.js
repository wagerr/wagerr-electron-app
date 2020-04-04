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

export const betsmartParams = {
  HOST: 'https://www.betsmart.app'
};

export const SPORTS_AVAILABLE = [
  {
    name: 'All Events',
    id: '',
    icon: 'icon-calendar-check',
    favorite: true
  },
  {
    name: 'Soccer',
    icon: 'icon-soccer',
    favorite: true
  },
  {
    name: 'Basketball',
    icon: 'icon-basketball',
    favorite: true
  },
  {
    name: 'Football',
    icon: 'icon-football',
    favorite: true
  },
  {
    name: 'Hockey',
    icon: 'icon-hockey',
    favorite: true
  },
  {
    name: 'Esports',
    icon: 'icon-headphones',
    favorite: true
  },
  {
    name: 'Aussie Rules',
    icon: 'icon-football',
    favorite: false
  },
  {
    name: 'Baseball',
    icon: 'icon-baseball',
    favorite: false
  },
  {
    name: 'Boxing',
    icon: 'icon-walk',
    favorite: false
  },
  {
    name: 'Cricket',
    icon: 'icon-baseball',
    favorite: false
  },
  {
    name: 'MMA',
    id: 'Mixed Martial Arts',
    icon: 'icon-bench-press',
    favorite: false
  },
  {
    name: 'Rugby League',
    icon: 'icon-football',
    favorite: false
  },
  {
    name: 'Rugby Union',
    icon: 'icon-football',
    favorite: false
  }
];

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
