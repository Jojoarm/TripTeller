// GoogleLoginButton.tsx
import { useEffect } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

const GoogleLoginButton = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleCallbackResponse = async (
    response: google.accounts.id.CredentialResponse
  ) => {
    const { credential } = response;

    try {
      const res = await axios.post(
        'http://localhost:3000/api/users/google-auth',
        {
          tokenId: credential,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        queryClient.invalidateQueries({ queryKey: ['fetchUser'] });
        navigate('/');
      }
    } catch (err) {
      console.error('Google login failed', err);
      alert('Authentication failed');
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
