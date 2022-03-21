import React, { useState, useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ButtonElement } from "../../atoms/button";

const ChooseProvider = (props) => {
    const [selectedProvider, setSelectedProvider] = useState(null);

    useEffect(async () => {
        const manageOnReload = async () => {
            if (selectedProvider !== null) {
                if (selectedProvider.constructor.name === "WalletConnectProvider") {
                    try {
                        await selectedProvider.connector.killSession();
                    } catch (err) {
                        console.log(err);
                    }
                    await selectedProvider.enable();
                }
            } else {
                handleAccountsChanged(null);
            }
        };

        const checkIfProviderHasBeenSelected = () => {
            if (selectedProvider !== null) {
                if (selectedProvider.constructor.name === "WalletConnectProvider") {
                    handleAccountsChanged(selectedProvider.accounts[0]);
                } else {
                    connect();
                    selectedProvider.on("accountsChanged", connect);
                }
            }
        };

        const connect = () => {
            selectedProvider
                .request({ method: "eth_requestAccounts" })
                .then((result) => {
                    handleAccountsChanged(result[0]);
                })
                .catch((error) => {
                    if (error.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        console.log("Please confirm connection!");
                        handleAccountsChanged(null);
                    } else if (error.code === -32002) {
                        console.log("You have pending request to accept in MetaMask!");
                        if (
                            error.message.includes(
                                "Request of type 'wallet_requestPermissions' already pending for origin"
                            )
                        ) {
                            handleAccountsChanged(null);
                        }
                    } else {
                        console.error(error);
                    }
                });
        };

        const handleAccountsChanged = (newAccount) => {
            props.changeActiveAccount(newAccount);
            props.changeProviderGlobal(selectedProvider);
        };
        if (selectedProvider !== null) {
            await manageOnReload();
        }
        checkIfProviderHasBeenSelected();
    }, [selectedProvider]);

    const selectProvider = async (providerName) => {
        switch (providerName) {
            case "Wallet Connect":
                setSelectedProvider(
                    new WalletConnectProvider({
                        rpc: {
                            31337: "http://localhost:8545",
                            4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                        },
                    })
                );
                break;
            case "MetaMask":
                if (window.ethereum.providers !== undefined) {
                    setSelectedProvider(
                        window.ethereum.providers.find((provider) => provider.isMetaMask === true)
                    );
                } else if (window.ethereum !== undefined && window.ethereum.isMetaMask) {
                    setSelectedProvider(window.ethereum);
                } else {
                    console.log("You don't have installed MetaMask!");
                }
                break;
            case "Coinbase":
                if (window.ethereum.providers !== undefined) {
                    setSelectedProvider(
                        window.ethereum.providers.find(
                            (provider) => provider.isCoinbaseWallet === true
                        )
                    );
                } else if (window.ethereum !== undefined && window.ethereum.isCoinbaseWallet) {
                    setSelectedProvider(window.ethereum);
                } else {
                    console.log("You don't have installed Coinbase!");
                }
                break;
        }
    };

    return (
        <div className="container">
            <div className="section1">
                <ButtonElement onClick={() => selectProvider("MetaMask")}>
                    Connect to MetaMask
                </ButtonElement>
            </div>
            <div className="section2">
                <ButtonElement onClick={() => selectProvider("Coinbase")}>
                    Connect to Coinbase Wallet
                </ButtonElement>
            </div>
            <div className="section3">
                <ButtonElement onClick={() => selectProvider("Wallet Connect")}>
                    Connect to Wallet Connect
                </ButtonElement>
            </div>
        </div>
    );
};

export default ChooseProvider;
