import Head from 'next/head'
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  //keep track whetther the users wallet is connected
  const [walletConnected, setWalletConnected] = useState(false);
  //keep track if the metamask wallet has joined whitelist or not
  const [joinedWhiteList, setJoinedWhiteList] = useState(false);
  // loading = true if waiting for transaction to be mined
  const [loading, setLoading] = useState(false);

  const [numberOfWhiteListed, setNumberOfWhitelisted] = useState(0);

  //reference for the web3 modal
  const Web3ModalRef = useRef();

  //provider for reading data from the blockchain 
  //signer for writing data to the blockchain
  const getProviderOrSigner = async (needSigner = false) =>{

    const provider = await Web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(providers);

    //check if user connected to the rinkeby network

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4 ){
      window.alert("Change network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }
    if (needSigner){
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;

  };


/*
addAddressToWhitelist: adds current connected address to whitelist
*/
const addAddressToWhitelist = async () =>{
try {
  const signer = await getProviderOrSigner(true);
  //new contract instance with a signer 
  const whitelistContract = new Contract(
    WHITELIST_CONTRACT_ADDRESS,
    abi,
    signer
  );
  //call addAddressToWhitelist from the contract 
  const tx = await whitelistContract.addAddressToWhitelist();
  setLoading(true);
  //wait for tx to be mined 
  await tx.wait();
  setLoading(false);
  //get updated number of addresses in the whitelist
  await getNumberOfWhitelisted();
  setJoinedWhiteList(true);
}catch(err) {
  console.error(err);
}

};

/*
getNumberOfWhitelisted: gets the number of whitelisted addresses
*/
const getNumberOfWhitelisted = async () => {
 try{
  //Get the provider from web3modal 
  const provider = await getProviderOrSigner();
  //connect contract using provider
  const whitelistContract = new Contract(
    WHITELIST_CONTRACT_ADDRESS,
    abi,
    provider
  );

  //call numAddressesWhitelisted from the contract 
  const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
  setNumberOfWhitelisted(_numberOfWhitelisted);

 }
 catch (err){
  console.error(err);
 }

};


/** checkIfAddressInWhitelist: checks if the address is in the whitelist**/
const checkIfAddressInWhitelist
}
