import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setActiveProfileAuto } from "./helpers/profileHelper";
import { setActiveProfile } from "./helpers/profileHelper";
import { ProfileInterface } from "../interfaces";
import { ChangeActiveProfilePayload, ActiveProfileState } from "../interfaces";

const initialState: ActiveProfileState = {
    status: "",
    activeProfile: null,
};

export const changeActiveProfile = createAsyncThunk(
    "activeProfile/changeActiveProfile",
    ({ profiles, isAuto }: ChangeActiveProfilePayload) => {
        return isAuto ? setActiveProfileAuto(profiles) : setActiveProfile(profiles[0]);
    }
);

export const activeProfileSlice = createSlice({
    name: "activeProfile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
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
