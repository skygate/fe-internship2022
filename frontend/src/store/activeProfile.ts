import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setActiveProfileAuto } from "./helpers/profileHelper";
import { setActiveProfile } from "./helpers/profileHelper";
import { ProfileInterface } from "../interfaces";

const initialState = {
    status: "",
    activeProfile: {} as ProfileInterface,
};

export const changeActiveProfile = createAsyncThunk(
    "activeProfile/changeActiveProfile",
    (profile: ProfileInterface) => {
        return setActiveProfile(profile);
    }
);

export const autoSetActiveProfile = createAsyncThunk(
    "activeProfile/setActiveProfile",
    (profiles: ProfileInterface[]) => {
        return setActiveProfileAuto(profiles);
    }
);

export const activeProfileSlice = createSlice({
    name: "activeProfile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(autoSetActiveProfile.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(autoSetActiveProfile.fulfilled, (state, action) => {
            state.activeProfile = action.payload;
            state.status = "success";
        });
        builder.addCase(autoSetActiveProfile.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(changeActiveProfile.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(changeActiveProfile.fulfilled, (state, action) => {
            state.activeProfile = action.payload;
            state.status = "success";
        });
        builder.addCase(changeActiveProfile.rejected, (state, action) => {
            state.status = "failed";
        });
    },
});

export default activeProfileSlice.reducer;
