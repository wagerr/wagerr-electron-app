import Store from 'electron-store'

export default new Store({
    defaults: {
        KEY_ENABLE_COIN_CONTROL: false,
        SPEND_UNCONFIRMED_CHANGE: false,
        ENABLE_ZEROCOIN_AUTOMINT: false,
        AUTOMINT_PERCENTAGE: 10,
        PREFER_DENOMINATION: 0,
        MAP_PORT_USING_UPNP: false,
        ALLOW_INCOMING_CONNECTIONS: true,
        ENABLE_PROXY: false,
        PROXY_IP: '127.0.0.1',
        PROXY_PORT: '5000',
        RESTART_TOOLS_ARG: ''
    },
    name: 'CoinConfig'
})
