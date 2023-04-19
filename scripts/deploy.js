// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  const Token = await ethers.getContractFactory("ModifierTutorial");
  const token = await Token.deploy();
  console.log("ModifierTutorial Address:", token.address);

  //wait until deployed fully
  await waitForVerify(50000);

  //verify contract
  hre.run("verify:verify", {
    address: token.address,
  });
}

//New promise settimeout
function waitForVerify(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
