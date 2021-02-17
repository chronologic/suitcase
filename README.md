[<img src="https://s3.amazonaws.com/chronologic.network/ChronoLogic_logo.svg" width="128px">](https://github.com/chronologic)

# Suitcase smart contract

Smart Contract proxy wallet for ERC-20 tokens.

The Suitcase can be put up for a sale and its ownership can be transferred to the purchaser.

## Selling ownership

- owner initiates the sale by calling `initiateSale` and specifying the asking price and who they want to sell to
- the 'target' address can be set to the zero address (`0x0`) to signify that anyone can buy the Suitcase
- the buyer calls `completeSale` and sends the asking price, thus becoming the new owner of the contract
- the new owner can then sell the Suitcase to another person and so on
- the owner can cancel the sale while it's initiated but not yet completed

## Requirements

- node 10 (run `nvm use` if using [`nvm`](https://github.com/nvm-sh/nvm) to automatically select the proper version)
- [truffle](https://www.npmjs.com/package/truffle)

Optional:

- [`truffle-flattener`](https://www.npmjs.com/package/truffle-flattener) to flatten the source code for easy submission to [`bscscan`](https://bscscan.com/)
- [`ganache-cli`](https://www.npmjs.com/package/ganache-cli) for development

## Installation

Run `npm install`

Optional:

- `npm install truffle-flattener -g`
- `npm install ganache-cli -g`

## Deployment

- provide `DEPLOYER_PRIVATE_KEY` environment variable by using `.env` file that you need to create (`.env.example` is provided as template) or by injecting the variable directly
- run `npm run deploy:<target>`:
  - `npm run deploy:bscTestnet` to deploy to Binance Smart Chain Testnet
  - `npm run deploy:bscMainnet` to deploy to Binance Smart Chain Mainnet

## Testing

Tests are located in `test`.

Run `npm run test` to execute the test suite.
