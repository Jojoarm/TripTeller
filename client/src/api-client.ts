import toast from 'react-hot-toast';
import type { RegisterFormData } from './components/common/SignUp';
import type { SignInFormData } from './components/common/SignIn';
import type { SearchFormData } from './components/user/SearchForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

//create user
export const createUser = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/sign-up`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (responseBody.success) {
    toast.success(responseBody.message);
  } else {
    toast.error(responseBody.message);
    throw new Error(responseBody.message);
  }
};

//sign-in user
export const signInUser = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/sign-in`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();
  if (responseBody.success) {
    toast.success(responseBody.message);
  } else {
    toast.error(responseBody.message);
    throw new Error(responseBody.message);
  }
};

//user logout
export const logOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
    credentials: 'include',
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Error during signout');
  }
};

//fetchUser
export const fetchUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/fetch-user`, {
    credentials: 'include',
  });
  const responseBody = await response.json();
  if (responseBody.success) {
    return responseBody.userData;
  } else {
    return null;
  }
};

//save recent searches
export const saveSearchedDestination = async (formData: SearchFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/recent-search`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    return null;
  }
};
