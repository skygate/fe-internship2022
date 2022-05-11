import { configureStore } from "@reduxjs/toolkit";
import profileReducer from './profile';



export const store = configureStore({
    reducer: {
        profile: profileReducer
    }
});
export type RootState = ReturnType<typeof store.getState>

