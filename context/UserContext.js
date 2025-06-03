import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile, updateUserProfile, clearError as clearUserProfileError } from '../app/slices/userProfileSlice';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const userId = user?.userId || '';
  const token = user?.accessToken || '';

  const userProfile = useSelector((state) => state.userProfile.profile);
  const userProfileLoading = useSelector((state) => state.userProfile.loading);
  const userProfileError = useSelector((state) => state.userProfile.error);

  useEffect(() => {
    if (userId && token) {
      dispatch(fetchUserProfile({ userId, token }));
    }
  }, [userId, token, dispatch]);

  const updateProfile = (userId, updateData, avatar, banner_image) => {
    dispatch(updateUserProfile({ userId, updateData, avatar, banner_image, token }));
  };

  const clearErrors = () => {
    dispatch(clearUserProfileError());
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        userProfileLoading,
        userProfileError,
        updateProfile,
        clearErrors,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
