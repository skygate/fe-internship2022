import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer, Navbar } from "components";
import { useState } from "react";
import { LoginPage, HomePage, CreateSingleCollectible } from "views";
import { StateContext } from "state/StateContext";
import WalletConnectProvider from "@walletconnect/web3-provider";

function Router() {
    const [activeAccount, setActiveAccount] = useState("");
    const [selectedProviderGlobal, setSelectedProviderGlobal] =
        useState<WalletConnectProvider | null>(null);

    return (
        <StateContext.Provider
            value={{
                activeAccount,
                setActiveAccount,
                selectedProviderGlobal,
                setSelectedProviderGlobal,
            }}
        >
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/signin" element={<LoginPage />}></Route>
                    <Route path="/create" element={<CreateSingleCollectible />}></Route>
                </Routes>
                <Footer />
            </BrowserRouter>
        </StateContext.Provider>
    );
}

export default Router;
