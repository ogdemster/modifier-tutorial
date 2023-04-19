require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;
const POLYGON_NETWORK_API_KEY = process.env.POLYGON_NETWORK_API_KEY;
const MUMBAI_TESTNET_RPC_URL = process.env.MUMBAI_TESTNET_RPC_URL;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mumbai: {
      url: MUMBAI_TESTNET_RPC_URL,
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: POLYGON_NETWORK_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
    ],
  },
};
