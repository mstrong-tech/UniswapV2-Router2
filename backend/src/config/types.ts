export const swapMethodIDs = [
  { methodID: '0xfb3bdb41', function: 'swapETHForExactTokens', value: 'Ether' },
  { methodID: '0x7ff36ab5', function: 'swapExactETHForTokens', value: 'Ether' },
  {
    methodID: '0x38ed1739',
    function: 'swapExactTokensForTokens',
    value: 'Other',
  },
  { methodID: '0x18cbafe5', function: 'swapExactTokensForETH', value: 'Other' },
  {
    methodID: '0x8803dbee',
    function: 'swapTokensForExactTokens',
    value: 'Other',
  },
  {
    methodID: '0x5c11d795',
    function: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
    value: 'Other',
  },
  {
    methodID: '0xb6f9de95',
    function: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
    value: 'Other',
  },
  {
    methodID: '0x791ac947',
    function: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
    value: 'Other',
  },
];

export interface TxHistory {
  txnHash: string;
  method: string;
  block: number | undefined;
  age: number | undefined;
  from: string;
  to: string | undefined;
  value: string;
  fee: string | undefined;
}

export interface UserVerification {
  isValid: boolean;
  msg: string;
}
