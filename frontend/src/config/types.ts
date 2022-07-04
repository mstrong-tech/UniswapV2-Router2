export interface TransactionData {
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
  LOADING = 'Fetching transactions from the server...',
  LIVE = 'Live',
  ERROR = 'Connetion error',
}
