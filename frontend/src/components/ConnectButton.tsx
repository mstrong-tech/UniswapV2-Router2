import { Box, Button, Text } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import React, { useEffect } from 'react';

import { ApplicationStatus } from '../config/types';
import { useAppDispatch } from '../states';
import { setApplicationStatus, setSignature } from '../states/application';
import { useSignature } from '../states/application/hooks';
import Identicon from './Identicon';

export default function ConnectButton() {
  const dispatch = useAppDispatch();
  const { activateBrowserWallet, account, library, deactivate } = useEthers();
  const storedSign = useSignature();

  useEffect(() => {
    const doSign = async () => {
      const plainText = 'UniswapV2 Router2';
      const signer = (library as any).getSigner();
      const sign = await signer.signMessage(plainText);
      // console.log('signed', sign);
      dispatch(setSignature(sign));
    };

    if (account && library && storedSign === '') {
      void doSign();
    } else if (!account || !library) {
      dispatch(setSignature(''));
    }
  }, [account, library, dispatch, storedSign]);

  const handleDisconnec = () => {
    deactivate();

    dispatch(setApplicationStatus(ApplicationStatus.INITIAL));
  };

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      borderRadius="xl"
      py="0"
    >
      {account ? (
        <Button
          onClick={handleDisconnec}
          bg="gray.800"
          border="1px solid transparent"
          _hover={{
            border: '1px',
            borderStyle: 'solid',
            borderColor: 'blue.400',
            backgroundColor: 'gray.700',
          }}
          borderRadius="xl"
          m="1px"
          px={3}
          height="38px"
        >
          <Text color="white" fontSize="md" fontWeight="medium" mr="2">
            {account &&
              `${account.slice(0, 6)}...${account.slice(
                account.length - 4,
                account.length,
              )}`}
          </Text>
          <Identicon />
        </Button>
      ) : (
        <Button
          onClick={activateBrowserWallet}
          bg="blue.800"
          color="blue.300"
          fontSize="lg"
          fontWeight="medium"
          borderRadius="xl"
          border="1px solid transparent"
          _hover={{
            borderColor: 'blue.700',
            color: 'blue.400',
          }}
          _active={{
            backgroundColor: 'blue.800',
            borderColor: 'blue.700',
          }}
        >
          Connect to MetaMask
        </Button>
      )}
    </Box>
  );
}
