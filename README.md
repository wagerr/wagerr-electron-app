Wagerr Electron App
===================

[![Build Status](https://travis-ci.com/wagerr/wagerr-electron-app.svg?branch=master)](https://travis-ci.com/wagerr/wagerr-electron-app)

A modern cross-platform GUI for Wagerr built with
[Electron](https://electronjs.org/) & [Vue.js](https://vuejs.org/).

Prerequisites
-------------

Make sure you back up your Wagerr `wallet.dat` before developing on this app.

You need the following prerequisites to be able to build and develop the project
on your local machine.

- Node.js
- npm

Install
-------

Clone the repo:

```sh
git clone https://github.com/wagerr/wagerr-electron-app.git
```

Change directory into the cloned repository:

```sh
cd wagerr-electron-app
```

Install dependencies with npm:

```sh
npm install
```

Place `wagerrd` and `wagerr-cli` binaries in a `bin` directory in the the root
of your repo:

```sh
mkdir bin

# Fetch the applicable release from https://github.com/wagerr/wagerr/releases
# for your OS and architecture and unzip the `wagerrd` and `wagerr-cli` binaries
# into the `bin` folder.
```

Development
-----------

Run in development mode:

```sh
npm run dev
```

Before submitting a patch we highly recommend running the linting and formatting
scripts:

```sh
npm run lint-fix && npm run lint-styles-fix
```

Package for Distribution
------------------------

To package the app for distribution (don't forget to copy the `wagerrd` and
`wagerr-cli` binaries into the `bin` folder before packaging the app):

```sh
npm run package
```

After running the package command the executable will be located in the
`release` folder.

Code Signing / Notarization
---------------------------

To code sign the packaged app (as well as notarize the Mac version) you must set the following
environment variables before running `npm run package`.

macOS:

⚠️ **When signing/notarizing the Mac app there can be long delays while the app is being uploaded
and scanned by the Apple Notary Service. According to the Apple documentation this process
_"usually takes less than an hour"_...**

```sh
# macOS - Name of signing certificate to retrieve from Keychain.
export CSC_NAME='Wagerr Limited'

# macOS - An Apple developer ID associated with the signing certificate (used for uploading builds
#         to the Apple Notary Service for verification and notarization).
#
#         Notes:
#         - We recommend generating an app specific password and do not use your main account
#           password.
#         - To see a list of provider short names that your Apple account can access run:
#           `xcrun altool --list-providers -u <USERNAME> -p <PASSWORD>`
export APPLE_ID=''
export APPLE_ID_PASS=''
export APPLE_PROVIDER_SHORT_NAME=''
```

Windows:

```sh
# Windows (PowerShell) - Path to *.pfx certificate relative to root of project
$env:CSC_LINK='build\WagerrLimited.pfx'

# Optional - The password to decrypt the certificate given in CSC_LINK
$env:CSC_KEY_PASSWORD='Password123!'
```

Contributing
------------

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of
conduct, and the process for submitting pull requests to us.

License
-------

Licensed under the [MIT](LICENSE.md) License.
