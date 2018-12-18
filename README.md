[![Wagerr](https://img.shields.io/badge/Website-wagerr.com-eaa809.svg)](https://www.wagerr.com/)
[![ContributorsWelcome](https://img.shields.io/badge/contributors-welcome-brightgreen.svg)](https://bitbucket.org/techsquadron1/wagerr_html5_wallet/src/master/)
[![LICENSE](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

# Wagerr HTML5 Wallet
Cross Platform HTML5 Wallet built with Vue JS.  This wallet is still in development so use at your own risk.
Make sure you back up your Wagerr wallet before running this.

## Prerequisites

You need the following prerequisites to be able to build and develop the project on your local machine.

### Mac / Linux
_NodeJS_: Use NVM to install and manage your NodeJS installation - https://github.com/creationix/nvm
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
or Wget
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
The script clones the nvm repository to ~/.nvm and adds the source line to your profile (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc).

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

### Windows
_NodeJS:_
```
Download the windows installer here:
https://nodejs.org/en/download/
```

### Wagerr Daemon
The Wagerr Daemon is located in the /static folder. Currently Mac & Linux builds are supported.

cd into the folder that corresponds to you OS.

/mac_build for Mac users.
/linux_build for Linux users.

You can run either the wagerr-qt or the wagerrd to start the daemon:
```
./wagerrd
```



### Get the Source
```
git clone https://bitbucket.org/techsquadron1/wagerr_html5_wallet/src/master/
```
_Enter into the newly created directory_

```
cd wagerr_html5_wallet
```
### Install Dependencies
```
npm install
```

### Run the application

_Run in development mode:_
```
npm run dev
```

_After this a URL should be returned to the terminal:_
```
e.g. Your application is running here: http://localhost:8080

```

_Paste the URL into your browser address bar and the Wagerr wallet will be displayed._



_To Build_

```
npm run build
```

## Built With
* [Node.js](https://nodejs.org)

* [Vue.js](https://vuejs.org/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
