import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

const FullScreenSpiner: React.FC<{
  size?: string;
  color?: string;
}> = ({ size = 'lg', color = 'green.400', ...rest }) => {
  return (
    <Box position={'relative'} width={'full'} height={'100vh'}>
      <Box position={'absolute'} top={'50%'} left={'50%'} translateX={'50%'}>
        <Spinner size={size} color={color} {...rest} />
      </Box>
    </Box>
  );
};

export default FullScreenSpiner;
