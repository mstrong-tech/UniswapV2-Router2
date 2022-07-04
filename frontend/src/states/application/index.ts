import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApplicationStatus, TransactionData } from '../../config/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApplicationState {
  status: ApplicationStatus;
  transactions: TransactionData[];
  signature: string;
  blocks: { from: number; end: number };
}

const initialState: ApplicationState = {
  status: ApplicationStatus.INITIAL,
  transactions: [],
  signature: '',
  blocks: { from: 0, end: 0 },
};

export const ApplicationSlice = createSlice({
  name: 'Application',
  initialState,
  reducers: {
    setApplicationStatus: (
      state: any,
      action: PayloadAction<ApplicationStatus>,
    ) => {
      state.status = action.payload;
    },
    updateTransactions: (
      state: any,
      action: PayloadAction<TransactionData[]>,
    ) => {
      const temp = action.payload.concat(state.transactions);
      state.blocks.from = temp[temp.length - 1].block;
      state.blocks.end = temp[0].block;
      state.transactions = temp;
    },
    setSignature: (state: any, action: PayloadAction<string>) => {
      state.signature = action.payload;
    },
  },
});

export const { setApplicationStatus, updateTransactions, setSignature } =
  ApplicationSlice.actions;

export default ApplicationSlice.reducer;
