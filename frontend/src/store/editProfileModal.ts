import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ModalVisibility } from "interfaces/modalVisibility";

const initialState: ModalVisibility = {
    status: "",
    visibility: false,
};

export const changeEditProfileVisibility = createAsyncThunk(
    "editProfileModalVisibility/changeEditProfileVisibility",
    (visibility: boolean) => {
        return visibility ? true : false;
    }
);

export const editProfileModalVisibilitySlice = createSlice({
    name: "editProfileModalVisibility",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(changeEditProfileVisibility.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(changeEditProfileVisibility.fulfilled, (state, action) => {
            state.visibility = action.payload;
            state.status = "success";
        });
        builder.addCase(changeEditProfileVisibility.rejected, (state, action) => {
            state.status = "failed";
        });
    },
});

export default editProfileModalVisibilitySlice.reducer;
