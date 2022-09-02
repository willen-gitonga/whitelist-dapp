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

  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);

  //reference for the web3 modal
  const  web3ModalRef = useRef();

  //provider for reading data from the blockchain 
  //signer for writing data to the blockchain
  const getProviderOrSigner = async (needSigner = false) =>{

    const provider = await  web3ModalRef.current.connect();
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
const checkIfAddressInWhitelist = async () => {
  try{
    const signer = await getProviderOrSigner(true);
    const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      signer
    );
    //get address connected to the metamask
    const address = await signer.getAddress();
    //call whitelistedAddresses from the contract 
    const _joinedWhitelsit = await whitelistContract.whitelistedAddresses(
      address
    );
    setJoinedWhiteList(_joinedWhitelsit);
  }
  catch(err){
    console.error(err);
  }
};

const connectWallet = async () => {
  try {
    // Get the provider from web3Modal, which in our case is MetaMask
    // When used for the first time, it prompts the user to connect their wallet
    await getProviderOrSigner();
    setWalletConnected(true);

    checkIfAddressInWhitelist();
    getNumberOfWhitelisted();
  } catch (err) {
    console.error(err);
  }
};
  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
      if (walletConnected) {
        if (joinedWhitelist) {
          return (
            <div className={styles.description}>
              Thanks for joining the Whitelist!
            </div>
          );
        } else if (loading) {
          return <button className={styles.button}>Loading...</button>;
        } else {
          return (
            <button onClick={addAddressToWhitelist} className={styles.button}>
              Join the Whitelist
            </button>
          );
        }
      } else {
        return (
          <button onClick={connectWallet} className={styles.button}>
            Connect your wallet
          </button>
        );
      }
    };
  
    useEffect(() => {
      // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
      if (!walletConnected) {
        // Assign the Web3Modal class to the reference object by setting it's `current` value
        // The `current` value is persisted throughout as long as this page is open
        web3ModalRef.current = new Web3Modal({
          network: "rinkeby",
          providerOptions: {},
          disableInjectedProvider: false,
        });
        connectWallet();
      }
    }, [walletConnected]);

    return (
      <div>
        <Head>
          <title>Whitelist Dapp</title>
          <meta name="description" content="Whitelist-Dapp" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
          <div>
            <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
            <div className={styles.description}>
              Its an NFT collection for developers in Crypto.
            </div>
            <div className={styles.description}>
              {numberOfWhitelisted} have already joined the Whitelist
            </div>
            {renderButton()}
          </div>
          <div>
            <img className={styles.image} src="./crypto-devs.svg" />
          </div>
        </div>
  
        <footer className={styles.footer}>
          Made with &#10084; by Crypto Devs
        </footer>
      </div>
    );
  }

