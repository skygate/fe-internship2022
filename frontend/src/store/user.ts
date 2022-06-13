import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postUser } from "./helpers";
import { RootState } from "./store";
import { UserState } from "./types";

const initialState: UserState = {
    userID: "",
    status: "",
};

export const setUser = createAsyncThunk("user/setUser", () => {
    return postUser();
});

export const UserSelector = (state: RootState) => state.user;

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setUser.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(setUser.fulfilled, (state, action) => {
            state.userID = action.payload;
            state.status = "success";
        });
        builder.addCase(setUser.rejected, (state, action) => {
            state.status = "failed";
            state.userID = "";
        });
    },
});

export default userSlice.reducer;
