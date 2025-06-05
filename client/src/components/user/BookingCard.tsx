import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as apiClient from '../../api-client';
// import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

type Props = {
  tripId: string | undefined;
  setShowBookingCard: React.Dispatch<React.SetStateAction<boolean>>;
  tripImage: string;
};

export type BookingFormData = {
  guests: number;
  paymentMethod: string;
  tripId: string;
};

const BookingCard = ({ tripId, tripImage, setShowBookingCard }: Props) => {
  //   const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>();

  // Mutations
  const mutation = useMutation({
    mutationFn: apiClient.createBooking,
    onSuccess: () => {
      setShowBookingCard(false);
      //   navigate('/booking');
    },
    onError: (error: Error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (!tripId) {
      toast.error('Trip ID is missing!');
      return;
    }

    mutation.mutate({ ...data, tripId });
  });

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70">
      <form
        onSubmit={onSubmit}
        className="flex bg-white rounded-2xl shadow border-b border-gray-500 shadow-gray-600 group overflow-hidden max-w-4xl max-md:mx-2 h-[450px]"
      >
        <img
          src={tripImage}
          alt="reg-image"
          className="w-1/2 hidden md:block  h-full"
        />

        <div className="relative flex flex-col gap-2 h-full justify-between items-center md:w-1/2 p-4 md:p-6">
          <img
            src="/assets/icons/closeIcon.svg"
            alt="close-icon"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            onClick={() => setShowBookingCard(false)}
          />
          <p className="text-xl font-semibold text-gray-700 mt-4">
            Pay For Trip
          </p>

          <div className="flex gap-2 items-center w-full my-2 max-w-60 mr-auto">
            <label htmlFor="guests" className="font-medium text-gray-700">
              Persons:
            </label>
            <input
              id="guests"
              type="number"
              className="border border-gray-200 rounded w-full px-3 py-2 mt-1 outline-indigo-500 font-light text-gray-600"
              {...register('guests', {
                required: 'Number of guests is required',
                min: { value: 1, message: 'At least 1 guest is required' },
              })}
            />
          </div>
          {errors.guests && (
            <span className="text-red-500 text-xs">
              {errors.guests.message}
            </span>
          )}

          <div className="flex flex-col gap-2 text-gray-900 bg-white py-3 px-6 space-y-1 text-sm border">
            <h3 className="text-xs font-semibold">Select Payment Method</h3>
            <div className="flex items-center gap-2">
              <input
                className="h-4 w-4 appearance-none rounded-full checked:appearance-auto checked:accent-blue-600 indeterminate:bg-white border"
                type="radio"
                id="creditCard"
                {...register('paymentMethod', {
                  required: 'This field is required!',
                })}
                value="creditCard"
              />
              <label htmlFor="creditCard">Credit Card</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="h-4 w-4 appearance-none rounded-full checked:appearance-auto checked:accent-blue-600 indeterminate:bg-white border"
                type="radio"
                id="debitCard"
                {...register('paymentMethod', {
                  required: 'This field is required!',
                })}
                value="debitCard"
              />
              <label htmlFor="debitCard">Debit Card</label>
            </div>
            {errors.paymentMethod && (
              <span className="text-red-500 text-xs">
                {errors.paymentMethod.message}
              </span>
            )}

            <div className="flex items-center gap-3 pt-5 pb-2">
              <img
                className="size-8 rounded-2xl"
                src="https://civicrm.com/sites/civicrm.com/wp-content/themes/yootheme/cache/61/stripe-logo-sq-61cacb90.webp"
                alt="stripe Logo"
              />
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/paymentCard/visaLogoColored.svg"
                alt="visaLogoColored"
              />
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/paymentCard/masterCardLogo.svg"
                alt="masterCardLogo"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all w-full h-10 mt-5 rounded-md cursor-pointer"
          >
            {mutation.isPending ? (
              <div className="animate-spin rounded-full h-7 w-7 m-auto border-2 border-white border-t-[#2563eb] "></div>
            ) : (
              'Pay'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingCard;
