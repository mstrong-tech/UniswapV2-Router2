export const config = {
  http: {
    port: parseInt(process.env.PORT || '4000', 10),
  },
  chainId: parseInt(process.env.CHAIN_ID || '1', 10),
  rpcUrl:
    process.env.RPC_URL ||
    'https://mainnet.infura.io/v3/30bba45435ad4225a9c4db8fbe324e8b',
  // signer: process.env.SIGNER,
  // privateKey: process.env.PRIVATE_KEY,
  swapContract:
    process.env.SWAP_CONTRACT || '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  syncDelay: parseInt(process.env.SYNC_DELAY || '20000', 10),
  blocksInterval: 10,
  maxBlocks: 100,
  feedBlocks: 100,
  deployedBlock: parseInt(process.env.DEPLOYED_BLOCK || '10207858', 10),
  plainText: 'UniswapV2 Router2',
};
