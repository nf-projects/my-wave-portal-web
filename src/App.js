import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {

  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");


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

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        {currentAccount && (
        <button className="waveButton" onClick={null}>
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
      </div>
    </div>
  );
}

export default App