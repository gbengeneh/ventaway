import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as userApi from '../api/userApi';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchUserProfile',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const data = await userApi.fetchUserProfile(userId, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'userProfile/updateUserProfile',
  async ({ userId, updateData, avatar, bannerFile, token }, { rejectWithValue }) => {
    try {
      const data = await userApi.updateUserProfile(userId, updateData, avatar, bannerFile, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, setProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;
