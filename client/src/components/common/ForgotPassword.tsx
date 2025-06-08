import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import * as apiClient from '../../api-client';
import toast from 'react-hot-toast';

export type ForgotPasswordData = {
  email: string;
};

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordData>();

  const navigate = useNavigate();
  const email = watch('email');

  const mutation = useMutation({
    mutationFn: apiClient.sendOtp,
    onSuccess: () => {
      navigate('/verify-token', {
        state: { email },
      });
    },
    onError: (error: Error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    mutation.mutate(data);
  });

  return (
    <div className="relative z-10 py-10 flex flex-col items-center justify-center h-full w-full">
      <div className="w-80 md:w-96 flex flex-col gap-3 items-center justify-center bg-white border border-gray-200 rounded-2xl shadow-xl px-6 py-8 ">
        <img src="/assets/icons/Logo.png" alt="logo" className="h-10" />
        <form onSubmit={onSubmit}>
          <h2 className="text-xl font-semibold my-3 text-center text-gray-500">
            Forgot Password?
          </h2>

          <p className="text-gray-500 mb-6 text-center">
            Enter your email address and we'll send you a token to reset your
            password
          </p>

          <div className="flex flex-col gap-1 items-center mb-4 w-full">
            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-xl overflow-hidden pl-6 gap-2">
              <Mail className="size-4 text-[#6B7280] " />
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
                {...register('email', {
                  required: 'This field is required!',
                })}
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="mt-8 w-full h-11 rounded-xl text-white bg-indigo-500 hover:opacity-90 transition-opacity cursor-pointer"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <div className="animate-spin rounded-full h-7 w-7 m-auto border-2 border-white border-t-[#2563eb] "></div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <Link
          to={'/sign-in'}
          className="text-sm text-gray-400 hover:underline flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
