import { createContext, useContext } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
export type GlobalState = {
    activeAccount: string;
    setActiveAccount: (account: string) => void;
    selectedProviderGlobal: WalletConnectProvider | null;
    setSelectedProviderGlobal: (provider: WalletConnectProvider | null) => void;
};
export const StateContext = createContext<GlobalState>({
    activeAccount: "",
    setActiveAccount: () => {},
    selectedProviderGlobal: null,
    setSelectedProviderGlobal: () => {},
});
export const useStateContext = () => useContext(StateContext);
