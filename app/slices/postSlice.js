import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as postApi from '../api/postApi';

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
};

export const createPost = createAsyncThunk(
  'post/createPost',
  async ({ dto, file, token }, { rejectWithValue }) => {
    try {
      const data = await postApi.createPost(dto, file, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPostsByUser = createAsyncThunk(
  'post/fetchPostsByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await postApi.fetchPostsByUser(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'post/fetchPostById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await postApi.fetchPostById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ id, dto, file, token }, { rejectWithValue }) => {
    try {
      const data = await postApi.updatePost(id, dto, file, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removePost = createAsyncThunk(
  'post/removePost',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const data = await postApi.removePost(id, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setCurrentPost(state, action) {
      state.currentPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPostsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPostsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(removePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(p => p.id !== action.meta.arg.id);
        if (state.currentPost?.id === action.meta.arg.id) {
          state.currentPost = null;
        }
      })
      .addCase(removePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, setCurrentPost } = postSlice.actions;

export default postSlice.reducer;
