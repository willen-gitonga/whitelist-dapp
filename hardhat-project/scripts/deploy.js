const {ethers} = require("hardhat");

async function main(){
    /*
    Contract factory used to deploy smart contracts
    WhitelistContract is a factory for instances of whitelist contract
    */
   const whitelistContract = await ethers.getContractFactory("Whitelist");

   //deploying the contract 
   const deployedWhitelistContract = await whitelistContract.deploy(10); //10 is max no of whitelisted addresses allowed

   // wait for it to finish deploying 
   await deployedWhitelistContract.deployed();

   //print address of deployed contract 

   console.log("Whitelist Contract Address:",
   deployedWhitelistContract.address);
}

//call main function and catch any errors 
main()
    .then(()=> process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });