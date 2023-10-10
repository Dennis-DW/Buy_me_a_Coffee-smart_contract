// require("@nomicfoundation/hardhat-toolbox");
//  0x677e908016166F86Cad18CA932B11EaE6ADcDF7c
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config()
const GOERLI_URL = process.env.GOERLI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: GOERLI_URL, // Replace with your Alchemy API key
      accounts:  [PRIVATE_KEY], // Use the environment variable for your private key
    },
  },
};
// 0x677e908016166F86Cad18CA932B11EaE6ADcDF7c