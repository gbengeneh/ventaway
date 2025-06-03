import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearError } from '../app/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[Auth] Checking tokens from SecureStore...');
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const userId = await SecureStore.getItemAsync('userId');

        if (accessToken && refreshToken && userId) {
          dispatch(setUser({ userId, accessToken, refreshToken }));
          setIsAuthenticated(true);
        } else {
          console.log('[Auth] Missing tokens or user ID.');
          dispatch(setUser(null));
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('[Auth] Auth check failed:', err);
        dispatch(setUser(null));
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  // Sync isAuthenticated with redux user changes
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (userData) => {
    const { userId, accessToken, refreshToken } = userData;

    console.log("Storing userId:", userId);

    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    await SecureStore.setItemAsync('userId', userId);

    dispatch(setUser(userData));
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userId');

    dispatch(setUser(null));
    setIsAuthenticated(false);
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  console.log('[Auth] AuthContext initialized with user:', user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
