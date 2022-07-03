export const config = {
  http: {
    port: Number(process.env.PORT || '4000'),
  },
  rpcUrl:
    process.env.RPC_URL ||
    'https://mainnet.infura.io/v3/30bba45435ad4225a9c4db8fbe324e8b',
  swapContract:
    process.env.SWAP_CONTRACT || '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  syncDelay: Number(process.env.SYNC_DELAY || '20000'),
  blocksInterval: Number(process.env.BLOCKS_ONETIME || '100'),
  maxBlocks: Number(process.env.MAX_BLOCKS || '1000'),
  feedBlocks: Number(process.env.FEED_BLOCKS || '100'),
  deployedBlock: Number(process.env.DEPLOYED_BLOCK || '10207858'),
  plainText: 'UniswapV2 Router2',
};
