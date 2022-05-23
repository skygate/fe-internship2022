import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ModalVisibility } from "interfaces/modalVisibility";

const initialState: ModalVisibility = {
    status: "",
    visibility: false,
};

export const changeAddProfileVisibility = createAsyncThunk(
    "addProfileModalVisibility/changeAddProfileVisibility",
    (visibility: boolean) => {
        return visibility ? true : false;
    }
);

export const addProfileModalVisibilitySlice = createSlice({
    name: "addProfileModalVisibility",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(changeAddProfileVisibility.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(changeAddProfileVisibility.fulfilled, (state, action) => {
            state.visibility = action.payload;
            state.status = "success";
        });
        builder.addCase(changeAddProfileVisibility.rejected, (state, action) => {
            state.status = "failed";
        });
    },
});

export default addProfileModalVisibilitySlice.reducer;
