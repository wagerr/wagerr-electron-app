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

export const SPORTS_AVAILABLE =  [
  {
    name: 'All Events',
    searchTerm: '',
    icon: 'icon-calendar-check'
  }, {
    name: 'Football',    
    icon: 'icon-football'
  }, {
    name: 'Baseball',    
    icon: 'icon-baseball'
  }, {
    name: 'Basketball',    
    icon: 'icon-basketball'
  }, {
    name: 'Hockey',    
    icon: 'icon-hockey'
  }, {
    name: 'Soccer',    
    icon: 'icon-soccer'
  }, {
    name: 'MMA',    
    searchTerm: 'Mixed Martial Arts',
    icon: 'icon-bench-press'
  }, {
    name: 'Aussie Rules',    
    icon: 'icon-football'
  }, {
    name: 'Cricket',    
    icon: 'icon-baseball'
  }, {
    name: 'Rugby Union',    
    icon: 'icon-football'
  }, {
    name: 'Rugby League',    
    icon: 'icon-football'
  }
];