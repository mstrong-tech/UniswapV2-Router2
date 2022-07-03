## Functionality requirements

- The data should be fetched by the backend without using Etherscan API
- The backend should use ethers.js or web3.js to fetch all the events of a Uniswap swap contract
- The backend should interact with authenticated users only, that are connected via metamask
- Additionally: add a cache for the queries on the backend side

## API

### Request

Method: `GET`

URL: `/uniswap-history`

Paramter:

  - `last` - Last block number received
  - `size` - Number of blocks to fetch from the server
  - `msg` - User wallet address
  - `sign` - Signature of message

### Response

```json
{
  "history": [
    {
      "txnHash": "0xfebcee702d7e155b0388fe56b5febb14cae1518cdb953f8fdee2f906c2af3409",
      "method": "swapExactETHForTokens",
      "block": 15068864,
      "age": 1656841945,
      "from": "0x92F97A1a322f81e5E889C9F4Ac1cc23fE1CcEe26",
      "to": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "value": "0.0",
      "fee": "0.00200752192599465"
    },
    `...
  ]
}
```

## Run the App

```
npm install

npm start
```
