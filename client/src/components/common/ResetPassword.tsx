import { useMutation } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import * as apiClient from '../../api-client';
import toast from 'react-hot-toast';
import PasswordStrengthMeter from './PasswordStrength';
import Loader from './Loader';
import { useEffect } from 'react';

export type ResetPasswordData = {
  password: string;
  email: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = (location.state as { email?: string })?.email;
  console.log(email);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordData>();

  const mutation = useMutation({
    mutationFn: apiClient.resetPassword,
    onSuccess: () => {
      navigate(location.state?.from?.pathname || '/sign-in');
    },
    onError: (error: Error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (!email) {
      toast.error('Missing email. Please try again.');
      return;
    }

    mutation.mutate({ ...data, email });
  });

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  if (!email) return <Loader />;

  return (
    <div className="relative z-10 py-10 flex flex-col items-center justify-center h-full w-full">
      <div className="w-80 md:w-96 flex flex-col gap-3 items-center justify-center bg-white border border-gray-200 rounded-2xl shadow-xl px-6 py-8 ">
        <img src="/assets/icons/Logo.png" alt="logo" className="h-10" />
        <form onSubmit={onSubmit}>
          <h2 className="text-xl font-semibold my-3 text-center text-gray-500">
            Reset Password
          </h2>
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
                    message: 'Password must be at least 6 characters',
                  },
                  validate: {
                    hasUpper: (v) =>
                      /[A-Z]/.test(v) || 'Must include an uppercase letter',
                    hasLower: (v) =>
                      /[a-z]/.test(v) || 'Must include a lowercase letter',
                    hasNumber: (v) => /\d/.test(v) || 'Must include a number',
                    hasSpecial: (v) =>
                      /[^A-Za-z0-9]/.test(v) ||
                      'Must include a special character',
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

          <div className="flex flex-col gap-1 items-center mb-4 w-full">
            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-xl overflow-hidden pl-6 gap-2">
              <Lock className="size-4 text-[#6B7280] " />
              <input
                type="password"
                placeholder="Confirm Password"
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
                {...register('confirmPassword', {
                  validate: (val) => {
                    if (!val) {
                      return 'This field is required';
                    } else if (watch('password') !== val) {
                      return 'Passwords do not match!';
                    }
                  },
                })}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <PasswordStrengthMeter password={watch('password') || ''} />

          <button
            type="submit"
            className="mt-8 w-full h-11 rounded-xl text-white bg-indigo-500 hover:opacity-90 transition-opacity cursor-pointer"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <div className="animate-spin rounded-full h-7 w-7 m-auto border-2 border-white border-t-[#2563eb] "></div>
            ) : (
              'Set New Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
