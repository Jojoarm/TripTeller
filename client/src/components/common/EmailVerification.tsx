import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import * as apiClient from '../../api-client';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const EmailVerification = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (verificationCode: string) =>
      apiClient.verifyEmail(verificationCode),
    onSuccess: () => {
      toast.success('Email verified successfully');
      navigate('/');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Verification failed';
      toast.error(message);
    },
  });

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    //Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || '';
      }
      setCode(newCode);

      //Focus on the last non-empty input or the first empty one
      const lastFilledIndex = (() => {
        for (let i = newCode.length - 1; i >= 0; i--) {
          if (newCode[i] !== '') return i;
        }
        return -1;
      })();
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      //Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    console.log(verificationCode);
    // mutation.mutate(verificationCode);
  };

  //auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== '')) {
      const verificationCode = code.join('');
      console.log(verificationCode);
    }
  }, [code]);

  return (
    <div className="relative z-10 py-10 flex flex-col items-center justify-center h-full w-full">
      <div className="w-80 md:w-96 flex flex-col gap-3 items-center justify-center bg-white border border-gray-200 rounded-2xl shadow-xl px-6 py-8 ">
        <img src="/assets/icons/Logo.png" alt="logo" className="h-10" />

        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold my-3 text-center text-gray-500">
            Verify Your Email
          </h2>

          <p className="text-gray-500 mb-6 text-center">
            Enter the 6-digit code sent to your email address
          </p>

          <div className="flex flex-col gap-1 items-center mb-4 w-full">
            <div className="flex justify-between gap-1">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-slate-100 text-gray-700 border-2 border-gray-400 rounded-lg focus:border-[#2563eb] focus:outline-none"
                />
              ))}
            </div>
          </div>

          {/* Show error from mutation if any */}
          {mutation.isError && (
            <p className="text-red-500 font-semibold mt-2">
              {(mutation.error as Error).message}
            </p>
          )}

          <button
            type="submit"
            className="mt-8 w-full h-11 rounded-xl text-white bg-indigo-500 hover:opacity-90 transition-opacity cursor-pointer"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <div className="animate-spin rounded-full h-7 w-7 m-auto border-2 border-white border-t-[#2563eb] "></div>
            ) : (
              'Submit'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
