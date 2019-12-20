<template>
  <div class="col s12" style="margin-bottom:10px">
    <div v-if="this.syncMethod === this.syncMethods.SCAN_BLOCKS">      
      <button 
        class="waves-effect waves-light btn transparent"
        @click="onDownloadSnapshot"
      >
        Download Snapshot
      </button>       
    </div>
    <div v-else-if="this.syncMethod === this.syncMethods.DOWNLOAD_SNAPSHOT && this.isDownloading">
      <button 
        class="waves-effect waves-light btn transparent"
        @click="onCancelDownload"
      >
        Cancel download
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jsZip from 'jszip';
import { remote } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import ipcRenderer from '../../../common/ipc/ipcRenderer';
import { blockchainSnapshot, syncMethods } from '../../../main/constants/constants';
import { clearInterval } from 'timers';
import { mapActions } from 'vuex';
import { getWagerrDataPath } from '../../../main/blockchain/blockchain';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

export default {
  name: 'DownloadSnapshot',  
  props: ['syncMethod', 'timeBehindText'],
  data() {
    return {
      progressPercentage: 0,
      syncMethods: {...syncMethods},
      snapshotPath: '',
      isDownloading: false
    };
  },
  mounted() {
    const isDownloadSnapshot = remote.dialog.showMessageBox(remote.BrowserWindow.getFocusedWindow(), {
        type: 'question',
        buttons: ['Yes, download snapshot', 'No, sync normally'],
        message: `Your Wagerr wallet is ${this.timeBehindText}. \n\nDo you want us to download a snapshot of the blockchain to speed things up?\n`,
        cancelId: 1,
        defaultId: 0,
        detail: 'You can change your snapshot preferences in the settings section'
    }) === 0;

    if (isDownloadSnapshot) {
      this.onDownloadSnapshot();
    }
  },
  methods: {
    ...mapActions(['updateInitText']),
    onDownloadSnapshot(){
      this.$emit('update-sync-method', '');
      this.updateInitText('Stopping daemon...');
      
      // Without the timeout the app freezes before updating the init text to 'Stopping dameon...' 
      setTimeout(async function() { 
        try {
          await ipcRenderer.stopDaemon();  
          this.$emit('update-sync-method', syncMethods.DOWNLOAD_SNAPSHOT);
          
          this.updateProgressPercentageText();

          let latestSnapshotUrl = await this.getLatestSnapshotUrl();
          
          if (latestSnapshotUrl) {
            this.isDownloading = true;
            await this.downloadSnapshot(latestSnapshotUrl);            
          }
        } catch(e) {
          this.handleSnapshotDownloadError(e);          
        }
      }.bind(this), 100);      
    },
    onCancelDownload() {
      const confirmCancelDownload = remote.dialog.showMessageBox(remote.BrowserWindow.getFocusedWindow(), {
        type: 'question',
        buttons: ['Confirm', 'Cancel'],
        message: 'Are you sure you want to cancel the download?',
        cancelId: 1,
        defaultId: 0,
        detail: 'This will restart the Wagerr Wallet.'
      }) === 0;

      if (confirmCancelDownload) {
        source.cancel();

        if (fs.existsSync(this.snapshotPath)) {
          fs.unlinkSync(this.snapshotPath);
        }
        
        ipcRenderer.restartWalletForce();
      }
    },
    updateProgressPercentageText() {
      this.updateInitText(`Downloading blockchain snapshot: ${Math.round(this.progressPercentage)}%`);
    },
    _getFilenameFromHeaderResponse(response) {
      let contentDisposition = response.headers['content-disposition'];
      
      if (!contentDisposition) return blockchainSnapshot.DEFAULT_FILENAME;
      
      let matches = /filename=(.+)/g.exec(contentDisposition);
      return matches && matches.length > 1 ? matches[1] : blockchainSnapshot.DEFAULT_FILENAME;
    },
    _resolveSnapshotDataPath(response) {
      const directoryPath = path.join(getWagerrDataPath(), blockchainSnapshot.RELATIVE_DATA_PATH);
      
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }

      return path.join(directoryPath, this._getFilenameFromHeaderResponse(response));
    },
    
    downloadSnapshot: async function(url) {
      let interval = setInterval(this.updateProgressPercentageText, 1000); 

      let progress = 0, total = 0;
      
      let response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream',  
        cancelToken: source.token
      });

      total = response.headers['content-length'];
      this.snapshotPath = this._resolveSnapshotDataPath(response);
      response.data.pipe(fs.createWriteStream(this.snapshotPath));
      
      response.data.on('data', chunk => {
        progress += chunk.length;
        this.progressPercentage = (progress / total) * 100;
      });
      
      response.data.on('end', function(chunk) {
        try {
          // If not accessed through 'window' it doesn't clear the interval
          window.clearInterval(interval);
          this.isDownloading = false;
          this.updateInitText('Unzipping and copying files');          
          this.unzipSnapshot();
          
        } catch (e) { this.handleSnapshotDownloadError(e); }
      }.bind(this));
    },
    handleUnzippedFile (file, dest) {
      return file.async('nodebuffer').then(function (fileData) {
          if (file.dir) {
            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest);
            }
          } else {
            fs.writeFileSync(dest, fileData);
          }
        });
    },
    unzipSnapshot: async function() {      
      const ext = path.extname(this.snapshotPath);
      const filename = path.basename(this.snapshotPath, ext);
      const basedir = path.dirname(this.snapshotPath);

      // Create a directory with the same name as the zip file
      const unzippedSnapshotPath = path.join(basedir, filename);
      if (fs.existsSync(unzippedSnapshotPath)) {
        fs.removeSync(unzippedSnapshotPath);
      }
      fs.mkdirSync(unzippedSnapshotPath);

      // Read the zip file content
      const contentZipped = fs.readFileSync(this.snapshotPath);

      // Load zipped file
      const zip = await jsZip.loadAsync(contentZipped);
      
      // Unzip and write files to disk to temp folder
      await Promise.all(
        Object.keys(zip.files).map(async function (filename) {
          const dest = path.join(unzippedSnapshotPath, filename);
          await this.handleUnzippedFile(zip.files[filename], dest);          
        }.bind(this))
      );
      
      // Move files from temp folder to wagerr data folder
      fs.readdirSync(unzippedSnapshotPath).forEach(filename => {
        const unzippedFilePath = path.join(unzippedSnapshotPath, filename);
        const newFilePath = path.join(getWagerrDataPath(), filename);
        fs.moveSync(unzippedFilePath, newFilePath, { overwrite: true });
      });      

      // Remove snapshot zip and temp folder
      fs.removeSync(this.snapshotPath);
      fs.removeSync(unzippedSnapshotPath);

      ipcRenderer.restartWalletForce();
    },
    handleSnapshotDownloadError(err) {
      ipcRenderer.log('error', `An error occurred while trying to download the snapshot. \n\n ${err} \n\n ${err.stack}`);

      remote.dialog.showMessageBox(remote.BrowserWindow.getFocusedWindow(), {
        type: 'error',
        title: 'Wagerr Error',
        buttons: ['Ok'],
        message: `An error occurred while trying to download the snapshot.`,
        detail: 'The Wagerr Wallet will restart'
      });

      ipcRenderer.restartWalletForce();
    },
    getLatestSnapshotUrl() {  
      // Get from github the latest release url    
      return axios({
        method: 'get',
        url: blockchainSnapshot.LATEST_RELEASE_URL_FROM_GITHUB
      }).then(function (response) {
        return response.data.assets[0].browser_download_url;          
      });
    }
  }
};
</script>
<style scoped>
.btn {
  overflow: hidden;

}
.btn:hover:before {
  opacity:1;
}
.btn:before {
  content: '';
  opacity: 0;
  background-color: #191919;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: opacity .2s;
  z-index: -1;
}
</style>