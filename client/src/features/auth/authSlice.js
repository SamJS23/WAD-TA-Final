import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Safe localStorage parsing
const getUserFromStorage = () => {
  try {
    const userItem = localStorage.getItem('user')
    return userItem && userItem !== 'undefined' ? JSON.parse(userItem) : null
  } catch (error) {
    console.error('Error parsing user from localStorage:', error)
    localStorage.removeItem('user')
    return null
  }
}

const user = getUserFromStorage()

const initialState = {
  user: user,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isLoggedOut: !user,
  message: "",
  needsActivation: false
}

// signup user
export const signup = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
  try {
    return await authService.signup(userData)
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// activate email
export const activateEmail = createAsyncThunk('auth/activateEmail', async (activation_token, thunkAPI) => {
  try {
    return await authService.activateEmail(activation_token)
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// signin user
export const signin = createAsyncThunk('auth/signin', async (userData, thunkAPI) => {
  try {
    return await authService.signin(userData)
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// logout user
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    return await authService.logout()
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
      state.message = ""
      state.needsActivation = false
    }
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.needsActivation = true
        state.message = action.payload.message
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // activate email
      .addCase(activateEmail.pending, (state) => {
        state.isLoading = true
      })
      .addCase(activateEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.needsActivation = false
        state.message = action.payload.message
      })
      .addCase(activateEmail.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // signin
      .addCase(signin.pending, (state) => {
        state.isLoading = true
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isLoggedOut = false
        state.user = action.payload.user
        state.message = action.payload.message

        // Store refresh token & user only
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken)
        }

        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isLoggedOut = true
        state.user = null
        state.message = action.payload.message

        // Clear refresh token and user
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset } = authSlice.actions
export default authSlice.reducer
