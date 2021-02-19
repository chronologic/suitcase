![Suitcase Promo](assets/promo.gif)

# Suitcase smart contract

Smart Contract proxy wallet for ERC-20/BEP-20 tokens.

The Suitcase can be put up for sale and its ownership can be transferred to the purchaser in a secure, trustless way.

You can read more about this project at our [blog](https://blog.chronologic.network/suitcase-proxy-wallet-transferred-ownership-and-sellable-crypto-addresses-b89aafc93ff3).

An example instance of the contract has been deployed [here](https://testnet.bscscan.com/address/0xf641D18Ad21AAc645EF50181919637FB7ceD912A#code).

## Usage

### Selling ownership

- owner initiates the sale by calling `initiateSale` and specifying the asking price and who they want to sell to
- the 'target' address can be set to the zero address (`0x0`) to signify that anyone can buy the Suitcase, or set to a specific buyer address (e.g. if previously agreed)
- the buyer calls `completeSale` and sends the asking price, thus becoming the new owner of the contract
- the new owner can then sell the Suitcase to another person and so on
- the owner can cancel the sale while it's initiated but not yet completed by calling `cancelSale`

### Transferring ERC-20/BEP-20 tokens

Call the `transfer` function while specifying the ERC-20/BEP-20 address, the recipient and amount to move the tokens from the Suitcase to the recipient address.

### Proxying calls

The contract also has a `proxy` function that allows you to call an arbitrary address with arbitrary data on behalf of the Suitcase.

## Requirements

- node 10 (run `nvm use` if using [`nvm`](https://github.com/nvm-sh/nvm) to automatically select the proper version)
- [`truffle`](https://www.npmjs.com/package/truffle)

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

Tests are located in `test/` directory.

Run `npm run test` to execute the test suite.

## Additional links

- Website: https://chronologic.network/
- Twitter: https://twitter.com/chronologiceth
- Medium: https://blog.chronologic.network/
- Telegram: https://t.me/chronologicnetwork
- Github: https://github.com/chronologic/
