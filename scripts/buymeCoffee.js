const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the Text Massages stored on-chain from coffee purchases.
async function printTexts(Texts) {
  for (const Text of Texts) {
    const timestamp = Text.timestamp;
    const buyer = Text.name;
    const buyerAddress = Text.from;
    const message = Text.message;
    console.log(
      `At ${timestamp}, ${buyer} (${buyerAddress}) said: "${message}"`
    );
  }
}

async function main() {
  // Get the example accounts we'll be working with.
  const [Dennis, buyer, buyer2, buyer3, buyer4] = await hre.ethers.getSigners();

  // We get the contract to deploy.
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();

  // Deploy the contract.
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);

  // Check balances before the coffee purchase.
  const addresses = [Dennis.address, buyer.address, buyMeACoffee.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Buy the owner(Dennis) a few coffees.
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buyMeACoffee.connect(buyer).buyCoffee("Carlos", "yoo mzee!", tip);
  await buyMeACoffee.connect(buyer2).buyCoffee("Cedric", "kioko mani", tip);
  await buyMeACoffee.connect(buyer3).buyCoffee("Zack", "dj ice pop", tip);
  await buyMeACoffee.connect(buyer4).buyCoffee("Dickson", "kasee", tip);

  // Check balances after the coffee purchase.
  console.log("== bought coffee ==");
  await printBalances(addresses);

  // Withdraw.
  await buyMeACoffee.connect(Dennis).withdrawTips();

  // Check balances after withdrawal.
  console.log("== withdrawTips ==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("== Texts ==");
  const Texts = await buyMeACoffee.getTexts();
  printTexts(Texts);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
