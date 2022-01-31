require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const mnemonic = "minor crime enemy merge ivory shuffle cross oak body scatter forest almost";
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      forking: {
        url: "https://http-mainnet.hecochain.com",
      }
    },
    testnet: {
      url: "https://http-testnet.hecochain.com",
      chainId: 256,
      gasPrice: 2500000000,
      accounts: {mnemonic: mnemonic}
    },
  }
};
