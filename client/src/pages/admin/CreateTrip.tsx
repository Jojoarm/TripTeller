import { comboBoxItems, selectItems } from '@/assets/assets';
import Title from '@/components/common/Title';
import { useAppContext } from '@/context/AppContext';
import { formatKey } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleArrowDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import * as apiClient from '../../api-client';
import toast from 'react-hot-toast';

export type TripFormData = {
  country: string;
  travelStyle: string;
  interests: string;
  budget: string;
  duration: number;
  groupType: string;
};

const CreateTrip = () => {
  const { countries } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormData>();

  //   console.log(countries);

  const sortedCountries = countries?.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Mutations
  const mutation = useMutation({
    mutationFn: apiClient.createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchTrips'] });
      navigate('/admin/dashboard');
    },
    onError: (error: Error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Title
        title="Add a new Trip"
        subtitle="View and edit AI Generated travel plans"
      />

      <section className="mt-2.5 w-full max-w-3xl px-4 lg:px-8 mx-auto">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-6 py-6 bg-white border border-light-300 rounded-xl shadow-100"
        >
          {/* Country */}
          <div className="input-field">
            <label className="font-normal text-gray-100" htmlFor="country">
              Country
            </label>
            <div className="relative w-full">
              <select
                className="select"
                defaultValue=""
                {...register('country', {
                  required: 'This field is required!',
                })}
              >
                <option value="" disabled>
                  Select a country
                </option>
                {sortedCountries?.map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <div className="select-pointer">
                <CircleArrowDown className="size-5 text-gray-100" />
              </div>
            </div>
          </div>
          {errors.country && (
            <span className="text-red-500 text-xs">
              {errors.country.message}
            </span>
          )}

          {/* Duration */}
          <div className="input-field">
            <label className="font-normal text-gray-100" htmlFor="country">
              Duration
            </label>
            <input
              id="duration"
              type="number"
              placeholder="Enter a number of days (5, 12, ...)"
              className="form-input placeholder:text-gray-100"
              {...register('duration', { required: 'This field is required!' })}
            />
          </div>
          {errors.duration && (
            <span className="text-red-500 text-xs">
              {errors.duration.message}
            </span>
          )}

          {selectItems.map((key) => (
            <div key={key} className="input-field">
              <label className="font-normal text-gray-100" htmlFor={key}>
                {formatKey(key)}
              </label>
              <div className="relative w-full">
                <select
                  className="select"
                  defaultValue=""
                  {...register(key, {
                    required: 'This field is required!',
                  })}
                >
                  <option value="" disabled>
                    {`Select ${formatKey(key)}`}
                  </option>
                  {comboBoxItems[key].map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <div className="select-pointer">
                  <CircleArrowDown className="size-5 text-gray-100" />
                </div>
              </div>
              {/* Error handling */}
              {errors[key as keyof TripFormData] && (
                <span className="text-red-500 text-xs">
                  {errors[key as keyof TripFormData]?.message}
                </span>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="mt-8 w-full h-11 rounded-xl text-white bg-indigo-500 hover:opacity-90 transition-opacity cursor-pointer"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <div className="animate-spin rounded-full h-7 w-7 m-auto border-2 border-white border-t-[#2563eb] "></div>
            ) : (
              'Create Trip'
            )}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
