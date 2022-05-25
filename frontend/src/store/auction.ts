import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuctionStoreState } from "interfaces";
import { fetchAuctionById } from "./helpers/auctionHelper";

const initialState: AuctionStoreState = {
    status: "",
    auction: undefined,
};

export const getAuction = createAsyncThunk("auction/setAuction", (id: string) => {
    return fetchAuctionById(id).then((auctionsResponse) => auctionsResponse.data);
});

export const auctionSlice = createSlice({
    name: "auction",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAuction.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(getAuction.fulfilled, (state, action) => {
            state.status = "success";
            state.auction = action.payload;
        });
        builder.addCase(getAuction.rejected, (state, action) => {
            state.status = "failed";
            state.auction = undefined;
        });
    },
});

export default auctionSlice.reducer;
