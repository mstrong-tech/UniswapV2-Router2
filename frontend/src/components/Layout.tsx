import { Flex } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Flex
      height="100vh"
      overflow="auto"
      flexDirection="column"
      justifyContent="top"
      bg="gray.800"
      padding={'30px 20px 0px 20px'}
    >
      {children}
    </Flex>
  );
}
