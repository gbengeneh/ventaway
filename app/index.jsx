import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Loading from '@/components/Loading';

const Index = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/(main)/home');
      } else {
        router.replace('/welcome');
      }
    }
  }, [loading, isAuthenticated]);

  if (loading) return <Loading />;

  return null; // Or show a splash while redirecting
};

export default Index;
