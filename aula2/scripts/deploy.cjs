// eslint-disable-next-line @typescript-eslint/no-require-imports
const hre = require("hardhat");

async function main() {
  console.log("Fazendo deploy do ItemManager...");

  const ItemManager = await hre.ethers.getContractFactory("ItemManager");
  const itemManager = await ItemManager.deploy();

  await itemManager.waitForDeployment();

  const address = await itemManager.getAddress();
  console.log(`ItemManager deployed em: ${address}`);
  
  console.log(`\n📋 COPIE ESTE ENDEREÇO: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});