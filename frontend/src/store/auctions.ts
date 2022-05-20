import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuctionState } from "interfaces";
import { fetchAuctions, fetchFilteredAndSortedAuctions } from "./helpers/auctionsHelper";

const initialState: AuctionState = {
    status: "",
    auctions: [],
};

export const getAuctions = createAsyncThunk("auctions/setAuctions", (params: {}) => {
    if (params)
        return fetchFilteredAndSortedAuctions(params).then(
            (auctionsResponse) => auctionsResponse.data
        );
    return fetchAuctions().then((auctionsResponse) => auctionsResponse.data);
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
