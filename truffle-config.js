require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const bscMainnetProvider = new HDWalletProvider({
  privateKeys: [DEPLOYER_PRIVATE_KEY],
  providerOrUrl: 'https://bsc-dataseed.binance.org/',
  addressIndex: 0,
  numberOfAddresses: 1,
});

const bscTestnetProvider = new HDWalletProvider({
  privateKeys: [DEPLOYER_PRIVATE_KEY],
  providerOrUrl: 'https://data-seed-prebsc-2-s2.binance.org:8545/',
  addressIndex: 0,
  numberOfAddresses: 1,
});

const deployerAddress = bscMainnetProvider.getAddress();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: '0.7.6',
      settings: {
        optimizer: {
          enabled: true,
          runs: 50000,
        },
      },
    },
  },
  networks: {
    bscDev: {
      host: 'localhost',
      port: 8545,
      network_id: '5656',
      gasPrice: 20000000000, // 20 gwei
      gas: 8000000,
    },
    bscTestnet: {
      network_id: '97',
      provider: bscTestnetProvider,
      gasPrice: 20000000000, // 20 gwei
      gas: 4000000,
      from: deployerAddress,
      timeoutBlocks: 60,
    },
    bscMainnet: {
      network_id: '56',
      provider: bscMainnetProvider,
      gasPrice: 20000000000, // 20 gwei
      gas: 4000000,
      from: deployerAddress,
      timeoutBlocks: 60,
    },
  },
};
