import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstWord(input: string = ''): string {
  return input.trim().split(/\s+/)[0] || '';
}

import { useEffect, useState } from 'react';

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
