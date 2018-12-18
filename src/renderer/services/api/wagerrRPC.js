import * as WagerrdRPC from 'wagerrd-rpc'

export default {
  client: new WagerrdRPC({
    protocol: 'http',
    user: 'Marty',
    pass: 'tester',
    host: '127.0.0.1',
    port: '8332'
  })
}
