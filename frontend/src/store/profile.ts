import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

export interface ProfileState {
  profile: string
}

const initialState: ProfileState = {
  profile: '',
}



export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    saveProfile: (state, action: PayloadAction<string>) => {
      state.profile = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { saveProfile } = profileSlice.actions

export default profileSlice.reducer