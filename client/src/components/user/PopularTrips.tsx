import { useAppContext } from '@/context/AppContext';
import TripCard from '../common/TripCard';
import Title from '../common/Title';

const PopularTrips = () => {
  const { trips } = useAppContext();
  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32 py-10 md:py-20">
      <Title
        title="Popular Trips"
        subtitle="Browse through some of our most popular well planned trips designed for different travel styles and interests"
      />
      <div className="flex flex-wrap justify-center gap-10 mt-10">
        {trips
          ?.slice(0, 4)
          .map(
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
    </div>
  );
};

export default PopularTrips;
