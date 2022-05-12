import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface UserState {
  userID: string,
  status: string
}


const url = 'http://localhost:8000/user/logged';

export const setUser = createAsyncThunk(
  'user/setUser',
  async () => {
    return await fetch(url,  {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000/",
        },
       
    }).then(res => res.json())
    
  }
)


const initialState: UserState = {
  userID: '',
  status: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
reducers: {},
  extraReducers: (builder) => {
      builder.addCase(setUser.pending, (state, action) => {
           state.status = "loading";
      })
      builder.addCase(setUser.fulfilled, (state, action) => {
          state.userID = action.payload.userID;
           state.status = "success";
      })
      builder.addCase(setUser.rejected, (state, action) => {
           state.status = "failed";
      })

},
})

// Action creators are generated for each case reducer function
// export const { setUser as setUserAction } = userSlice.actions;

export default userSlice.reducer;