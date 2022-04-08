import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import MainTemplate from "./components/templates/main/index";
import ChooseProvider from "./components/organisms/chooseProvider/ChooseProvider";
import MintNFT from "./components/pages/mintNFT/MintNFT";
import StartSale from "./components/pages/startSale/StartSale";
import CancelSale from "./components/pages/cancelSale/CancelSale";
import BuyToken from "./components/pages/buyToken/BuyToken";
import BuyBasicTicket from "./components/pages/buyToken/BuyBasicTicket";
import BuyPremiumTicket from "./components/pages/buyToken/BuyPremiumTicket";
import BurnToken from "./components/pages/burnToken/BurnToken";
import CreateAuction from "./components/pages/bidNFT/CreateAuction";
import BidAuction from "./components/pages/bidNFT/BidAuction";
import CancelAuction from "./components/pages/bidNFT/CancelAuction";
import EndAuction from "./components/pages/bidNFT/EndAuction";
import WithdrawFromAuction from "./components/pages/bidNFT/WithdrawFromAuction";
import TokenCount from "./components/pages/utils/TokenCount.jsx";
import TokenOwner from "./components/pages/utils/TokenOwner.jsx";
import TokenPriceOnSale from "./components/pages/utils/TokenPriceOnSale.jsx";
import JoinAirdrop from "./components/pages/airdrop/JoinAirdrop";
import SetMerkleRoot from "./components/pages/airdrop/SetMerkleRoot";
import ClaimAirdrop from "./components/pages/airdrop/ClaimAirdrop";
import ImportNFT from "./components/pages/importNFT/ImportNFT";
import GlobalStyles from "./theme/GlobalStyles";

import { Navbar } from "./components/molecules/navbar/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";

const App = () => {
    const [activeAccount, setActiveAccount] = useState(null);
    const [selectedProviderGlobal, setActiveProviderGlobal] = useState(null);
    const [airdropAddresses, setAirdropAddresses] = useState([]);
    const [merkelTree, setMerkelTree] = useState([]);

    return (
        <>
            <GlobalStyles />
            <ThemeProvider theme={theme}>
                <Router>
                    <div className="App">
                        <Navbar activeAccountProps={activeAccount} />
                        <div className="content">
                            <Routes>
                                <Route
                                    exact
                                    path="/"
                                    element={<MainTemplate activeAccountProps={activeAccount} />}
                                />
                                <Route
                                    exact
                                    path="/mintNFT"
                                    element={
                                        <MainTemplate activeAccountProps={activeAccount}>
                                            <MintNFT
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                            <BurnToken
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                                activeAccountProps={activeAccount}
                                            />
                                        </MainTemplate>
                                    }
                                />
                                <Route
                                    exact
                                    path="/login"
                                    element={
                                        <ChooseProvider
                                            changeActiveAccount={(activeAccount) =>
                                                setActiveAccount(activeAccount)
                                            }
                                            changeProviderGlobal={(selectedProviderGlobal) =>
                                                setActiveProviderGlobal(selectedProviderGlobal)
                                            }
                                        />
                                    }
                                />
                                <Route
                                    exact
                                    path="/sale"
                                    element={
                                        <MainTemplate activeAccountProps={activeAccount}>
                                            <StartSale
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                            <CancelSale
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                        </MainTemplate>
                                    }
                                />
                                <Route
                                    exact
                                    path="/buy"
                                    element={
                                        <MainTemplate activeAccountProps={activeAccount}>
                                            <BuyToken
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                                activeAccountProps={activeAccount}
                                            />
                                            <BuyBasicTicket
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                                activeAccountProps={activeAccount}
                                            />
                                            <BuyPremiumTicket
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                                activeAccountProps={activeAccount}
                                            />
                                        </MainTemplate>
                                    }
                                />
                                <Route
                                    exact
                                    path="/bid"
                                    element={
                                        <MainTemplate activeAccountProps={activeAccount}>
                                            <CreateAuction
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                            <BidAuction
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                            <CancelAuction
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                            <EndAuction
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                            <WithdrawFromAuction
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                        </MainTemplate>
                                    }
                                />
                                <Route
                                    exact
                                    path="/utils"
                                    element={
                                        <MainTemplate activeAccountProps={activeAccount}>
                                            <TokenCount
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                            <TokenOwner
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                            <TokenPriceOnSale
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                        </MainTemplate>
                                    }
                                />
                                <Route
                                    exact
                                    path="/import"
                                    element={
                                        <MainTemplate activeAccountProps={activeAccount}>
                                            <ImportNFT
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                                activeAccountProps={activeAccount}
                                            />
                                        </MainTemplate>
                                    }
                                />
                                <Route
                                    exact
                                    path="/airdrop"
                                    element={
                                        <MainTemplate activeAccountProps={activeAccount}>
                                            <JoinAirdrop
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                                setAirdropAddresses={(airdropAddresses) =>
                                                    setAirdropAddresses(airdropAddresses)
                                                }
                                                airdropAddressesProps={airdropAddresses}
                                            />
                                            <ClaimAirdrop
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                                airdropAddressesProps={airdropAddresses}
                                                merkelTreeProps={merkelTree}
                                            />
                                            <SetMerkleRoot
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                                airdropAddressesProps={airdropAddresses}
                                                setMerkelTree={(merkelTree) =>
                                                    setMerkelTree(merkelTree)
                                                }
                                                merkelTreeProps={merkelTree}
                                            />
                                        </MainTemplate>
                                    }
                                />
                            </Routes>
                        </div>
                    </div>
                </Router>
            </ThemeProvider>
        </>
    );
};

export default App;
