import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Safely get user from localStorage
let user = null;
try {
  const storedUser = localStorage.getItem('user');
  if (storedUser && storedUser !== 'undefined') {
    user = JSON.parse(storedUser);
  }
} catch (error) {
  user = null;
}

const initialState = {
  user: user,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isLoggedOut: !user,
  message: ""
};

// signin user
export const signin = createAsyncThunk('auth/signin', async (user, thunkAPI) => {
  try {
    return await authService.signin(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.user = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.isLoggedOut = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isLoggedOut = false;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.isLoggedOut = true;
      });
  }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
