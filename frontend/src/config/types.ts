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
  INITIAL = 'Please connect MetaMask.',
  WALLET_CONNECTED = 'Connecting to the server...',
  LOADING = 'Loading...',
  LIVE = 'Live',
  ERROR = 'Error',
}
