/* eslint-disable no-console */
import path from 'path'
import { spawn, execSync } from 'child_process'
import { chmod } from 'fs'
import { daemonName, rpcUser, rpcPass} from './blockchain'
import coinConfig from './data/coinConfig'
import { ALLOW_INCOMING_CONNECTIONS, AUTOMINT_PERCENTAGE, DELETE_LOCAL_BLOCKCHAIN_FOLDERS, ENABLE_PROXY, ENABLE_ZEROCOIN_AUTOMINT, MAP_PORT_USING_UPNP, PREFER_DENOMINATION, PROXY_IP, PROXY_PORT, REBUILD_INDEX, RECOVER_TRANSACTIONS1, RECOVER_TRANSACTIONS2, RESCAN_BLOCKCHAIN, RESTART_TOOLS_ARG, SALVAGE_WALLET, SPEND_UNCONFIRMED_CHANGE } from './data/configKey'

const os = require('os')

/**
 * Deamon class contains methods to start, stop the Wagerr Daemon.
 */
export default class Daemon {
    subprocess
    handlers

    /**
     * Default constructor for the Daemon class.
     */
    constructor () {
        this.handlers = []
        this.argArray = [`-rpcuser=${rpcUser}`, `-rpcpassword=${rpcPass}`, `-rpcbind=127.0.0.1`, `-server=1`];

        if (coinConfig.get(SPEND_UNCONFIRMED_CHANGE)) {
            this.argArray.push(`-spendzeroconfchange`)
        }

        if (coinConfig.get(ENABLE_ZEROCOIN_AUTOMINT)) {
            this.argArray.push(`-enablezeromint=1`)

            if (coinConfig.get(AUTOMINT_PERCENTAGE)) {
                this.argArray.push(`-zeromintpercentage=${coinConfig.get(AUTOMINT_PERCENTAGE)}`)
            }

            if (coinConfig.get(PREFER_DENOMINATION)) {
                this.argArray.push(`-preferredDenom=${coinConfig.get(PREFER_DENOMINATION)}`)
            }
        }
        else {
            this.argArray.push(`-enablezeromint=0`)
        }

        if (coinConfig.get(MAP_PORT_USING_UPNP)) {
            this.argArray.push(`-upnp=1`)
        }

        if (coinConfig.get(ALLOW_INCOMING_CONNECTIONS)) {
            this.argArray.push(`-listen=1`)
        }
        else {
            this.argArray.push(`-listen=0`)
        }

        if (coinConfig.get(ENABLE_PROXY)) {
            this.argArray.push(`-proxy=${coinConfig.get(PROXY_IP)}:${coinConfig.get(PROXY_PORT)}`)
        }

        if (coinConfig.get(RESTART_TOOLS_ARG) === SALVAGE_WALLET) {
            this.argArray.push(`-salvagewallet`)
            coinConfig.set(RESTART_TOOLS_ARG, '')
        }

        if (coinConfig.get(RESTART_TOOLS_ARG) === RESCAN_BLOCKCHAIN) {
            this.argArray.push(`-rescan`)
            coinConfig.set(RESTART_TOOLS_ARG, '')
        }

        if (coinConfig.get(RESTART_TOOLS_ARG) === RECOVER_TRANSACTIONS1) {
            this.argArray.push(`-zapwallettxes=1`)
            coinConfig.set(RESTART_TOOLS_ARG, '')
        }

        if (coinConfig.get(RESTART_TOOLS_ARG) === RECOVER_TRANSACTIONS2) {
            this.argArray.push(`-zapwallettxes=2`)
            coinConfig.set(RESTART_TOOLS_ARG, '')
        }

        if (coinConfig.get(RESTART_TOOLS_ARG) === REBUILD_INDEX) {
            this.argArray.push(`-reindex`)
            coinConfig.set(RESTART_TOOLS_ARG, '')
        }

        if (coinConfig.get(RESTART_TOOLS_ARG) === DELETE_LOCAL_BLOCKCHAIN_FOLDERS) {
            this.argArray.push(`-resync`)
            coinConfig.set(RESTART_TOOLS_ARG, '')
        }

        this.path = process.env.WAGERR_DAEMON || path.join(__static, `daemon/${daemonName}${os.platform() === 'win32' ? '.exe' : ''}`).replace('app.asar', 'app.asar.unpacked')
    }

    /**
     * Run the wagerrd executable file.
     */
    launch () {
        const self = this
        console.log('\x1b[32m Launching daemon:' + this.path + '\x1b[32m')
        console.log(this.argArray)

        chmod(this.path, '0777', (err) => {
            if (err) {
                console.log(err)
            }

            self.subprocess = spawn(this.path, this.argArray)
            self.subprocess.stdout.on('data', data => console.log(`Daemon: ${data}`))
            self.subprocess.stderr.on('data', data => console.error(`Daemon: ${data}`))
            self.subprocess.on('exit', () => this.fire('exit'))
            self.subprocess.on('error', error => console.error(`Daemon: ${error}`))
        })
    }

    /**
     * Kill the wagerrd process.
     *
     * @returns {Promise<void>}
     */
    async quit () {
        if (process.platform === 'win32') {
            try {
                execSync(`taskkill /pid ${this.subprocess.pid} /t /f`)
            }
            catch (error) {
                console.error(error.message)
            }
        }
        else {
            this.subprocess.kill()
        }
    }

    // Follows the publish/subscribe pattern

    // Subscribe method
    on (event, handler, context = handler) {
        this.handlers.push({event, handler: handler.bind(context)})
    }

    // Publish method
    fire (event, args) {
        this.handlers.forEach(topic => {
            if (topic.event === event) topic.handler(args)
        })
    }
}
