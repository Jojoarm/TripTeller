import { tripsDummyData } from '@/assets/assets';
import Title from '../common/Title';
import TripCard from '../common/TripCard';
import { useEffect, useState } from 'react';
import Pagination from '../common/Pagination';
import { useResponsiveLimit } from '@/lib/utils';

const HandpickedTrips = () => {
  const trips = tripsDummyData;

  //Handling limit to different screen sizes
  const limit = useResponsiveLimit();
  // Reset to first page when limit changes to avoid index bugs
  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(trips.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const currentTrips = trips.slice(startIndex, startIndex + limit);
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32 py-10 md:py-20">
      <Title
        title="Handpicked Trips"
        subtitle="Browse well planned trips designed for different travel styles and interests"
      />
      <div className="flex flex-wrap justify-center gap-10 mt-10">
        {currentTrips?.map(
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default HandpickedTrips;
