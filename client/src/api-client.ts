import toast from 'react-hot-toast';
import type { RegisterFormData } from './components/common/SignUp';
import type { SignInFormData } from './components/common/SignIn';
import type { SearchFormData } from './components/user/SearchForm';
import type { TripFormData } from './pages/admin/CreateTrip';
import type { BookingFormData } from './components/user/BookingCard';
import type { ForgotPasswordData } from './components/common/ForgotPassword';
import type { ResetPasswordData } from './components/common/ResetPassword';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// USERS

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
    // console.log('User not found in vercel');
    return null;
  }
};

//verify email
export const verifyEmail = async (code: string) => {
  const response = await fetch(`${API_BASE_URL}/api/users/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const responseBody = await response.json();
  if (responseBody.success) {
    return responseBody.userData;
  } else {
    throw new Error('Verification failed');
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

//fetch Trips
export const fetchTrips = async (queryString?: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/trips/trips?${queryString}`
  );
  const responseBody = await response.json();
  if (responseBody.success) {
    return {
      tripData: responseBody.tripData,
      totalCount: responseBody.pagination.totalItems,
    };
  } else {
    return null;
  }
};

//create booking
export const createBooking = async (formData: BookingFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/bookings/create-booking`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (responseBody.success) {
    window.location.href = responseBody.url;
    toast.success(responseBody.message);
  } else {
    toast.error(responseBody.message);
    throw new Error(responseBody.message);
  }
};

//get user bookings
export const getUserBookings = async (params: URLSearchParams) => {
  const response = await fetch(
    `${API_BASE_URL}/api/bookings/user-bookings?${params}`,
    {
      credentials: 'include',
    }
  );
  const responseBody = await response.json();
  if (responseBody.success) {
    return responseBody;
  } else {
    return null;
  }
};

//send otp
export const sendOtp = async (formData: ForgotPasswordData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();
  if (response.ok && responseBody.success) {
    toast.success(responseBody.message);
  } else {
    throw new Error(responseBody.message || 'Something went wrong');
  }
};

//verify otp
export const verifyOtp = async (code: string, email: string) => {
  const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, email }),
  });
  const responseBody = await response.json();
  if (responseBody.success) {
    toast.success(responseBody.message);
  } else {
    throw new Error('Failed to verify Otp');
  }
};

//reset password
export const resetPassword = async (formData: ResetPasswordData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();
  if (responseBody.success) {
    toast.success(responseBody.message);
  } else {
    throw new Error('Failed to reset password');
  }
};

// ADMIN

//create trip by admin
export const createTrip = async (formData: TripFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/create-trip`, {
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

//fetch all users
export const adminFetchUsers = async (params: URLSearchParams) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users?${params}`, {
    credentials: 'include',
  });
  const responseBody = await response.json();
  if (responseBody.success) {
    return responseBody;
  } else {
    return null;
  }
};
