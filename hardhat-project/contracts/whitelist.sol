//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist{
    //max no of whitelist addresses 
    uint8 public maxWhitelistedAddresses;
    // mapping for whitelisted addresses: true if whitelisted else false
    mapping(address => bool) public whitelistedAddresses;

    //track the whitelisted addresses 
    uint8 public numAddressesWhitelisted;

    //set max number of whitelisted addresses

    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }
    //function that adds address of sender to the whitelist
    function addAdressToWhitelist() public {
        //check if user has been whitelisted
        require(!whitelistedAddresses[msg.sender], "Sender already whitelisted");

        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses cant be added, limit reached");
        //Add caller address to array
        whitelistedAddresses[msg.sender] = true;

        numAddressesWhitelisted += 1;
    }
}