import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersProductsState } from "interfaces/product";
import { getUserProducts } from "./helpers/productHelper";
import { RootState } from "./store";

const initialState: UsersProductsState = {
    status: "",
    products: [],
};

export const fetchUserProducts = createAsyncThunk("userProducts/setUserProducts", (id: string) => {
    return getUserProducts(id);
});

export const UserProductsSelector = (state: RootState) => state.userProducts.products;

export const userProductsSlice = createSlice({
    name: "usersProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserProducts.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(fetchUserProducts.fulfilled, (state, action) => {
            state.status = "success";
            state.products = action.payload;
        });
        builder.addCase(fetchUserProducts.rejected, (state, action) => {
            state.status = "failed";
            state.products = [];
        });
    },
});

export default userProductsSlice.reducer;
