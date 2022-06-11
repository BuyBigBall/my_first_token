const fs = require("fs");
//import addresses from '../src/contracts/contract-address.json';
// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }, { ethers }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../src/contracts/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const addresses = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(addresses.MintToken)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const [sender] = await ethers.getSigners();
    const token = await ethers.getContractAt("SpaceWorms", addresses.MintToken);

    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,  // 1 eth
    });
    await tx2.wait();

    //console.log(token); return;
    
    token.callStatic.mint(receiver, 
      {
        from:sender.address,
        value: ethers.utils.parseEther( "0.1" )
      })
       
        .then(function(ret) {
          console.log("tokenId of Mint = ", ret);

          token.balanceOf(token.address).then(function(ret) {
            console.log("SpaceWorms Token Balance", ret);
          });

          token.balanceOf(receiver).then(function(ret) {
            console.log("account Balance", ret);
          });

          
        })
        .catch( (error)=> {
            console.log("error", error);
        })
        ;
    

    // ### this is for ERC20 Contract ###
    // const tx = await token.transfer(receiver, 1000);
    // await tx.wait();
    // token.totalSupply().then(function(ret) {
    //   console.log("SpaceWorms Token totalSupply", ret);
    // });

    console.log(`Transferred 1 ETH and 1000 tokens to ${receiver} from ${sender.address}`);
  });
