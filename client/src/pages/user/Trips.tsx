import { tripsDummyData } from '@/assets/assets';
import { CheckBox, RadioButton } from '@/components/common/FilterButtons';
import Pagination from '@/components/common/Pagination';
import StarRating from '@/components/common/StarRating';
import Title from '@/components/common/Title';
import { getFirstWord } from '@/lib/utils';
import type { TripType } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

type SelectedFilters = {
  interests: string[];
  priceRange: string[];
};

type SortOption =
  | 'Price Low to High'
  | 'Price High to Low'
  | 'Newest First'
  | '';

const Trips = () => {
  const trips = tripsDummyData;
  const [openFilters, setOpenFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    interests: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState<SortOption>('');

  const interests = [
    'Hiking',
    'Historical',
    'Beaches',
    'Shopping',
    'Night Life',
  ];
  const priceRanges = [
    { label: 'Low', value: '0 to 2500' },
    { label: 'Standard', value: '2501 to 10000' },
    { label: 'Premium', value: '10001 to 20000' },
    { label: 'Luxury', value: '20001 to 30000' },
  ];

  const sortOptions: SortOption[] = [
    'Price Low to High',
    'Price High to Low',
    'Newest First',
  ];

  //Handle changes for filters and sorting
  const handleFilterChange = (
    checked: boolean,
    value: string,
    type: keyof SelectedFilters
  ) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        updatedFilters[type].push(value);
      } else {
        updatedFilters[type] = updatedFilters[type].filter(
          (item) => item !== value
        );
      }
      return updatedFilters;
    });
  };

  const handleSortChange = (sortOption: SortOption) => {
    setSelectedSort(sortOption);
  };

  // Function to check if a client interests matches the selected trips interests
  const matchesInterests = (trip: TripType) => {
    return (
      selectedFilters.interests.length === 0 ||
      selectedFilters.interests.some((interest) =>
        trip.interests.toLowerCase().includes(interest.toLowerCase())
      )
    );
  };

  // Function to check if a trip matches the selected price ranges
  const matchesPriceRange = (trip: TripType) => {
    return (
      selectedFilters.priceRange.length === 0 ||
      selectedFilters.priceRange.some((rangeValue) => {
        const [min, max] = rangeValue.split(' to ').map(Number);
        return (
          Number(trip.estimatedPrice) >= min &&
          Number(trip.estimatedPrice) <= max
        );
      })
    );
  };

  //Function to sort trips based on the selected sort option
  const sortTrips = (a: TripType, b: TripType) => {
    if (selectedSort === 'Price Low to High')
      return Number(a.estimatedPrice) - Number(b.estimatedPrice);
    if (selectedSort === 'Price High to Low')
      return Number(b.estimatedPrice) - Number(a.estimatedPrice);
    if (selectedSort === 'Newest First')
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  };

  //Filter Destination
  const filterDestination = (trip: TripType) => {
    const destination = searchParams.get('destination');
    if (!destination) return true;
    return (
      trip.country.toLowerCase().includes(destination.toLowerCase()) ||
      trip.location.city.toLowerCase().includes(destination.toLowerCase())
    );
  };

  //Filter and sort trips based on the selected filters and sort options
  const filteredTrips = useMemo(() => {
    return trips
      .filter(
        (trip) =>
          matchesInterests(trip) &&
          matchesPriceRange(trip) &&
          filterDestination(trip)
      )
      .sort(sortTrips);
  }, [trips, selectedFilters, selectedSort, searchParams]);

  //clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      interests: [],
      priceRange: [],
    });
    setSelectedSort('');
    setSearchParams({});
  };

  //Pagination
  const limit = 4;
  // Reset to first page when limit changes to avoid index bugs
  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredTrips.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const currentTrips = filteredTrips.slice(startIndex, startIndex + limit);
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between py-20 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="">
        <Title
          align="left"
          title="Exclusive Trips"
          subtitle="Take advantage of our AI generated trips and special packages to make plans for your next vacation and create unforgettable memories"
        />
        {currentTrips.map((trip, index) => (
          <div
            key={index}
            className="flex flex-col  md:flex-row gap-2 md:gap-10 p-4 my-4 md:my-10 items-start border-b border-gray-300 group bg-slate-50 rounded-2xl"
          >
            <img
              src={trip.imageUrls[0]}
              alt="trip-img"
              title="View Trip Details"
              className="max-h-65 w-full md:w-1/2 rounded-4xl shadow-lg shadow-gray-100 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-102"
            />

            <div className="flex md:w-1/2 flex-col gap-3 py-5 ">
              <p className="text-gray-500">{trip.location.city}</p>
              <h2 className=" font-semibold text-2xl text-gray-800">
                {trip.title}
              </h2>
              <div className="flex items-center">
                <StarRating />
                <p className="ml-2">1000+ reviews</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <img
                  src="/assets/icons/location-mark.svg"
                  alt="location"
                  className="w-4 h-4"
                />
                <span>
                  {trip.location.city}, {trip.country}
                </span>
              </div>
              <div className="flex gap-2">
                {[trip.interests, trip.travelStyle].map((tag, index) => (
                  <p
                    key={index}
                    className="text-xs text-pink-400 bg-pink-50 px-2 py-1 shadow rounded-3xl "
                  >
                    {getFirstWord(tag)}
                  </p>
                ))}
              </div>
              <div className="flex flex-row gap-1 items-end">
                <p className=" font-medium text-gray-500">Budget: </p>
                <p className=" font-medium text-gray-700">
                  ${trip.estimatedPrice}
                </p>
              </div>
            </div>
          </div>
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${
            openFilters && 'border-b'
          }`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span
              className="lg:hidden"
              onClick={() => setOpenFilters(!openFilters)}
            >
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
            <span onClick={clearFilters} className="hidden lg:block">
              CLEAR
            </span>
          </div>
        </div>

        <div
          className={`${
            openFilters ? 'h-auto' : 'h-0 lg:h-auto'
          } overflow-hidden transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
            {interests.map((interest, index) => (
              <CheckBox
                key={index}
                label={interest}
                selected={selectedFilters.interests.includes(interest)}
                onChange={(checked) =>
                  handleFilterChange(checked, interest, 'interests')
                }
              />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={range.label}
                selected={selectedFilters.priceRange.includes(range.value)}
                onChange={(checked) =>
                  handleFilterChange(checked, range.value, 'priceRange')
                }
              />
            ))}
          </div>
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                name="sortOption"
                selected={selectedSort === option}
                onChange={() => handleSortChange(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;
