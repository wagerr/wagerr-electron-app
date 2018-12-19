[![Wagerr](https://img.shields.io/badge/Website-wagerr.com-eaa809.svg)](https://www.wagerr.com/)
[![ContributorsWelcome](https://img.shields.io/badge/contributors-welcome-brightgreen.svg)](https://bitbucket.org/techsquadron1/wagerr_html5_wallet/src/master/)
[![LICENSE](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

# Wagerr HTML5 Wallet
Cross Platform HTML5 Wallet built with Electron & Vue JS.  This wallet is still in development so use at your own risk.

Make sure you back up your Wagerr wallet.dat before running this wallet.

## Prerequisites

You need the following prerequisites to be able to build and develop the project on your local machine.

#### Mac / Linux
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

#### Windows
_NodeJS:_
```
Download the windows installer here:
https://nodejs.org/en/download/
```

## Get the source
```
git clone https://github.com/TechSquad111/WagerrHTML5Wallet.git
```
_cd into the newly created local directory:_

```
cd WagerrHTML5Wallet
```
#### Install dependencies
```
npm install
```

#### Run the application

_Run in development mode:_
```
npm run dev
```


_To Build_

```
npm run build
```

_After running the build command the executable will be located in the /dist folder._

## Built With
* [Node.js](https://nodejs.org)

* [Electron](https://electronjs.org/)

* [Vue.js](https://vuejs.org/)

## Contributing
Contributing
Please read [Contributing.md](Contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
