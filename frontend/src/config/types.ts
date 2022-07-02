export interface TxHistory {
  txnHash: string;
  method: string;
  block: number;
  age: number;
  from: string;
  to: string;
  value: string;
  fee: string;
}

export enum ApplicationStatus {
  INITIAL = 'initial',
  WALLET_CONNECTED = 'metamask connected',
  LOADING = 'loading',
  LIVE = 'live',
  ERROR = 'error',
}
