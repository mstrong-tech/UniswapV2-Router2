export enum ValueType {
  Ether = 'Ether',
  ERC20 = 'ERC20',
}
export interface SwapMethodType {
  methodID: string;
  function: string;
  value: ValueType;
}

export const swapMethodIDs: SwapMethodType[] = [
  {
    methodID: '0xfb3bdb41',
    function: 'swapETHForExactTokens',
    value: ValueType.Ether,
  },
  {
    methodID: '0x7ff36ab5',
    function: 'swapExactETHForTokens',
    value: ValueType.Ether,
  },
  {
    methodID: '0x38ed1739',
    function: 'swapExactTokensForTokens',
    value: ValueType.ERC20,
  },
  {
    methodID: '0x18cbafe5',
    function: 'swapExactTokensForETH',
    value: ValueType.ERC20,
  },
  {
    methodID: '0x8803dbee',
    function: 'swapTokensForExactTokens',
    value: ValueType.ERC20,
  },
  {
    methodID: '0x5c11d795',
    function: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
    value: ValueType.ERC20,
  },
  {
    methodID: '0xb6f9de95',
    function: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
    value: ValueType.ERC20,
  },
  {
    methodID: '0x791ac947',
    function: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
    value: ValueType.ERC20,
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
