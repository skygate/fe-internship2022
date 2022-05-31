import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import userReducer from "./user";
import profilesReducer from "./profile";
import auctionsReducer from "./auctions";
import activeProfileReducer from "./activeProfile";
import userProductsReducer from "./userProducts";

export const store = configureStore({
    reducer: {
        user: userReducer,
        profiles: profilesReducer,
        auctions: auctionsReducer,
        activeProfile: activeProfileReducer,
        userProducts: userProductsReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type RootState = ReturnType<typeof store.getState>;
