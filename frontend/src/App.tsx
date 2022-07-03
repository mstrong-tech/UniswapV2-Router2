import '@fontsource/inter';

import React from 'react';

import ConnectButton from './components/ConnectButton';
import Layout from './components/Layout';
import FullScreenSpiner from './components/Spinner';
import TransactionTable from './components/TransactionTable';
import { ApplicationStatus } from './config/types';
import { useFetchTransactions } from './hooks';
import { useApplicationStatus } from './states/application/hooks';

function App() {
  useFetchTransactions();

  const appStatus: ApplicationStatus = useApplicationStatus();

  return (
    <Layout>
      <ConnectButton />
      {appStatus === ApplicationStatus.INITIAL ||
      appStatus === ApplicationStatus.LOADING ? (
        <FullScreenSpiner />
      ) : (
        <TransactionTable />
      )}
    </Layout>
  );
}

export default App;
