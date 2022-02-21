import '../mainContext/mainContext.css';
import React from 'react'

const ChooseProvider = (props) => {

    const connect = () => {
        window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(result => {handleAccountsChanged(result[0]);})
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log('Please connect to MetaMask.');
            handleAccountsChanged(null);
          } else if (error.code === -32002){ 
            console.log("You have pending request to accept in MetaMask!");
            if (error.message.includes("Request of type 'wallet_requestPermissions' already pending for origin")) {
                handleAccountsChanged(null);
            }
          } else {
            console.error(error);
          }
        });
    };

    const handleAccountsChanged = (newAccount) => {
        props.changeActiveAccount(newAccount);
    }

    window.ethereum.on('accountsChanged', connect);

    return (
        <div className="container">
          <div className="section1">
            <button onClick={connect} type="submit">Browser Extension Wallets(MetaMask, CoinBase)</button>
          </div>
        </div>
    );
};

export default ChooseProvider;