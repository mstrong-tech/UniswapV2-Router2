import '@fontsource/inter';

import React from 'react';

import ConnectButton from './components/ConnectButton';
import Layout from './components/Layout';
import FullScreenSpiner from './components/Spinner';
import TransactionTable from './components/TransactionTable';
import { ApplicationStatus, TxHistory } from './config/types';
import { useFetchTransactions } from './hooks';
import {
  useApplicationStatus,
  useUniswapTransactions,
} from './states/application/hooks';

const columns = [
  {
    Header: 'Uniswap V2 swap transactions',
    columns: [
      {
        Header: 'Txn Hash',
        accessor: 'Txn Hash',
      },
      {
        Header: 'Method',
        accessor: 'Method',
      },
      {
        Header: 'Block',
        accessor: 'Block',
      },
      {
        Header: 'Age',
        accessor: 'Age',
      },
      {
        Header: 'From',
        accessor: 'From',
      },
      {
        Header: 'To',
        accessor: 'To',
      },
      {
        Header: 'Value',
        accessor: 'Value',
      },
      {
        Header: 'Txn Fee',
        accessor: 'Txn Fee',
      },
    ],
  },
];

function App() {
  useFetchTransactions();

  const appStatus: ApplicationStatus = useApplicationStatus();
  // console.log('Application status', appStatus);

  const fetchtedData: TxHistory[] = useUniswapTransactions();

  let txTable = <FullScreenSpiner />;
  if (
    !(
      appStatus === ApplicationStatus.INITIAL ||
      appStatus === ApplicationStatus.LOADING
    )
  ) {
    txTable = <TransactionTable columns={columns} rowData={fetchtedData} />;
  }

  return (
    <Layout>
      <ConnectButton />
      {txTable}
    </Layout>
  );
}

export default App;
