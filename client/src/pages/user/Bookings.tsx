import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as apiClient from '../../api-client';
import { useEffect, useState } from 'react';
import Loader from '@/components/common/Loader';
import Title from '@/components/common/Title';
import type { BookingType } from '@/types';
import { formatDate } from '@/lib/utils';
import Pagination from '@/components/common/Pagination';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const Bookings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { API_BASE_URL, user } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 5;
  const { data, isPending } = useQuery({
    queryKey: ['fetchUserBookings', searchParams.toString()],
    queryFn: () => apiClient.getUserBookings(searchParams),
  });

  //Dynamically giving different background colors to paymentStatus
  const paymentStatus = [
    { text: 'confirmed', bg: 'bg-green-50 text-green-500' },
    { text: 'pending', bg: 'bg-navy-50 text-navy-500' },
    { text: 'cancelled', bg: 'bg-red-50 text-red-700' },
  ];

  const handleCancelBooking = async (bookingId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/bookings/cancel-booking/${bookingId}`,
      {
        credentials: 'include',
      }
    );
    const responseBody = await response.json();
    if (responseBody.success) {
      queryClient.invalidateQueries({ queryKey: ['fetchUserBookings'] });
      toast.success(responseBody.message);
    } else {
      return null;
    }
  };

  useEffect(() => {
    const params: Record<string, string> = {};
    if (currentPage > 1) params.page = currentPage.toString();
    params.limit = limit.toString();
    setSearchParams(params);
  }, [currentPage]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['fetchUserBookings'] });
  }, []);

  const bookings = data?.userBookings ?? [];
  const pagination = data?.pagination ?? {};

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isPending) return <Loader />;

  return (
    <div className="flex flex-col gap-3 items-start justify-between py-20 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        align="left"
        title="My Bookings"
        subtitle="Easily manage your past, current and upcoming trips reservations in one place. Plan your trips seamlessly with just a few clicks"
      />
      <div className="flex flex-col gap-7 w-full mt-5 bg-white border p-6 md:p-10 rounded-2xl">
        <div className="hidden md:grid md:grid-cols-[2fr_1fr_0.5fr_1fr_0.5fr] font-semibold text-gray-600 text-lg font-playfiar border-b-2 border-gray-200">
          <p>Trip Detail</p>
          <p>Location</p>
          <p>Trip Cost</p>
          <p>Status</p>
          <p>Action</p>
        </div>
        {bookings.map((booking: BookingType) => (
          <div
            key={booking._id}
            className="flex flex-col md:grid md:grid-cols-[2fr_1fr_0.5fr_1fr_0.5fr] gap-2 border rounded-2xl p-4 bg-white shadow"
          >
            {/* Details */}
            <div className="flex gap-4">
              <img
                src={booking.trip.imageUrls[0]}
                alt="trip image"
                className="w-44 h-30 object-cover rounded-2xl"
              />
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-gray-600">
                  {booking.trip.title}
                </h3>
                <p className="text-sm text-gray-500">
                  <span className="font-normal text-gray-600 text-base">
                    Duration:
                  </span>{' '}
                  {booking.trip.duration} Day-Trip
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-normal text-gray-600 text-base">
                    Guest:
                  </span>{' '}
                  {booking.guests} Persons
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-normal text-gray-600 text-base">
                    Price:
                  </span>{' '}
                  ${booking.trip.estimatedPrice} /Persons
                </p>
              </div>
            </div>

            {/* location */}
            <div className="flex md:flex-col gap-3 md:gap-2">
              <p className="text-sm text-gray-500">
                <span className="font-normal text-gray-600 text-base">
                  Country:
                </span>{' '}
                {booking.trip.country}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-normal text-gray-600 text-base">
                  City:
                </span>{' '}
                {booking.trip.location.city}
              </p>
            </div>

            {/* price */}
            <p className="font-normal text-gray-600 text-base">
              <span className="md:hidden text-gray-700">Total Price: </span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(booking.totalPrice)}
            </p>

            {/* status */}
            <div className="flex md:flex-col gap-3 md:gap-2">
              <p className="text-sm text-gray-500">
                <span className="font-normal text-gray-600 text-base">
                  Method:
                </span>{' '}
                {booking.paymentMethod}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-normal text-gray-600 text-base">
                  Date:
                </span>{' '}
                {formatDate(booking.bookingDate)}
              </p>
              <div className="flex gap-2 items-center">
                <span className="font-normal text-gray-600 text-base">
                  Payment:
                </span>
                {(() => {
                  const status = paymentStatus.find(
                    (item) => item.text === booking.status
                  );
                  if (status) {
                    return (
                      <span
                        className={`text-sm px-2 py-1 shadow rounded-3xl ${status.bg}`}
                      >
                        {status.text.charAt(0).toUpperCase() +
                          status.text.slice(1)}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            {/* actions */}
            <div className="flex md:flex-col gap-3 md:gap-2">
              {!booking.isPaid && (
                <button
                  onClick={() => {
                    navigate(`/trips/${booking.trip._id}`);
                    scrollTo(0, 0);
                  }}
                  className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full bg-white text-green-400 hover:bg-green-400 hover:text-white hover:border-white transition-all cursor-pointer"
                >
                  Pay Now
                </button>
              )}
              {booking.status === 'cancelled' ? (
                <p className="text-sm text-red-400 line-through">
                  Trip Cancelled!
                </p>
              ) : (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="px-4 py-1.5 mt-4 text-xs border border-red-400 rounded-full bg-white text-red-400 hover:bg-red-400 hover:text-white hover:border-white  transition-all cursor-pointer"
                >
                  Cancel Trip
                </button>
              )}
            </div>
          </div>
        ))}

        {/* pagination */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages || 1}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Bookings;
