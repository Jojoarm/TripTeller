import { CheckBox, RadioButton } from '@/components/common/FilterButtons';
import Loader from '@/components/common/Loader';
import Pagination from '@/components/common/Pagination';
import StarRating from '@/components/common/StarRating';
import Title from '@/components/common/Title';
import { useAppContext } from '@/context/AppContext';
import { getFirstWord } from '@/lib/utils';
import type { TripType } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const { currency } = useAppContext();
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [trips, setTrips] = useState<TripType[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    interests: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState<SortOption>('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;

  const interests = [
    'Hiking',
    'Historical',
    'Beaches',
    'Shopping',
    'Night Life',
    'Food',
    'Local',
    'Museums',
    'Photography',
  ];

  const priceRange = ['Budget', 'Mid-Range', 'Luxury', 'Premium'];

  const sortOptions: SortOption[] = [
    'Price Low to High',
    'Price High to Low',
    'Newest First',
  ];

  // Hydrate initial state from URL
  useEffect(() => {
    const interestsParam = searchParams.get('interests');
    const priceRangeParam = searchParams.get('priceRange');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');

    setSelectedFilters({
      interests: interestsParam ? interestsParam.split(',') : [],
      priceRange: priceRangeParam ? priceRangeParam.split(',') : [],
    });

    setSelectedSort((sortParam as SortOption) || '');
    setCurrentPage(pageParam ? parseInt(pageParam) : 1);
  }, []);

  // Sync URL with state
  useEffect(() => {
    const params: Record<string, string> = {};

    if (selectedFilters.interests.length)
      params.interests = selectedFilters.interests.join(',');

    if (selectedFilters.priceRange.length)
      params.priceRange = selectedFilters.priceRange.join(',');

    if (selectedSort) params.sort = selectedSort;

    const destination = searchParams.get('destination');
    if (destination) params.destination = destination;

    if (currentPage > 1) params.page = currentPage.toString();

    params.limit = limit.toString();

    setSearchParams(params);
  }, [selectedFilters, selectedSort, currentPage]);

  const fetchTrips = async () => {
    const res = await fetch(
      `${API_BASE_URL}/api/trips/trips?${searchParams.toString()}`
    );
    const data = await res.json();
    if (data.success) {
      setTrips(data.tripData);
      setTotalCount(data.pagination.totalItems);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [searchParams]);

  //Handle changes for filters and sorting
  const handleFilterChange = (
    checked: boolean,
    value: string,
    type: keyof SelectedFilters
  ) => {
    setSelectedFilters((prevFilters) => {
      const updated = { ...prevFilters };
      if (checked && !updated[type].includes(value)) {
        updated[type].push(value);
      } else if (!checked) {
        updated[type] = updated[type].filter((item) => item !== value);
      }
      return updated;
    });
  };

  //clear all filters
  const clearFilters = () => {
    setSelectedFilters({ interests: [], priceRange: [] });
    setSelectedSort('');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Reset to first page on filter/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, selectedSort]);

  if (!trips) return <Loader />;

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between py-20 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="">
        <Title
          align="left"
          title="Exclusive Trips"
          subtitle="Take advantage of our AI generated trips and special packages to make plans for your next vacation and create unforgettable memories"
        />
        {trips.map((trip, index) => (
          <div
            key={index}
            className="flex flex-col  md:flex-row gap-2 md:gap-10 p-4 my-4 md:my-10 items-start border-b border-gray-300 group bg-slate-50 rounded-2xl"
            onClick={() => {
              navigate(`/trips/${trip._id}`);
              scrollTo(0, 0);
            }}
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
                  {currency}
                  {trip.estimatedPrice}
                </p>
              </div>
            </div>
          </div>
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / limit)}
          onPageChange={setCurrentPage}
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
            {priceRange.map((range, index) => (
              <CheckBox
                key={index}
                label={range}
                selected={selectedFilters.priceRange.includes(range)}
                onChange={(checked) =>
                  handleFilterChange(checked, range, 'priceRange')
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
                onChange={() => setSelectedSort(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;
