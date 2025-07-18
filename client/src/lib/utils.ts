import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstWord(input: string = ''): string {
  return input.trim().split(/\s+/)[0] || '';
}

import { useEffect, useState } from 'react';
import type { TripFormData } from '@/pages/admin/CreateTrip';

const getLimit = (width: number) => {
  // if (width < 640) return 2;
  if (width < 768) return 2;
  if (width < 1072) return 4;
  if (width < 1437) return 6;
  return 8;
};

export const useResponsiveLimit = () => {
  const [limit, setLimit] = useState(() => getLimit(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setLimit(getLimit(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return limit;
};

export const formatKey = (key: keyof TripFormData) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('MMMM DD, YYYY');
};

export const calculateTrendPercentage = (
  currentCount: number,
  lastCount: number
): TrendResult => {
  if (lastCount === 0) {
    return currentCount === 0
      ? { trend: 'no change', percentage: 0 }
      : { trend: 'increment', percentage: 100 };
  }

  const change = currentCount - lastCount;
  const percentage = Math.abs((change / lastCount) * 100);

  if (change > 0) {
    return { trend: 'increment', percentage };
  } else if (change < 0) {
    return { trend: 'decrement', percentage };
  } else {
    return { trend: 'no change', percentage: 0 };
  }
};
