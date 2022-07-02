import { useSelector } from 'react-redux';

import { ApplicationStatus, TxHistory } from '../../config/types';
import { AppState } from '..';

export const useApplicationStatus = (): ApplicationStatus => {
  return useSelector((state: AppState) => state.application.status);
};

export const useUniswapTransactions = (): TxHistory[] => {
  return useSelector((state: AppState) => state.application.transactions);
};

export const useSignature = (): string => {
  return useSelector((state: AppState) => state.application.signature);
};

export const useBlockInfo = (): any => {
  return useSelector((state: AppState) => state.application.blocks);
};
