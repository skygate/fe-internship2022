import React, { useState, useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import styles from "./LoginPage.module.scss";
import QRCode from "../../assets/QR Code.png";
import walletIcon from "../../assets/walletIcon.svg";
import walletIcon2 from "../../assets/walletIcon2.svg";
import walletIcon3 from "../../assets/walletIcon3.svg";
import { useStateContext } from "../../state/StateContext";
import { useMoralis } from "react-moralis";

export const LoginPage = () => {
    // const [selectedProvider, setSelectedProvider] = useState<WalletConnectProvider | null>(null);
    // const { activeAccount, setActiveAccount, setSelectedProviderGlobal } = useStateContext();

    // useEffect(() => {
    //     const manageOnReload = async () => {
    //         if (selectedProvider !== null) {
    //             if (selectedProvider.constructor.name === "WalletConnectProvider") {
    //                 try {
    //                     await selectedProvider.connector.killSession();
    //                 } catch (err) {
    //                     console.log(err);
    //                 }
    //                 await selectedProvider.enable();
    //             }
    //         } else {
    //             handleAccountsChanged("");
    //         }
    //     };

    //     const checkIfProviderHasBeenSelected = () => {
    //         if (selectedProvider !== null) {
    //             if (selectedProvider.constructor.name === "WalletConnectProvider") {
    //                 handleAccountsChanged(selectedProvider.accounts[0]);
    //             } else {
    //                 connect();
    //                 selectedProvider.on("accountsChanged", connect);
    //             }
    //         }
    //     };

    //     const connect = () => {
    //         if (selectedProvider !== null) {
    //             selectedProvider
    //                 .request({ method: "eth_requestAccounts" })
    //                 .then((result) => {
    //                     handleAccountsChanged(result[0]);
    //                 })
    //                 .catch((error) => {
    //                     if (error.code === 4001) {
    //                         // EIP-1193 userRejectedRequest error
    //                         console.log("Please confirm connection!");
    //                         handleAccountsChanged("");
    //                     } else if (error.code === -32002) {
    //                         console.log("You have pending request to accept in MetaMask!");
    //                         if (
    //                             error.message.includes(
    //                                 "Request of type 'wallet_requestPermissions' already pending for origin"
    //                             )
    //                         ) {
    //                             handleAccountsChanged("");
    //                         }
    //                     } else {
    //                         console.error(error);
    //                     }
    //                 });
    //         }
    //     };

    //     const handleAccountsChanged = (newAccount: string) => {
    //         setActiveAccount(newAccount);
    //         setSelectedProviderGlobal(selectedProvider);
    //     };
    //     if (selectedProvider !== null) {
    //         manageOnReload();
    //     }
    //     checkIfProviderHasBeenSelected();
    // }, [selectedProvider]);

    // const selectProvider = async (providerName: string) => {
    //     switch (providerName) {
    //         case "Wallet Connect":
    //             setSelectedProvider(
    //                 new WalletConnectProvider({
    //                     rpc: {
    //                         31337: "http://localhost:8545",
    //                         4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    //                     },
    //                 })
    //             );
    //             break;
    //         case "MetaMask":
    //             if (window.ethereum.providers !== undefined) {
    //                 setSelectedProvider(
    //                     window.ethereum.providers.find(
    //                         (provider: any) => provider.isMetaMask === true
    //                     )
    //                 );
    //                 console.log(selectedProvider);
    //             } else if (window.ethereum !== undefined && window.ethereum.isMetaMask) {
    //                 setSelectedProvider(window.ethereum);
    //             } else {
    //                 console.log("You don't have installed MetaMask!");
    //             }
    //             break;
    //         case "Coinbase":
    //             if (window.ethereum.providers !== undefined) {
    //                 setSelectedProvider(
    //                     window.ethereum.providers.find(
    //                         (provider: any) => provider.isCoinbaseWallet === true
    //                     )
    //                 );
    //             } else if (window.ethereum !== undefined && window.ethereum.isCoinbaseWallet) {
    //                 setSelectedProvider(window.ethereum);
    //             } else {
    //                 console.log("You don't have installed Coinbase!");
    //             }
    //             break;
    //     }
    // };

    const {
        authenticate,
        isAuthenticated,
        isAuthenticating,
        user,
        account,
        logout,
        isWeb3Enabled,
        enableWeb3,
    } = useMoralis();

    useEffect(() => {
        if (!isWeb3Enabled && isAuthenticated) {
            enableWeb3({ provider: "walletconnect", chainId: 56 });
            console.log("web3 enabled");
        }
    }, [isWeb3Enabled, isAuthenticated, enableWeb3]);

    const loginMetaMask = async () => {
        if (!isAuthenticated) {
            await authenticate({ signingMessage: "Log in into Sky NFT marketplace" })
                .then(function (user) {
                    console.log("logged in user:", user);
                    console.log(user!.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    const loginWalletConnect = async () => {
        if (!isAuthenticated) {
            await authenticate({
                provider: "walletconnect",
                chainId: 56,
                mobileLinks: ["rainbow", "metamask", "argent", "trust", "imtoken", "pillar"],
                signingMessage: "Welcome",
            })
                .then(function (user) {
                    console.log("logged in user:", user);
                    console.log(user!.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
            console.log(user);
        }
    };

    const logOut = async () => {
        await logout();
        console.log("logged out");
    };

    return (
        <section className={styles.connectionSection}>
            <div className={styles.connectionHeader}>
                <span>Connect your wallet</span>
            </div>
            {user !== null ? (
                <div>
                    <span>You are connected as: {user!.get("ethAddress")}</span>
                    <button type="button" onClick={logOut}>
                        Log out
                    </button>
                </div>
            ) : (
                <div className={styles.walletConnectionContainer}>
                    <div className={styles.walletOptionsContainer}>
                        <div>
                            <button
                                className={styles.connectionButton}
                                type="button"
                                // onClick={() => selectProvider("MetaMask")}
                                disabled={isAuthenticating}
                                onClick={loginMetaMask}
                            >
                                <img
                                    className={styles.walletIcon}
                                    src={walletIcon}
                                    alt="walletIcon"
                                />
                                <span className={styles.connectionLink}>Connect to MetaMask</span>
                            </button>
                        </div>
                        {/* <span> {activeAccount}</span> */}
                        {/* <div>
                            <button
                                className={styles.connectionButton}
                                type="button"
                                onClick={() => loginCoinWallet}
                            >
                                <img
                                    className={styles.walletIcon}
                                    src={walletIcon2}
                                    alt="walletIcon"
                                />
                                <span className={styles.connectionLink}>
                                    Connect to Coinbase Wallet
                                </span>
                            </button>
                        </div> */}
                        <div>
                            <button
                                className={styles.connectionButton}
                                type="button"
                                // onClick={() => selectProvider("Wallet Connect")}
                                onClick={loginWalletConnect}
                            >
                                <img
                                    className={styles.walletIcon}
                                    src={walletIcon3}
                                    alt="walletIcon"
                                />
                                <span className={styles.connectionLink}>
                                    Connect to Wallet Connect
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.qrCodeWrapper}>
                        <img src={QRCode} alt="qr code" className={styles.qrCodeImage} />
                    </div>
                </div>
            )}
        </section>
    );
};
