import { useSelector } from 'react-redux';

import { ApplicationStatus, TransactionData } from '../../config/types';
import { AppState } from '..';

export const useApplicationStatus = (): ApplicationStatus => {
  return useSelector((state: AppState) => state.application.status);
};

export const useUniswapTransactions = (): TransactionData[] => {
  return useSelector((state: AppState) => state.application.transactions);
};

export const useSignature = (): string => {
  return useSelector((state: AppState) => state.application.signature);
};

export const useBlockInfo = (): any => {
  return useSelector((state: AppState) => state.application.blocks);
};
