import { ChakraProvider } from '@chakra-ui/react';
import { DAppProvider } from '@usedapp/core';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { RefreshContextProvider } from './contexts/RefreshContext';
import store from './states/index';

const Providers: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <DAppProvider config={{}}>
      <ChakraProvider resetCSS>
        <Provider store={store}>
          <RefreshContextProvider>{children}</RefreshContextProvider>
        </Provider>
      </ChakraProvider>
    </DAppProvider>
  );
};

export default Providers;
