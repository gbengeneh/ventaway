import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Example slice reducer placeholder
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // add other reducers here
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
