import Loader from '@/components/common/Loader';
import StarRating from '@/components/common/StarRating';
import BookingCard from '@/components/user/BookingCard';
import HandpickedTrips from '@/components/user/HandpickedTrips';
import { useAppContext } from '@/context/AppContext';
import type { DayPlan, TripType } from '@/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export type Params = {
  id: string;
};

const TripDetails = () => {
  // const trips = tripsDummyData;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  const { id } = useParams();
  const { currency } = useAppContext();
  const [trip, setTrip] = useState<TripType | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [showBookingCard, setShowBookingCard] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const getTrip = async () => {
    const response = await fetch(`${API_BASE_URL}/api/trips/trips/${id}`);
    const responseBody = await response.json();
    if (responseBody.success) {
      setTrip(responseBody.tripData);
      setMainImage(responseBody.tripData.imageUrls[0]);
    } else {
      return null;
    }
  };

  //Check if trip is already booked by user
  const checkBooking = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/bookings/check-booking/${id}`,
      {
        credentials: 'include',
      }
    );
    const responseBody = await response.json();
    if (responseBody.success) {
      setIsBooked(false);
    } else {
      setIsBooked(true);
    }
  };

  useEffect(() => {
    getTrip();
    checkBooking();
  }, [id]);

  if (!trip) {
    return <Loader />;
  }

  const {
    title,
    duration,
    itinerary,
    travelStyle,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    country,
    location,
    imageUrls,
  } = trip;

  //Dynamically giving different background colors to tags
  const tagItems = [
    { text: travelStyle, bg: 'bg-pink-50 text-pink-500' },
    { text: groupType, bg: 'bg-primary-50 text-primary-500' },
    { text: budget, bg: 'bg-success-50 text-success-700' },
    { text: interests, bg: 'bg-navy-50 text-navy-500' },
  ];

  return (
    <div className="flex flex-col gap-3 items-start justify-between py-20 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col items-start gap-3">
        <h2 className=" font-semibold text-3xl md:text-4xl font-playfair text-gray-800">
          {title}
        </h2>
        <div className="flex flex-row-reverse gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <img
              src="/assets/icons/location-mark.svg"
              alt="location"
              className="w-4 h-4"
            />
            <span>
              {location.city}, {country}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <img
              src="/assets/icons/calendar.svg"
              alt="location"
              className="w-4 h-4"
            />
            <span>{duration} day plan</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {/* Tag Items */}
          <div className="flex flex-wrap gap-2">
            {tagItems.map((tag, index) => (
              <p
                key={index}
                className={`text-xs px-2 py-1 shadow rounded-3xl ${tag.bg}`}
              >
                {tag.text}
              </p>
            ))}
          </div>
          <div className="flex items-start gap-1">
            <StarRating />
            <p className="text-orange-400 text-xs px-2 bg-orange-50 shadow rounded-3xl">
              4.5/5.0
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full lg:flex-row my-6 gap-6">
        <div className="w-full lg:w-1/2">
          <img
            src={mainImage}
            alt="main trip photo"
            referrerPolicy="no-referrer"
            className="w-full h-[400px] rounded-4xl shadow-md border border-gray-200 shadow-gray-600  object-cover transition-transform duration-300 hover:scale-103"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {imageUrls.length > 1 &&
            imageUrls.map((image, index) => (
              <img
                src={image}
                alt="trip photo"
                key={index}
                onClick={() => setMainImage(image)}
                referrerPolicy="no-referrer"
                className={`w-full h-[190px] rounded-4xl shadow-md object-cover cursor-pointer ${
                  mainImage === image && 'outline-3 outline-slate-500'
                }`}
              />
            ))}
        </div>
      </div>

      <div className="flex justify-between gap-5 my-6 w-full">
        <article className="flex flex-col gap-4">
          <h3 className="text-xl md:text-3xl text-dark-100 font-semibold">
            {duration}-Day {country} {travelStyle}
          </h3>
          <p className="text-base md:text-2xl text-gray-100 font-normal">
            {budget}, {groupType} and {interests}
          </p>
        </article>
        <h2 className="text-sm md:text-xl font-normal text-dark-100">
          <span className="font-semibold text-gray-600">Budget:</span>{' '}
          {currency}
          {estimatedPrice}
        </h2>
      </div>

      <p className="text-sm md:text-lg font-normal text-dark-400">
        {description}
      </p>

      <ul className="flex flex-col my-6 gap-5 bg-slate-100 p-4 w-full border border-gray-200 rounded-2xl">
        <h3 className="text-base md:text-2xl font-semibold text-amber-900 text-center">
          Daily Activities
        </h3>
        {itinerary.map((dayPlan: DayPlan, index: number) => (
          <li
            className="flex flex-col gap-4 border-b pb-4 last:border-none"
            key={index}
          >
            <h3 className="text-base md:text-xl font-semibold text-dark-400">
              Day {dayPlan.day}: {dayPlan.location}
            </h3>

            <ul className="flex flex-col sm:gap-3 gap-7">
              {dayPlan.activities.map((activitiy, index) => (
                <li
                  className="flex max-sm:flex-col flex-row justify-between sm:gap-7 gap-3 text-sm md:text-lg font-normal text-dark-400 !list-disc"
                  key={index}
                >
                  <span className="w-[90px] flex-shrink-0 p-18-semibold">
                    {activitiy.time}
                  </span>
                  <p className="flex-grow">{activitiy.description}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 my-3">
        <h3 className="text-base md:text-xl text-dark-400 font-semibold">
          Best Time to Visit
        </h3>
        {bestTimeToVisit.map((time, index) => (
          <ul key={index} className="flex flex-col gap-5 ml-5">
            <li className=" text-sm md:text-lg font-normal text-dark-400 !list-disc">
              <p className="flex-grow">{time}</p>
            </li>
          </ul>
        ))}
      </div>

      <div className="flex flex-col gap-2 my-3">
        <h3 className="text-base md:text-xl text-dark-400 font-semibold">
          Weather Info
        </h3>
        {weatherInfo.map((weather, index) => (
          <ul key={index} className="flex flex-col gap-5 ml-5">
            <li className=" text-sm md:text-lg font-normal text-dark-400 !list-disc">
              <p className="flex-grow">{weather}</p>
            </li>
          </ul>
        ))}
      </div>

      <button
        onClick={() => setShowBookingCard(true)}
        className="bg-primary-100 hover:bg-primary-500 active:scale-95 transition-all text-white rounded-md max-md:w-full
            max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer"
      >
        {isBooked ? 'View Booking' : 'Pay & Join Trip'}
      </button>

      {showBookingCard && (
        <BookingCard
          setShowBookingCard={setShowBookingCard}
          tripId={id}
          tripImage={mainImage}
        />
      )}

      <HandpickedTrips />
    </div>
  );
};

export default TripDetails;
