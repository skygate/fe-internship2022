import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuctionItem } from "interfaces";
import { fetchAuctions } from "./helpers/auctionsHelper";

const initialState = {
    status: "",
    auctions: [] as AuctionItem[],
};

export const getAuctions = createAsyncThunk("auctions/setAuctions", () => {
    return fetchAuctions().then((data) => data.data);
});

export const auctionsSlice = createSlice({
    name: "auctions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAuctions.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(getAuctions.fulfilled, (state, action) => {
            state.status = "success";
            state.auctions = action.payload;
        });
        builder.addCase(getAuctions.rejected, (state, action) => {
            state.status = "failed";
            state.auctions = [];
        });
    },
});

export default auctionsSlice.reducer;
