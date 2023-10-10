// Import the required modules.
const hre = require("hardhat");
const abi = require("../artifacts/contracts/Lock.sol/BuyMeACoffee.json");

// Function to get the balance of an address in Ether.
async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  // Define the contract address that has been deployed to Goerli.
  const contractAddress = "0x677e908016166F86Cad18CA932B11EaE6ADcDF7c";
  const contractABI = abi.abi;

  // Connect to the Ethereum node and wallet.
  const provider = new hre.ethers.providers.JsonRpcProvider("goerli", process.env.GOERLI_API_KEY);
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Instantiate the connected contract.
  const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

  // Check starting balances.
  console.log("Current balance of Dennis:", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log("Current balance of contract:", contractBalance, "ETH");

  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("Withdrawing funds...");
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
    console.log("Funds withdrawn successfully!");
  } else {
    console.log("No funds to withdraw!");
  }

  // Check ending balance.
  console.log("Updated balance of Dennis:", await getBalance(provider, signer.address), "ETH");
}

// Execute the main function and handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
