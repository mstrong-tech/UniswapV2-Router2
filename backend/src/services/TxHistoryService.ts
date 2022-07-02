import { ethers } from 'ethers';

import { config } from '../config';
import { TxHistory, UserVerification } from '../config/types';

export default class TxHistoryService {
  private lastBlockNumber = 0;
  private txHistoryRepository: TxHistory[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  checkValidation(params: any): UserVerification {
    const message = config.plainText;
    const signature = params.sign;
    // const fromBlock = parseInt(params.from as any | '0', 10);
    // const toBlock = parseInt(params.to as any | '0', 10);
    let result: UserVerification = { isValid: false, msg: 'Invalid user' };

    const address = ethers.utils.verifyMessage(message, signature);
    if (address !== params.msg) {
      console.log('not verified');
      result = { isValid: false, msg: 'Not verified!' };
      return result;
    }

    // Check from/to block numbers

    result = { isValid: true, msg: 'Verified user' };

    return result;
  }

  blockNumber(): number {
    return this.lastBlockNumber;
  }

  setBlockNumber(blockNumber: number) {
    this.lastBlockNumber = blockNumber;
  }

  addHistory(historyDto: TxHistory): number {
    return this.txHistoryRepository.push(historyDto);
  }

  addHistories(historisDto: TxHistory[]): number {
    this.txHistoryRepository = this.txHistoryRepository.concat(historisDto);
    return this.txHistoryRepository.length;
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
    console.log('block info', fromBlock, toBlock);
    return this.txHistoryRepository.filter((value) => {
      const blockNumber = value.block === undefined ? 0 : value.block;
      if (blockNumber >= fromBlock && blockNumber <= toBlock) return true;
    });
  }
}
