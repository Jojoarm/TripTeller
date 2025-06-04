import Title from '../common/Title';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import DestinationCard from '../common/DestinationCard';
import { useAppContext } from '@/context/AppContext';
import { getFirstWord } from '@/lib/utils';

type FeaturedDestination = {
  title: string;
  imageUrl: string;
  activities: number;
  city: string;
  country: string;
  rating: number;
};

const FeaturedDestinations = () => {
  const { trips } = useAppContext();
  const countriesSeen = new Set<string>();
  const featured: FeaturedDestination[] = [];

  trips?.forEach((trip) => {
    //get all the countries from your trips array
    if (countriesSeen.has(trip.country)) return;
    countriesSeen.add(trip.country);

    //get total activities for each country
    const activities = trip.itinerary.reduce(
      (total, day) => total + day.activities.length,
      0
    );

    featured.push({
      title: `${trip.country} Tour`,
      imageUrl: trip.imageUrls[1],
      activities,
      city: getFirstWord(trip.location.city),
      country: trip.country,
      rating: parseFloat((4 + Math.random()).toFixed(1)),
    });
  });

  const featuredDestinations = featured
    .sort((a, b) => b.activities - a.activities)
    .slice(0, 6);

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
            {featuredDestinations.map((destination, index) => (
              <CarouselItem key={index} className="basis-full">
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
