// GoogleLoginButton.tsx
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '@/lib/api';

const GoogleLoginButton = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  const handleCallbackResponse = async (
    response: google.accounts.id.CredentialResponse
  ) => {
    const { credential } = response;

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/users/google-auth`, {
        method: 'POST',
        body: JSON.stringify({
          tokenId: credential,
        }),
      });

      const responseBody = await res.json();

      if (responseBody.success) {
        localStorage.setItem('auth_token', responseBody.token);
        queryClient.invalidateQueries({ queryKey: ['fetchUser'] });
        navigate(location.state?.from?.pathname || '/');
        toast.success(responseBody.message || 'Login successful');
      } else {
        toast.error(responseBody.message);
      }
    } catch (err) {
      console.error('Google login failed', err);
      toast.error('Authentication failed');
    }
  };

  useEffect(() => {
    if (!window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
      callback: handleCallbackResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-btn')!,
      {
        theme: 'outline',
        size: 'large',
      }
    );
  }, []);

  return <div id="google-signin-btn" className="w-full mt-4" />;
};

export default GoogleLoginButton;
