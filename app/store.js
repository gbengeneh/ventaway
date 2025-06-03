import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Example slice reducer placeholder
import authReducer from './slices/authSlice';
import userProfileReducer from './slices/userProfileSlice';

import communityReducer from './slices/communitySlice';
import postReducer from './slices/postSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
  community: communityReducer,
  post: postReducer,
  // add other reducers here
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
