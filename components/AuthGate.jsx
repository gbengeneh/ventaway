import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext'; // adjust path

export default function AuthGate({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // If already on home or main stack, do nothing to avoid infinite redirects
        if (!(router.pathname && router.pathname.startsWith('/(main)/home'))) {
          router.replace('/(main)/home');
        }
      } else {
        if (router.pathname !== '/welcome') {
          router.replace('/welcome');
        }
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    // Render loading or splash screen while checking auth
    return null; // or your <Loading /> component here
  }

  // Only render children when auth is ready and no redirect needed
  return <>{children}</>;
}
