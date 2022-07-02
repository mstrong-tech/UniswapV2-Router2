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
// import { ethers } from 'ethers';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { config } from '../config';
import { TxHistory } from '../config/types';

const primaryLinkColor = 'blue.300';
const primaryHeadColor = 'green';
const primaryBodyColor = 'white';

export default function TransactionTable({
  columns,
  rowData,
}: {
  columns: any;
  rowData: TxHistory[];
}) {
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
      const clonedArr = [...rowData];
      txs = clonedArr.splice(pageSize * (currentPage - 1), pageSize);
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
    const pageOptions: any[] = [];
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
            {columns[0].columns.map((value: any) => (
              <Th
                key={value.accessor}
                textColor={primaryHeadColor}
                textAlign="center"
                textTransform="none"
              >
                {value.Header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody textColor={primaryBodyColor}>
          {transactions.map((value: TxHistory) => (
            <Tr key={value.txnHash + Math.random()}>
              <Td>
                <Link
                  color={primaryLinkColor}
                  href={`https://etherscan.io/tx/${value.txnHash}`}
                  isExternal
                >
                  {value.txnHash.slice(0, 15) + '...'}
                </Link>
              </Td>
              <Td>{value.method.slice(0, 15) + '...'}</Td>
              <Td>
                <Link
                  color={primaryLinkColor}
                  href={`https://etherscan.io/block/${value.block}`}
                  isExternal
                >
                  {value.block}
                </Link>
              </Td>
              <Td>{new Date(value.age * 1000).toLocaleString()}</Td>
              <Td>
                <Link
                  color={primaryLinkColor}
                  href={`https://etherscan.io/address/${value.from}`}
                  isExternal
                >
                  {value.from.slice(0, 15) + '...'}
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
              <Td textAlign="center">{value.value + ' Ether'}</Td>
              <Td>{Number(value.fee).toFixed(8)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
