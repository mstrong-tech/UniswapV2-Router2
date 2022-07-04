import { TransactionResponse } from '@ethersproject/abstract-provider';
import { ethers } from 'ethers';

import { config } from '../config';
import { swapMethodIDs, TransactionData, ValueType } from '../config/types';
import { Log } from '../utils';

export default class TxHistoryService {
  static mockClear() {
    throw new Error('Method not implemented.');
  }
  static mockImplementation(
    arg0: () => { getTransactions: jest.Mock<any, any> },
  ) {
    throw new Error('Method not implemented.');
  }
  private provider: ethers.providers.EtherscanProvider =
    new ethers.providers.EtherscanProvider();

  private lastBlockNumber = 0;
  private txHistory: TransactionData[] = [];

  async initialize() {
    await this.syncSwapBlocks();

    setTimeout(() => {
      void this.initialize();
    }, config.syncDelay);
  }

  getLastBlockNumber(): number {
    return this.lastBlockNumber;
  }

  async getReceipt(tx: TransactionResponse): Promise<TransactionData | null> {
    // Log.d('tx hash', tx.hash);
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
    // Log.d('receipt', receipt.blockNumber);
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
    // Log.d('tx value', txValue);
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

  async getContractHistory(
    contract: string,
    fromBlock: number,
    toBlock: number,
  ) {
    const history = await this.provider.getHistory(
      contract,
      fromBlock,
      toBlock,
    );

    return history;
  }

  async addTransactions(history: any): Promise<number> {
    const promises: Promise<TransactionData | null>[] = [];
    history.forEach((tx: any) => {
      promises.push(this.getReceipt(tx));
    });
    const result = await Promise.all(promises);
    // console.log('result', result.length);
    result.forEach((item) => {
      item !== null ? this.txHistory.push(item) : null;
    });

    return this.txHistory.length;
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

      const history = await this.getContractHistory(
        config.swapContract,
        fromBlock,
        toBlock,
      );
      // Log.d(fromBlock, toBlock, history.length);
      await this.addTransactions(history);

      this.lastBlockNumber = toBlock;
    } catch (err) {
      Log.e(err);
    }
  }

  getTransactions(
    startBlock: number,
    blocks: number,
    cachedBlock: number,
  ): TransactionData[] {
    if (cachedBlock === 0) return [];

    const toBlock =
      startBlock <= 1
        ? cachedBlock
        : Math.min(cachedBlock, startBlock + blocks - 1);
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
