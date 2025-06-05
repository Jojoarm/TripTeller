import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const PaymentSuccess = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verified, setVerified] = useState(false);

  const bookingId = searchParams.get('bookingId');

  //Verify if payment is completed

  useEffect(() => {
    if (!bookingId) {
      navigate('/');
    }

    const verifyBooking = async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/bookings/verify-booking?bookingId=${bookingId}`,
        {
          credentials: 'include',
        }
      );
      const responseBody = await response.json();
      if (
        responseBody.status === 'confirmed' &&
        responseBody.paymentStatus === true
      ) {
        setVerified(true);
      } else {
        navigate('/');
      }
    };

    verifyBooking();
  }, []);

  if (!verified)
    return <p className="text-center mt-20">Verifying payment...</p>;

  return (
    <div className="my-28 w-[350px] m-auto  p-4 md:p-6 bg-white rounded-2xl shadow border-b border-gray-500 shadow-gray-600 ">
      <div className=" flex flex-col gap-2 justify-between items-center ">
        <img
          src="/assets/icons/check.svg"
          alt="check-icon"
          className="size-10"
        />
        <h3 className="text-xl font-semibold text-gray-900 mt-4">
          Thank You & Welcome Aboard
        </h3>
        <p className="text-sm text-gray-700">
          Your trip has been booked, We can't wait to have you on this
          adventure! Get ready to explore and make more memories
        </p>

        <button
          onClick={() => navigate('/my-bookings')}
          className="text-sm text-white text-center bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all w-full h-10 mt-5 rounded-md cursor-pointer"
        >
          View your bookings
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
