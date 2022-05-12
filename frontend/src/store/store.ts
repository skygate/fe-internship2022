import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';
import userReducer from './user';



export const store = configureStore({
    reducer: {
        user: userReducer
    }
});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>