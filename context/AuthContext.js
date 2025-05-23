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

        if (accessToken) {
          console.log('[Auth] Tokens found, dispatching setUser...');
          dispatch(setUser({ accessToken, refreshToken }));
          setIsAuthenticated(true);
        } else {
          console.log('[Auth] No tokens found.');
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

  // Sync isAuthenticated with redux user changes (optional redundancy)
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (userData) => {
    const { accessToken, refreshToken } = userData;

    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);

    dispatch(setUser(userData));
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');

    dispatch(setUser(null));
    setIsAuthenticated(false);
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

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
