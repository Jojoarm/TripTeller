import React, { useContext } from 'react';
import type { UserType } from '@/types';
import { createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as apiClient from '../api-client';
import { useLocation, useNavigate } from 'react-router';

interface AppContextType {
  user: UserType | null;
  navigate: ReturnType<typeof useNavigate>;
  location: ReturnType<typeof useLocation>;
  currency: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user } = useQuery({
    queryKey: ['fetchUser'],
    queryFn: apiClient.fetchUser,
  });
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const navigate = useNavigate();
  const location = useLocation();

  const value = {
    user,
    currency,
    navigate,
    location,
  };
  //   console.log('user', user);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
