import { featuredDestinations } from '@/assets/assets';
import Title from '../common/Title';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import DestinationCard from '../common/DestinationCard';

const FeaturedDestinations = () => {
  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32 py-10 md:py-20">
      <Title
        title="Featured Travel Destinations"
        subtitle="Check out some of the best places you can visit around the world"
      />
      {/* For Mobile */}
      <div className="md:hidden mt-10 px-4">
        <Carousel
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {featuredDestinations.map((destination) => (
              <CarouselItem key={destination._id} className="basis-full">
                <DestinationCard
                  title={destination.title}
                  city={destination.city}
                  country={destination.country}
                  imageUrl={destination.imageUrl}
                  activities={destination.activities}
                  rating={destination.rating}
                  height={350}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* For Destop */}
      <div className="hidden md:flex gap-5 mt-10 max-h-[850px]">
        {/* Left Section (3/4 width) */}
        <div className="flex flex-col gap-5 basis-3/4">
          {/* Large Featured Card */}
          <DestinationCard {...featuredDestinations[0]} height={300} />

          {/* Two Horizontal Cards */}
          <div className="flex gap-5">
            <DestinationCard {...featuredDestinations[1]} height={200} />
            <DestinationCard {...featuredDestinations[2]} height={200} />
          </div>
        </div>

        {/* Right Section (1/4 width) */}
        <div className="flex flex-col gap-5 basis-1/4">
          <DestinationCard {...featuredDestinations[3]} height={160} />
          <DestinationCard {...featuredDestinations[4]} height={160} />
          <DestinationCard {...featuredDestinations[5]} height={160} />
        </div>
      </div>
    </div>
  );
};

export default FeaturedDestinations;
