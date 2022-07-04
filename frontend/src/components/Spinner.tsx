import { Box, Spinner, Text } from '@chakra-ui/react';
import React from 'react';

import { ApplicationStatus } from '../config/types';

const FullScreenSpiner: React.FC<{
  size?: string;
  color?: string;
  appStatus: ApplicationStatus;
}> = ({ size = 'lg', color = 'green.400', appStatus, ...rest }) => {
  return (
    <Box position={'relative'} width={'full'} height={'100vh'}>
      <Box
        position={'absolute'}
        top={'50%'}
        left={'50%'}
        translateX={'50%'}
        textAlign={'center'}
      >
        <Spinner size={size} color={color} {...rest} />
        <Text color={'gray'}> {appStatus} </Text>
      </Box>
    </Box>
  );
};

export default FullScreenSpiner;
