import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as communityApi from '../api/communityApi';

const initialState = {
  communities: [],
  currentCommunity: null,
  loading: false,
  error: null,
};

export const createCommunity = createAsyncThunk(
  'community/createCommunity',
  async ({ dto, token }, { rejectWithValue }) => {
    try {
      const data = await communityApi.createCommunity(dto, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCommunities = createAsyncThunk(
  'community/fetchCommunities',
  async (_, { rejectWithValue }) => {
    try {
      const data = await communityApi.fetchCommunities();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCommunityById = createAsyncThunk(
  'community/fetchCommunityById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await communityApi.fetchCommunityById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCommunity = createAsyncThunk(
  'community/updateCommunity',
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const data = await communityApi.updateCommunity(id, dto);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeCommunity = createAsyncThunk(
  'community/removeCommunity',
  async (id, { rejectWithValue }) => {
    try {
      const data = await communityApi.removeCommunity(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addMember = createAsyncThunk(
  'community/addMember',
  async ({ communityId, userId, role, token }, { rejectWithValue }) => {
    try {
      const data = await communityApi.addMember(communityId, { userId, role }, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeMember = createAsyncThunk(
  'community/removeMember',
  async ({ communityId, userId, token }, { rejectWithValue }) => {
    try {
      const data = await communityApi.removeMember(communityId, userId, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  'community/updateMemberRole',
  async ({ communityId, userId, role, token }, { rejectWithValue }) => {
    try {
      const data = await communityApi.updateMemberRole(communityId, userId, role, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addUserToCommunities = createAsyncThunk(
  'community/addUserToCommunities',
  async ({ dto, token }, { rejectWithValue }) => {
    try {
      const data = await communityApi.addUserToCommunities(dto, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setCurrentCommunity(state, action) {
      state.currentCommunity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.communities.push(action.payload);
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCommunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCommunity = action.payload;
      })
      .addCase(fetchCommunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommunity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.communities.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.communities[index] = action.payload;
        }
        if (state.currentCommunity?.id === action.payload.id) {
          state.currentCommunity = action.payload;
        }
      })
      .addCase(updateCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(removeCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = state.communities.filter(c => c.id !== action.meta.arg);
        if (state.currentCommunity?.id === action.meta.arg) {
          state.currentCommunity = null;
        }
      })
      .addCase(removeCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentCommunity) {
          state.currentCommunity.members = action.payload.members;
        }
      })
      .addCase(addMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(removeMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentCommunity) {
          state.currentCommunity.members = action.payload.members;
        }
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateMemberRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentCommunity) {
          state.currentCommunity.members = action.payload.members;
        }
      })
      .addCase(updateMemberRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addUserToCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserToCommunities.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update state based on response
      })
      .addCase(addUserToCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, setCurrentCommunity } = communitySlice.actions;

export default communitySlice.reducer;
