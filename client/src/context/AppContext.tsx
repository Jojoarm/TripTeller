import React, { useContext, useEffect, useState } from 'react';
import type { Country, TripType, UserType } from '@/types';
import { createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as apiClient from '../api-client';
// import { useLocation, useNavigate } from 'react-router-dom';

interface RawCountry {
  name: { common: string };
  latlng: number[];
  maps?: {
    openStreetMaps?: string;
  };
  flags?: { png?: string };
}

interface AppContextType {
  user: UserType | null;
  countries: Country[] | null;
  trips: TripType[] | null;
  //   navigate: ReturnType<typeof useNavigate>;
  //   location: ReturnType<typeof useLocation>;
  currency: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user } = useQuery({
    queryKey: ['fetchUser'],
    queryFn: apiClient.fetchUser,
  });

  const { data: trips } = useQuery({
    queryKey: ['fetchTrips'],
    queryFn: apiClient.fetchTrips,
  });

  const currency = import.meta.env.VITE_CURRENCY || '$';
  const [countries, setCountries] = useState<Country[] | null>(null);

  // Fetch list of countries
  const getCountries = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    setCountries(
      data.map((country: RawCountry) => ({
        name: country.name.common,
        coordinates: country.latlng,
        value: country.name.common,
        openStreetMap: country.maps?.openStreetMaps,
        // flag: country.flags.png,
      }))
    );
  };

  useEffect(() => {
    getCountries();
  }, []);

  const value = {
    user,
    currency,
    countries,
    trips,
    // navigate,
    // location,
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
