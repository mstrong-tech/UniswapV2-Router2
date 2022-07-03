import {
  Flex,
  Link,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { config } from '../config';
import { TxHistory } from '../config/types';
import { useUniswapTransactions } from '../states/application/hooks';

const primaryLinkColor = 'blue.300';
const primaryHeadColor = 'green';
const primaryBodyColor = 'white';

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

export default function TransactionTable() {
  const rowData: TxHistory[] = useUniswapTransactions();

  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageTotal, setPageTotal] = useState<number>(
    Math.ceil(rowData.length / pageSize),
  );
  const [transactions, setTransactions] = useState<TxHistory[]>([]);

  useEffect(() => {
    const pages = Math.ceil(rowData.length / pageSize);
    setPageTotal(pages);

    let txs: TxHistory[] = [];
    if (pages > 0) {
      txs = rowData.slice(pageSize * (currentPage - 1), pageSize);
    }
    setTransactions(txs);
  }, [currentPage, pageSize, rowData]);

  // handlers
  const handlePageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newPage = Number(event.target.value);

    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(event.target.value);

    setPageSize(newPageSize);
  };

  const createPageOptions = useMemo(() => {
    const pageOptions = [];
    for (let i = 1; i <= pageTotal; i++) {
      pageOptions.push(
        <option key={`page-${i}`} value={`${i}`}>
          {i}
        </option>,
      );
    }

    return pageOptions;
  }, [pageTotal]);

  return (
    <>
      <Flex width="100%">
        <Select
          bgColor="gray.100"
          width={40}
          ml={3}
          onChange={handlePageSizeChange}
          value={pageSize}
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
        </Select>
        <Select
          bgColor="gray.100"
          width={40}
          ml={3}
          onChange={handlePageChange}
          value={currentPage}
        >
          {createPageOptions}
        </Select>
      </Flex>
      <Table>
        <Thead>
          <Tr>
            {columns[0].columns.map((column: any) => (
              <Th
                key={column.accessor}
                textColor={primaryHeadColor}
                textAlign="center"
                textTransform="none"
              >
                {column.Header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody textColor={primaryBodyColor}>
          {transactions.map((transaction: TxHistory) => (
            <Tr key={transaction.txnHash + Math.random()}>
              <Td>
                <Link
                  color={primaryLinkColor}
                  href={`https://etherscan.io/tx/${transaction.txnHash}`}
                  isExternal
                >
                  {transaction.txnHash.slice(0, 15) + '...'}
                </Link>
              </Td>
              <Td>{transaction.method.slice(0, 15) + '...'}</Td>
              <Td>
                <Link
                  color={primaryLinkColor}
                  href={`https://etherscan.io/block/${transaction.block}`}
                  isExternal
                >
                  {transaction.block}
                </Link>
              </Td>
              <Td>{new Date(transaction.age * 1000).toLocaleString()}</Td>
              <Td>
                <Link
                  color={primaryLinkColor}
                  href={`https://etherscan.io/address/${transaction.from}`}
                  isExternal
                >
                  {transaction.from.slice(0, 15) + '...'}
                </Link>
              </Td>
              <Td>
                <Link
                  color={primaryLinkColor}
                  href={`https://etherscan.io/address/${config.uniswapV2Router2}`}
                  isExternal
                >
                  Uniswap V2: Router 2
                </Link>
              </Td>
              <Td textAlign="center">{transaction.value + ' Ether'}</Td>
              <Td>{Number(transaction.fee).toFixed(8)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
