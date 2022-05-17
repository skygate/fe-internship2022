import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfilesOfUser } from "./helpers/profileHelper";
import { ProfileInterface } from "../interfaces";

const initialState = {
    status: "",
    profiles: [] as ProfileInterface[],
};

export const getProfilesForLoggedUser = createAsyncThunk(
    "profiles/setProfiles",
    (userID: string) => {
        return getProfilesOfUser(userID);
    }
);

export const profilesSlice = createSlice({
    name: "profiles",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProfilesForLoggedUser.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(getProfilesForLoggedUser.fulfilled, (state, action) => {
            state.profiles = action.payload;
            state.status = "success";
        });
        builder.addCase(getProfilesForLoggedUser.rejected, (state, action) => {
            state.status = "failed";
            state.profiles = [];
        });
    },
});

export default profilesSlice.reducer;
