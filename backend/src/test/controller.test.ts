import supertest from 'supertest';

import app from '../app';
import { TransactionData } from '../config/types';
import { UniswapV2Controller } from '../controllers';
import { TxHistoryService } from '../services';

jest.mock('../services');

const mockFunc = jest
  .spyOn(TxHistoryService.prototype, 'getTransactions')
  .mockImplementation(
    (
      startBlock: number,
      blocks: number,
      cachedBlock: number,
    ): TransactionData[] => {
      return [
        {
          txnHash:
            '0x0053b9986e0493265f26b3980eea1b7c2176f45c33dcc3818fe24b352c9a1311',
          method: 'swapExactETHForTokens',
          block: 15071181,
          age: 0,
          from: '0x6aac2ed7e7db046dec5ede5c701462611e4ff025',
          to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
          value: '0.2990511263',
          fee: '0.00000002',
        },
      ];
    },
  );

// eslint-disable-next-line @typescript-eslint/no-empty-function
beforeEach(async () => {
  TxHistoryService.mockClear();
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
afterEach(() => {
  jest.resetAllMocks();
});

describe('Test controller', () => {
  test('routing test', async () => {
    const expectedResult = {
      history: [
        {
          txnHash:
            '0x0053b9986e0493265f26b3980eea1b7c2176f45c33dcc3818fe24b352c9a1311',
          method: 'swapExactETHForTokens',
          block: 15071181,
          age: 0,
          from: '0x6aac2ed7e7db046dec5ede5c701462611e4ff025',
          to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
          value: '0.2990511263',
          fee: '0.00000002',
        },
      ],
    };
    const testURL =
      '/uniswap-history?last=15071181&size=100&msg=0x276f4130aCFc16f8a19739E0735692394f1690B1&sign=0xdab21fcddab3cb7ecb89ba2c788f6958e70ac18f128c69e443eeb2e6e2d1c0b774987110ae4fc368b2dbec2031dca079a2a2ded332d95f09500aa022595b30481b';
    const response = await supertest(app).get(testURL).expect(200);
    // console.log(response.body);
    expect(response.body).toMatchObject(expectedResult);
  });

  test('GET, no paramters', async () => {
    const response = await supertest(app).get('/uniswap-history');
    expect(response.statusCode).toStrictEqual(400);
  });

  test('GET, invalid paramters', async () => {
    const testURL = '/uniswap-history?last=15068864&size=100';
    const response = await supertest(app).get(testURL);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.badRequest).toStrictEqual(true);
  });

  test('User verificatioin', async () => {
    const testParam = {
      msg: '0x276f4130aCFc16f8a19739E0735692394f1690B1',
      sign: '0xdab21fcddab3cb7ecb89ba2c788f6958e70ac18f128c69e443eeb2e6e2d1c0b774987110ae4fc368b2dbec2031dca079a2a2ded332d95f09500aa022595b30481b',
    };
    const result = await UniswapV2Controller.verifyUser(testParam);
    expect(result.isValid).toStrictEqual(true);
    expect(result.msg).toStrictEqual('Verified user');
  });

  test('User verificatioin, case 2', async () => {
    const testParam = {
      msg: '',
      sign: '0xdab21fcddab3cb7ecb89ba2c788f6958e70ac18f128c69e443eeb2e6e2d1c0b774987110ae4fc368b2dbec2031dca079a2a2ded332d95f09500aa022595b30481b',
    };
    const result = await UniswapV2Controller.verifyUser(testParam);
    expect(result.isValid).toStrictEqual(false);
    expect(result.msg).toStrictEqual('User verification failed');
  });
});
