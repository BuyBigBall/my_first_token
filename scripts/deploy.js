async function main() {
    const contractName = "Token";
    //console.log(JSON.parse('{ "Token" : "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9" } ')); return;
    
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log("Deploying the contracts with the account:", await deployer.getAddress() );
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    const deployedContract = await ethers.getContractFactory(contractName);
    const deployedToken = await deployedContract.deploy();
    console.log("A contract <" + contractName + "> deployed to:", deployedToken.address);
    
    saveFrontendFiles(contractName, deployedToken);

    // const accounts = await hre.ethers.getSigners();
    // for (const account of accounts) {
    //   console.log(account);
    // }
    
}


function saveFrontendFiles(ContractName, deployedToken) {
  const fs = require("fs");

  const parentDir = __dirname + "/../client/src";
  if (!fs.existsSync(parentDir)) { fs.mkdirSync(parentDir); }

  const contractsDir = __dirname + "/../client/src/contracts";
  if (!fs.existsSync(contractsDir)) { fs.mkdirSync(contractsDir); }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(
            JSON.parse('{ "' + ContractName + '" : "' + deployedToken.address + '" }'), 
            undefined, 2)
    
  );

  const deployedTokenArtifact = artifacts.readArtifactSync(ContractName);
  fs.writeFileSync( contractsDir + "/" + ContractName + ".json", JSON.stringify(deployedTokenArtifact, null, 2));
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });