import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import MainTemplate from "./components/templates/main/index";
import ChooseProvider from "./components/organisms/chooseProvider/ChooseProvider";
import MintNFT from "./components/pages/mintNFT/MintNFT";
import StartSale from "./components/pages/startSale/StartSale";
import CancelSale from "./components/pages/cancelSale/CancelSale";
import BuyToken from "./components/pages/buyToken/BuyToken";
import BurnToken from "./components/pages/burnToken/BurnToken";
import CreateAuction from "./components/pages/bidNFT/CreateAuction";
import BidAuction from "./components/pages/bidNFT/BidAuction";
import CancelAuction from "./components/pages/bidNFT/CancelAuction";
import EndAuction from "./components/pages/bidNFT/EndAuction";
import WithdrawFromAuction from "./components/pages/bidNFT/WithdrawFromAuction";
import TokenCount from "./components/pages/utils/TokenCount.jsx";
import TokenOwner from "./components/pages/utils/TokenOwner.jsx";
import TokenPriceOnSale from "./components/pages/utils/TokenPriceOnSale.jsx";
import GlobalStyles from "./theme/GlobalStyles";

import { Navbar } from "./components/molecules/navbar/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";

const App = () => {
    const [activeAccount, setActiveAccount] = useState(null);
    const [selectedProviderGlobal, setActiveProviderGlobal] = useState(null);

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
                                        <>
                                            <MintNFT
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                            <BurnToken
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                        </>
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
                                        <>
                                            <StartSale
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                            <CancelSale
                                                activeAccountProps={activeAccount}
                                                activeProviderGlobalProps={selectedProviderGlobal}
                                            />
                                        </>
                                    }
                                />
                                <Route
                                    exact
                                    path="/buy"
                                    element={
                                        <BuyToken
                                            activeAccountProps={activeAccount}
                                            activeProviderGlobalProps={selectedProviderGlobal}
                                        />
                                    }
                                />
                                <Route
                                    exact
                                    path="/bid"
                                    element={
                                        <>
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
                                        </>
                                    }
                                />
                                <Route
                                    exact
                                    path="/utils"
                                    element={
                                        <>
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
                                        </>
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
