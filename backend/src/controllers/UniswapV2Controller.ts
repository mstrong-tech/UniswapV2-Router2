import { ethers } from 'ethers';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';

import { config } from '../config';
import { swapMethodIDs, TxHistory, UserVerification } from '../config/types';
import { TxHistoryService } from '../services';
import { Log } from '../utils';

export default class UniswapV2Controller {
  private static txHistoryService = new TxHistoryService();

  constructor() {
    void this.init();
  }

  async init() {
    await this.syncSwapBlocks();

    setTimeout(() => {
      void this.init();
    }, config.syncDelay);
  }

  async syncSwapBlocks() {
    try {
      const provider = new ethers.providers.EtherscanProvider();

      const fromBlockCached: number =
        UniswapV2Controller.txHistoryService.blockNumber();
      const currentBlock: number = await provider.getBlockNumber();

      const fromBlock: number =
        fromBlockCached === 0
          ? Math.max(currentBlock - config.maxBlocks, config.deployedBlock)
          : fromBlockCached + 1;
      const toBlock = Math.min(fromBlock + config.blocksInterval, currentBlock);
      if (fromBlock > toBlock) {
        // Log.w('Already fetched all blocks');
        return;
      }
      const history = await provider.getHistory(
        config.swapContract,
        fromBlock,
        toBlock,
      );

      const filteredTxs: TxHistory[] = [];
      for (const tx of history) {
        const data = tx.data;
        let methodName = 'Other';
        let valueEther = false;
        const swapTx = swapMethodIDs.filter((item) => {
          if (data.indexOf(item.methodID) !== -1) {
            if (item.value === 'Ether') valueEther = true;
            methodName = item.function;

            return true;
          }
        });

        let txValue = '';
        let txFee = '';

        if (swapTx.length === 0) continue;

        const swapEventTopic = ethers.utils.id(
          'Swap(address,uint256,uint256,uint256,uint256,address)',
        );

        const receipt = await provider.getTransactionReceipt(tx.hash);
        if (receipt.status === 0 || receipt.logs.length === 0) continue;

        const swapLogs = receipt.logs.filter(
          (log) => log.topics[0] === swapEventTopic,
        );
        const lastSwapEvent = swapLogs.slice(-1)[0];

        const swapInterface = new ethers.utils.Interface([
          'event Swap (address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)',
        ]);

        const parsed = swapInterface.parseLog(lastSwapEvent);

        const receivedTokens = valueEther ? parsed.args.amount1In : 0;
        txValue = ethers.utils.formatEther(receivedTokens);

        txFee = ethers.utils.formatEther(tx.gasPrice?.mul(tx.gasLimit) as any);

        const transaction: TxHistory = {
          txnHash: tx.hash,
          method: methodName,
          block: tx.blockNumber,
          age: tx.timestamp,
          from: tx.from,
          to: tx.to,
          value: txValue,
          fee: txFee,
        };

        // Log.d(`sync transaction: ${JSON.stringify(transaction)}`);
        filteredTxs.push(transaction);

        const record =
          UniswapV2Controller.txHistoryService.addHistory(transaction);
        // console.log('record', record);
      }

      // Log.d(fromBlock, toBlock, filteredTxs.length);
      // if (filteredTxs.length > 0) {
      //   const records: number =
      //     UniswapV2Controller.txHistoryService.addHistories(filteredTxs);
      //   // Log.d(
      //   //   `Length ${records}, ${filteredTxs.length} transactions are stored successfully`,
      //   // );
      // }

      UniswapV2Controller.txHistoryService.setBlockNumber(toBlock);
    } catch (err) {
      Log.e(err);
    }
  }

  /**
   * Request handler for `uniswap-history` url
   * @param req Express Request
   * @param res Express Response
   * @returns Http response with status and json
   */
  async routing(req: Request, res: Response) {
    // Check if request parameters is valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Log.e('> error', JSON.stringify(errors.array()));
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const params = req.query;
    Log.d('> routing', params);

    try {
      const fromBlock = parseInt(params.last as any, 10);
      const blocks = parseInt(params.size as any, 10);

      const result: UserVerification =
        UniswapV2Controller.txHistoryService.checkValidation(params);

      if (!result.isValid) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: result.msg,
            },
          ],
        });
      }

      const txHistories = UniswapV2Controller.txHistoryService.histories(
        fromBlock,
        blocks,
      );
      // console.log('length', txHistories.length);
      const jsonData = { history: txHistories };

      return res.json(jsonData);
    } catch (error: any) {
      Log.e('routing error', error);
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .send('Server Error');
    }
  }
}
