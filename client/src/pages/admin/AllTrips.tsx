import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import * as apiClient from '../../api-client';
import Loader from '@/components/common/Loader';
import Pagination from '@/components/common/Pagination';
import Title from '@/components/common/Title';
import type { BookingType, TripType } from '@/types';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type TripDataType = {
  trip: TripType;
  bookings: BookingType[];
  cancelledBookings: number;
  completedBookings: number;
  totalBookings: number;
  totalRevenue: number;
};

const AllTrips = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTrip, setSearchTrip] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');

  const limit = 7;

  //Filtering
  // Hydrate initial state from URL
  useEffect(() => {
    const searchStringParams = searchParams.get('searchString');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');
    setSearchParams(searchStringParams || '');
    setSelectedSort(sortParam || '');
    setCurrentPage(pageParam ? parseInt(pageParam) : 1);
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.searchString = searchQuery;
    if (currentPage > 1) params.page = currentPage.toString();
    if (selectedSort) params.sort = selectedSort;
    params.limit = limit.toString();
    setSearchParams(params);
  }, [currentPage, searchQuery, selectedSort]);

  const { data, isPending } = useQuery({
    queryKey: ['adminFetchTrips', searchParams.toString()],
    queryFn: () => apiClient.adminFetchTrips(searchParams),
  });

  if (isPending) return <Loader />;

  const tripData = data?.data ?? [];
  const pagination = data?.pagination ?? {};

  const tableTitle = [
    'No.',
    'Trip Detail',
    'Location',
    'Budget',
    'Bookings',
    'Price',
    'Interest',
    'Total Revenue',
  ];

  const sortOptions = [
    'Price Low to High',
    'Price High to Low',
    'Latest',
    'Most revenue',
  ];

  const handleSortSelect = (item: string) => {
    setSelectedSort(item);
    setSortOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSort('');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="flex flex-col gap-3 items-start justify-between">
      <Title
        align="left"
        title="Manage Trips"
        subtitle="Filter, sort and access AI generated trips"
      />

      <div className="relative mt-5 mb-10 w-full  bg-white border rounded-2xl">
        {/* filters */}
        <p
          className="absolute right-0 top-0 text-gray-400 underline py-2 px-4 text-sm cursor-pointer"
          onClick={clearFilters}
        >
          Clear Filters
        </p>
        <div className="flex justify-between w-full pt-7">
          <div className="flex items-center text-sm bg-white h-8 md:h-10 border m-2 pl-2 rounded-2xl border-gray-500/30 w-full max-w-sm overflow-hidden">
            <input
              className="px-2 w-full h-full outline-none text-gray-500 bg-transparent"
              type="text"
              placeholder="Search trip"
              onChange={(e) => setSearchTrip(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchQuery(searchTrip);
                  setCurrentPage(1); //reset to page 1 on new search
                }
              }}
            />
            <img
              src="/assets/icons/searchIcon.svg"
              className="size-7 md:size-10 text-gray-600 bg-gray-500 h-full cursor-pointer"
              onClick={() => {
                setSearchQuery(searchTrip);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex flex-col w-44 m-2 text-xs md:text-sm text-gray-600 relative">
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="w-full text-left px-4 pr-2 py-2 border rounded-2xl bg-white text-gray-800 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none cursor-pointer"
            >
              <span>{selectedSort || 'Sort'}</span>
              <img
                src="/assets/icons/arrow-down.svg"
                className={`size-4 md:size-5 inline float-right transition-transform duration-200 ${
                  sortOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {sortOpen && (
              <ul className="absolute z-10 w-full top-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                {sortOptions.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                    onClick={() => handleSortSelect(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <Table className=" w-full [&_th]:p-4 [&_td]:px-4 &_td]:py-1">
          <TableCaption className="pb-4">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </TableCaption>
          <TableHeader>
            <TableRow className="font-semibold text-gray-600 p-2  items-center text-base font-playfiar">
              {tableTitle.map((item, index) => (
                <TableHead
                  className="font-semibold text-gray-600 p-2  items-center text-base "
                  key={index}
                >
                  {item}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {tripData.map((data: TripDataType, index: number) => (
              <TableRow
                key={data.trip._id}
                className="border rounded-2xl p-10 bg-white shadow hover:bg-gray-50 transition-colors"
              >
                <TableCell className="p-2">
                  <p className="text-gray-600">
                    ({(currentPage - 1) * limit + index + 1})
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <div className="size-7 md:size-10 flex justify-center items-center rounded-full bg-gray-500 overflow-hidden">
                      <img
                        src={`${data.trip.imageUrls[1]}`}
                        alt="trip picture"
                        className=" rounded-full size-7 md:size-10 aspect-square"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="font-normal text-gray-600 text-base w-44 truncate">
                      {data.trip.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">
                      <span className="font-normal text-gray-600 text-base">
                        City:
                      </span>{' '}
                      {data.trip.location.city}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-normal text-gray-600 text-base">
                        Country:
                      </span>{' '}
                      {data.trip.country}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-normal text-gray-600 text-base">
                    {data.trip.budget}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-navy-500">
                      <span className="font-normal text-gray-600 text-base">
                        Total:
                      </span>{' '}
                      {data.totalBookings}
                    </p>
                    <p className="text-sm font-semibold text-green-500 ">
                      <span className="font-normal text-gray-600 text-base">
                        Completed Trips:
                      </span>{' '}
                      {data.completedBookings}
                    </p>
                    <p className="text-sm font-semibold text-red-500 ">
                      <span className="font-normal text-gray-600 text-base">
                        Cancelled Trips:
                      </span>{' '}
                      {data.cancelledBookings}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-normal text-gray-600 text-base">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(data.trip.estimatedPrice)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-normal text-gray-600 text-base">
                    {data.trip.budget}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-normal text-gray-600 text-base">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(data.totalRevenue)}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllTrips;
