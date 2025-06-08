import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import * as apiClient from '../../api-client';
import toast from 'react-hot-toast';
import GoogleLoginButton from './GoogleLoginButton';

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const mutation = useMutation({
    mutationFn: apiClient.signInUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchUser'] });
      navigate(location.state?.from?.pathname || '/');
    },
    onError: (error: Error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="relative z-10 py-10 flex flex-col items-center justify-center h-full">
      <form
        onSubmit={onSubmit}
        className="w-80 md:w-96 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl shadow-xl px-6 py-8 "
      >
        <img src="/assets/icons/Logo.png" alt="logo" className="h-10" />
        <p className="text-sm text-gray-500/90 mt-3">
          Welcome back! Please sign in to continue
        </p>

        {/* Google Login */}
        <GoogleLoginButton />

        <div className="flex items-center gap-4 w-full my-5">
          <div className="w-full h-px bg-gray-300/90"></div>
          <p className="w-full text-nowrap text-sm font-semibold text-gray-500/90">
            or sign in with email and password
          </p>
          <div className="w-full h-px bg-gray-300/90"></div>
        </div>

        <div className="flex flex-col gap-1 items-center mb-4 w-full">
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-xl overflow-hidden pl-6 gap-2">
            <Mail className="size-4 text-[#6B7280] " />
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
              {...register('email', { required: 'This field is required!' })}
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1 items-center mb-4 w-full">
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-xl overflow-hidden pl-6 gap-2">
            <Lock className="size-4 text-[#6B7280] " />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
              {...register('password', {
                required: 'This field is required!',
                minLength: {
                  value: 6,
                  message: ' Password must be at least 6 digits',
                },
              })}
            />
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
          <div className="flex items-center gap-2">
            <input className="h-5" type="checkbox" id="checkbox" />
            <label className="text-sm" htmlFor="checkbox">
              Remember me
            </label>
          </div>
          <Link className="text-sm underline" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="mt-8 w-full h-11 rounded-xl text-white bg-indigo-500 hover:opacity-90 transition-opacity cursor-pointer"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <div className="animate-spin rounded-full h-7 w-7 m-auto border-2 border-white border-t-[#2563eb] "></div>
          ) : (
            'Login'
          )}
        </button>
        <p className="text-gray-500/90 text-sm mt-4">
          Don’t have an account?{' '}
          <Link
            className="text-indigo-400 hover:underline cursor-pointer"
            to="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
