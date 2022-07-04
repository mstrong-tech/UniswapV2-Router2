export const config = {
  server: process.env.SERVER_URL || 'http://localhost:4000/uniswap-history',
  maxBlocks: Number(process.env.MAX_BLOCKS || '25'),
  uniswapV2Router2:
    process.env.UNISWAPV2_ROUTER2 ||
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
};
