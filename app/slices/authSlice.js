import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../api/authApi';
import * as SecureStore from 'expo-secure-store';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (registerDto, { rejectWithValue }) => {
    try {
      const response = await authApi.register(registerDto);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (loginDto, { rejectWithValue }) => {
    try {
      const response = await authApi.login(loginDto);
      const data = response.data;

      // Save tokens and userId securely
      if (data.accessToken) {
        await SecureStore.setItemAsync('accessToken', data.accessToken);
      }
      if (data.refreshToken) {
        await SecureStore.setItemAsync('refreshToken', data.refreshToken);
      }
      if (data.userId) {
        await SecureStore.setItemAsync('userId', data.userId);  // Save userId from root
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (forgotPasswordDto, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(forgotPasswordDto);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetPasswordDto, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(resetPasswordDto);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const refreshTokens = createAsyncThunk(
  'auth/refreshTokens',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken || await SecureStore.getItemAsync('refreshToken');
      const response = await authApi.refreshTokens(refreshToken);
      const data = response.data;

      if (data.accessToken) {
        await SecureStore.setItemAsync('accessToken', data.accessToken);
      }
      if (data.refreshToken) {
        await SecureStore.setItemAsync('refreshToken', data.refreshToken);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state.auth.accessToken || await SecureStore.getItemAsync('accessToken');
      const response = await authApi.logout(accessToken);

      // Clear stored tokens on logout
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const googleTokenLogin = createAsyncThunk(
  'auth/googleTokenLogin',
  async ({ access_token }, { rejectWithValue }) => {
    try {
      const response = await authApi.googleTokenLogin(access_token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const appleTokenLogin = createAsyncThunk(
  'auth/appleTokenLogin',
  async ({ id_token, name }, { rejectWithValue }) => {
    try {
      const response = await authApi.appleTokenLogin(id_token, name);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setTokens(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(refreshTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(googleTokenLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleTokenLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(googleTokenLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(appleTokenLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(appleTokenLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(appleTokenLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, setUser, setTokens } = authSlice.actions;

export default authSlice.reducer;
