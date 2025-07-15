// utils/api.ts
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('auth_token');

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  return fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });
};
