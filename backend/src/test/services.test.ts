import { config } from '../config';
import { TransactionData } from '../config/types';
import { TxHistoryService } from '../services';

describe('Test services', () => {
  const txService = new TxHistoryService();
  let history: any[] = [];
  const testBlock = 15071181;

  test('Get contract history', async () => {
    history = await txService.getContractHistory(
      config.swapContract,
      testBlock,
      testBlock,
    );

    expect(history[0].hash).toStrictEqual(
      '0xed2584935dbbefaa614d1c4ef1dd2e3c3c25abe85055548bb1fcf60d972e9f0f',
    );
    expect(history[1].hash).toStrictEqual(
      '0x0053b9986e0493265f26b3980eea1b7c2176f45c33dcc3818fe24b352c9a1311',
    );
  });

  test('Get transaction receipt, positive case', async () => {
    if (history.length === 0) {
      history = await txService.getContractHistory(
        config.swapContract,
        testBlock,
        testBlock,
      );
    }

    const txData: TransactionData | null = await txService.getReceipt(
      history[1],
    );

    expect(txData && txData.txnHash).toStrictEqual(history[1].hash);
    expect(txData && txData.from.toLowerCase()).toStrictEqual(
      '0x6aac2ed7e7db046dec5ede5c701462611e4ff025',
    );
    expect(txData && txData.block).toStrictEqual(15071181);
  });

  test('Get transaction receipt, negative case', async () => {
    if (history.length === 0) {
      history = await txService.getContractHistory(
        config.swapContract,
        testBlock,
        testBlock,
      );
    }

    const txData: TransactionData | null = await txService.getReceipt(
      history[0],
    );
    expect(txData).toBeFalsy();
  });

  test('Add transaction data', async () => {
    if (history.length === 0) {
      history = await txService.getContractHistory(
        config.swapContract,
        testBlock,
        testBlock,
      );
    }

    const txHistorySize = await txService.addTransactions(history);

    expect(txHistorySize).toBeGreaterThanOrEqual(1);
  });

  test('Get transactions', async () => {
    if (history.length === 0) {
      history = await txService.getContractHistory(
        config.swapContract,
        testBlock,
        testBlock,
      );
    }

    const txHistorySize = await txService.addTransactions(history);

    expect(txHistorySize).toBeGreaterThanOrEqual(1);

    const txs = txService.getTransactions(testBlock, 1, testBlock);
    expect(txs && txs[0].txnHash).toStrictEqual(
      '0x0053b9986e0493265f26b3980eea1b7c2176f45c33dcc3818fe24b352c9a1311',
    );
  });
});
