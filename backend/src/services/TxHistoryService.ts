import { TransactionResponse } from '@ethersproject/abstract-provider';
import { ethers } from 'ethers';

import { config } from '../config';
import { swapMethodIDs, TxHistory, ValueType } from '../config/types';
import { Log } from '../utils';

export default class TxHistoryService {
  private provider: ethers.providers.EtherscanProvider =
    new ethers.providers.EtherscanProvider();

  private lastBlockNumber = 0;
  private txHistory: TxHistory[] = [];

  async initialize() {
    await this.syncSwapBlocks();

    setTimeout(() => {
      void this.initialize();
    }, config.syncDelay);
  }

  private async getReceipt(tx: TransactionResponse): Promise<TxHistory | null> {
    const data = tx.data;

    const found = swapMethodIDs.find(
      (method) => data.indexOf(method.methodID) >= 0,
    );
    if (!found) return null;

    const swapEventTopic = ethers.utils.id(
      'Swap(address,uint256,uint256,uint256,uint256,address)',
    );

    const receipt = await this.provider.getTransactionReceipt(tx.hash);
    if (receipt.status === 0 || receipt.logs.length === 0) return null;

    const swapLogs = receipt.logs.filter(
      (log) => log.topics[0] === swapEventTopic,
    );
    const lastSwapEvent = swapLogs.slice(-1)[0];

    const swapInterface = new ethers.utils.Interface([
      'event Swap (address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)',
    ]);

    const parsed = swapInterface.parseLog(lastSwapEvent);

    const receivedTokens =
      found.value === ValueType.Ether ? parsed.args.amount1In : 0;
    const txValue = ethers.utils.formatEther(receivedTokens);

    const txFee = ethers.utils.formatEther(
      tx.gasPrice?.mul(tx.gasLimit) as any,
    );

    return {
      txnHash: tx.hash,
      method: found.function,
      block: tx.blockNumber,
      age: tx.timestamp,
      from: tx.from,
      to: tx.to,
      value: txValue,
      fee: txFee,
    };
  }

  private async syncSwapBlocks() {
    try {
      const fromBlockCached: number = this.lastBlockNumber;
      const currentBlock: number = await this.provider.getBlockNumber();

      const fromBlock: number =
        fromBlockCached === 0
          ? Math.max(currentBlock - config.maxBlocks, config.deployedBlock)
          : fromBlockCached + 1;
      const toBlock = Math.min(fromBlock + config.blocksInterval, currentBlock);
      if (fromBlock > toBlock) {
        // Log.w('Already fetched all blocks');
        return;
      }

      const history = await this.provider.getHistory(
        config.swapContract,
        fromBlock,
        toBlock,
      );

      const promises: Promise<TxHistory | null>[] = [];
      history.forEach((tx) => {
        promises.push(this.getReceipt(tx));
      });
      const result = await Promise.all(promises);
      result.forEach((item) => {
        item !== null ? this.txHistory.push(item) : null;
      });

      this.lastBlockNumber = toBlock;
    } catch (err) {
      Log.e(err);
    }
  }

  histories(startBlock: number, blocks: number): TxHistory[] {
    if (this.lastBlockNumber === 0) return [];

    const toBlock =
      startBlock <= 1
        ? this.lastBlockNumber
        : Math.min(this.lastBlockNumber, startBlock + blocks - 1);
    const fromBlock =
      startBlock <= 1
        ? toBlock - Math.min(config.feedBlocks, blocks)
        : startBlock;
    // console.log('block info', fromBlock, toBlock);
    return this.txHistory.filter(
      (tx) => tx.block && tx.block >= fromBlock && tx.block <= toBlock,
    );
  }
}
