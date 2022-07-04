import { useEthers } from '@usedapp/core';
import { useEffect } from 'react';

import { config } from '../config';
import { ApplicationStatus } from '../config/types';
import { useAppDispatch } from '../states';
import {
  setApplicationStatus,
  updateTransactions,
} from '../states/application';
import { useBlockInfo, useSignature } from '../states/application/hooks';
import { useRefresh } from './useRefresh';

const useFetchTransactions = () => {
  const { account } = useEthers();
  const { slowRefresh } = useRefresh();
  const dispatch = useAppDispatch();
  const sign = useSignature();
  const blocks = useBlockInfo();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = `${config.server}?last=${blocks.end + 1}&size=${
          config.maxBlocks
        }&msg=${account}&sign=${sign}`;
        // console.log(url);
        const data = await fetch(url).then((res) => res.json());
        // console.log('received array size', data.history.length);
        if (data.history.length > 0) {
          const transactions = data.history.reverse();
          dispatch(updateTransactions(transactions));
          dispatch(setApplicationStatus(ApplicationStatus.LIVE));
        }
      } catch (error) {
        console.error(error);
        dispatch(setApplicationStatus(ApplicationStatus.ERROR));
      }
    };
    if (account && sign !== '') void fetchTransactions();
  }, [dispatch, account, slowRefresh, sign, blocks]);
};

export default useFetchTransactions;
