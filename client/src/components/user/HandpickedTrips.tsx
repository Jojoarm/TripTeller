import type { TripType } from '@/types';
import TripCard from '../common/TripCard';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';

const HandpickedTrips = () => {
  const { trips, user } = useAppContext();

  const [recommendedTrips, setRecommendedTrips] = useState<TripType[] | null>(
    []
  );

  const filterTrips = () => {
    const filteredTrips = trips?.filter((trip) =>
      user?.recentSearchedDestinations?.includes(
        trip.country || trip.location.city
      )
    );
    if (filteredTrips) {
      setRecommendedTrips(filteredTrips);
    } else {
      setRecommendedTrips(trips);
    }
  };

  useEffect(() => {
    filterTrips();
  }, [trips, user]);

  return (
    <section className="flex flex-col items-center md:items-start gap-6 my-6 w-full">
      <h2 className="text-xl md:text-2xl text-dark-400 font-semibold">
        Recommended Trips
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
        {recommendedTrips
          ?.slice(0, 4)
          ?.map(
            ({
              _id,
              title,
              imageUrls,
              country,
              location,
              interests,
              travelStyle,
              estimatedPrice,
            }) => (
              <TripCard
                id={_id}
                key={_id}
                title={title}
                country={country}
                location={location}
                imageUrl={imageUrls[0]}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
              />
            )
          )}
      </div>
    </section>
  );
};

export default HandpickedTrips;
