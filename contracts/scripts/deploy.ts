import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  // cUSD token address on Celo Alfajores
  const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

  console.log("Deploying ArxiomRegistry...");
  console.log("cUSD Token Address:", cUSDTokenAddress);

  const ArxiomRegistry = await ethers.getContractFactory("ArxiomRegistry");
  const registry = await ArxiomRegistry.deploy(cUSDTokenAddress);

  await registry.waitForDeployment();
  const address = await registry.getAddress();

  console.log("ArxiomRegistry deployed to:", address);

  // Save deployment info to JSON file
  const deploymentInfo = {
    contractAddress: address,
    cUSDTokenAddress: cUSDTokenAddress,
    network: "alfajores",
    deployer: (await ethers.getSigners())[0].address,
    timestamp: new Date().toISOString(),
  };

  const deploymentPath = path.join(__dirname, "../deployments.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("Deployment info saved to:", deploymentPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
