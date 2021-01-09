import os from 'os';
import { uuidv4 } from '../utils/utils';

export const OS_PLATFORM = os.platform();
export const USER_HOME_DIR = os.homedir();

export const WAGERRD_DEFAULTS = {
  RPC_USER: uuidv4(),
  RPC_PASSWORD: uuidv4(),
  RPC_PORT_MAINNET: 55003,
  RPC_PORT_TESTNET: 55005,
  TESTNET: false
};
