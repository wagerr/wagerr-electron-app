const RpcClient = jest.genMockFromModule('wagerrd-rpc');

export default {
  client: new RpcClient({
    protocol: 'http',
    user: 'user',
    pass: 'pass',
    host: '127.0.0.1',
    port: '55005'
  })
};
