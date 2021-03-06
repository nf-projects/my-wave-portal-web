import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {

  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  // All state property to store all the waves
  const [allWaves, setAllWaves] = useState([]);

  // The contract address from when we deployed the contract.
  const contractAddress = "0x110A52A66e9068d58a8B70bF2B019F95644F2402";

  // References the ABI json file from src/utils/WavePortal.json
  const contractABI = abi.abi;


  const checkIfWalletIsConnected = () => {
    try {
      /*
      * First make sure we have access to window.ethereum
      * This is a method provided by Metamask
      */
      const { ethereum } = window;

      if (!ethereum) {
        // if it's not defined, the user doesn't have metamask
        console.log("Make sure you have metamask!");
        //alert("Make sure you have metamask!");
      } else {
        // otherwise, the user does have metamask
        console.log("We have the ethereum object", ethereum);
        //alert("We have the ethereum object");
                
        /*
        * Check if we're authorized to access the user's wallet
        */
        const accounts = ethereum.request({ method: "eth_accounts" });
  
        if (accounts.length !== 0) {
          // if the length is not 0, we have an account
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account)
          getAllWaves();
        } else {
          console.log("No authorized account found")
          //alert("No authorized MetaMask account found!")
        }      
      }
    } catch (error) {
      console.log(error);
    }
  }
  // connect wallet function
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if(!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected:", accounts);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async () => {
    alert("Wave!");
    try {
      const { ethereum } = window;

      if(ethereum) {
        // using ethers.js to interact with the blockchain
        // a provider is a way to "talk" to the ethereum nodes
        const provider = new ethers.providers.Web3Provider(ethereum);

        // a signer is like an account to sign transactions
        const signer = provider.getSigner();

        // Get the contract instance
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // call the public function from the contract
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber()); 
        
        const waveTxn = await wavePortalContract.wave("this is a message!");
        console.log("Mining transaction... ", waveTxn.hash);

        await waveTxn.wait();
        console.log("Transaction mined... ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber()); 
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllWaves = async () => {
    try {
      const {ethereum} = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // Call the allWaves function from the contract
        const waves = await wavePortalContract.getAllWaves();

        // Pick out address, timestamp, and message from the returned array
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
    } catch (error) {
      console.log(error);
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    let wavePortalContract

    const onNewWave = (from, timestamp, message) => {
      console.log("New wave received: awdawdawdawdawdawd", from, timestamp, message);
      setAllWaves([
        ...allWaves,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message
        }
      ]);
  };

  if(window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if(wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        ???? Hey there!
        </div>

        <div className="bio">
          Lorem Ipsum Dipsum Wipsum Fipsum Gipsum Zipsum Lipsum
        </div>

        {currentAccount && (
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        )}
        
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}


      </div>
    </div>
  );
}

export default App