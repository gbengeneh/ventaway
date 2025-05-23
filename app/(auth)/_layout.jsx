import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Slot, useRouter } from 'expo-router';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === null) return; // wait for auth state to resolve

    if (isAuthenticated) {
      router.replace('/(main)/home');
    }
  }, [isAuthenticated, router]);

  // If user is authenticated, redirecting, so don't render children
  if (isAuthenticated) {
    return null;
  }

  // Render children (e.g., signUp, login) if not authenticated
  return <Slot />; // Render the current route
}
