# Take Home Assignment

## Uniswap explorer

Design a full stack application, that displays historical data of a Uniswap contract, with features, like tx hash, link to block explorer for that hash, parsed values displaying the amounts of assets in human readable form. Let the users login with metamask before querying the data.

- The data should be fetched by the backend without using Etherscan API
- The backend should use ethers.js or web3.js to fetch all the events of a Uniswap swap contract (example link provided below)
- The backend should interact with authenticated users only, that are connected via metamask
- The frontend should fetch this historical data for display using the backend API only
- Additionally: add a cache for the queries on the backend side

### Helpful links

- Uniswap V2, solidity Implementation → [https://docs.uniswap.org/protocol/V2/guides/smart-contract-integration/trading-from-a-smart-contract](https://docs.uniswap.org/protocol/V2/guides/smart-contract-integration/trading-from-a-smart-contract) ( only for context, no solidity needs to be coded itself )
- Ropsten swap router address example → [https://ropsten.etherscan.io/address/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D](https://ropsten.etherscan.io/address/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D)