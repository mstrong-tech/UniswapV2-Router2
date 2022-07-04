import { ethers } from 'ethers';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';

import { config } from '../config';
import { UserVerification } from '../config/types';
import { TxHistoryService } from '../services';
import { Log } from '../utils';

export default class UniswapV2Controller {
  private static txHistoryService = new TxHistoryService();

  constructor() {
    void UniswapV2Controller.txHistoryService.initialize();
  }

  static verifyUser(params: any): UserVerification {
    const message = config.plainText;
    const signature = params.sign;
    let result: UserVerification = { isValid: false, msg: 'Invalid user' };

    const address = ethers.utils.verifyMessage(message, signature);
    if (address !== params.msg) {
      result = { isValid: false, msg: 'User verification failed' };
      console.log(result.msg);
      return result;
    }

    result = { isValid: true, msg: 'Verified user' };
    return result;
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
    const result = UniswapV2Controller.verifyUser(params);
    if (!result.isValid) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: result.msg,
          },
        ],
      });
    }

    try {
      const fromBlock = Number(params.last);
      const blocks = Number(params.size);

      const txHistories = UniswapV2Controller.txHistoryService.getTransactions(
        fromBlock,
        blocks,
        UniswapV2Controller.txHistoryService.getLastBlockNumber(),
      );
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
