import fs from 'fs';
import path from 'path';
import { getWagerrDataPath } from '../blockchain/blockchain';
import { blockchainSnapshot } from '../constants/constants';

function getFilenameFromHeaderResponse(response) {
  const contentDisposition = response.headers['content-disposition'];

  if (!contentDisposition) return blockchainSnapshot.DEFAULT_FILENAME;

  const matches = /filename=(.+)/g.exec(contentDisposition);
  return matches && matches.length > 1 ? matches[1] : blockchainSnapshot.DEFAULT_FILENAME;
}

function resolveSnapshotDataPath(response) {
  const directoryPath = path.join(getWagerrDataPath(), blockchainSnapshot.RELATIVE_DATA_PATH);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  return path.join(directoryPath, getFilenameFromHeaderResponse(response));
}

export default {
  resolveSnapshotDataPath
};
