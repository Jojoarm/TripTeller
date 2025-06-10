import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import * as apiClient from '../../api-client';
import Loader from '@/components/common/Loader';
import Pagination from '@/components/common/Pagination';
import Title from '@/components/common/Title';
import type { BookingType, UserType } from '@/types';
import { formatDate } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import toast from 'react-hot-toast';

type UserDataType = {
  user: UserType;
  bookings: BookingType[];
  cancelledBookings: number;
  completedBookings: number;
  totalBookings: number;
  totalRevenue: number;
};

export type Role = 'user' | 'admin';

const AllUsers = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchUser, setSearchUser] = useState('');
  const [usernameQuery, setUsernameQuery] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [userRoleEditOpenId, setUserRoleEditOpenId] = useState<string | null>(
    null
  );
  const [deletedUserId, setDeletedUserId] = useState<string | null>(null);

  const limit = 6;

  // change user role
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.adminChangeUserRole(id, status),
    onSuccess: async () => {
      setUserRoleEditOpenId(null);
      await queryClient.invalidateQueries({ queryKey: ['adminFetchUsers'] });
    },
    onError: (error: Error) => {
      toast.error((error as Error).message);
    },
  });

  const handleUserRoleChange = async (id: string, status: Role) => {
    updateMutation.mutate({ id, status });
  };

  // deletUser
  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => apiClient.adminDeleteUser(id),
    onSuccess: async () => {
      setDeletedUserId(null);
      await queryClient.invalidateQueries({ queryKey: ['adminFetchUsers'] });
    },
    onError: (error: Error) => {
      toast.error((error as Error).message);
    },
  });

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate({ id });
    }
  };

  //Filtering
  // Hydrate initial state from URL
  useEffect(() => {
    const userNameParam = searchParams.get('username');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');
    setUsernameQuery(userNameParam || '');
    setSelectedSort(sortParam || '');
    setCurrentPage(pageParam ? parseInt(pageParam) : 1);
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (usernameQuery) params.username = usernameQuery;
    if (currentPage > 1) params.page = currentPage.toString();
    if (selectedSort) params.sort = selectedSort;
    params.limit = limit.toString();
    setSearchParams(params);
  }, [currentPage, usernameQuery, selectedSort]);

  const { data, isPending } = useQuery({
    queryKey: ['adminFetchUsers', searchParams.toString()],
    queryFn: () => apiClient.adminFetchUsers(searchParams),
  });

  if (isPending) return <Loader />;

  const userData = data?.data ?? [];
  const pagination = data?.pagination ?? {};

  const tableTitle = [
    'No.',
    'Name',
    'Email Address',
    'Date Joined',
    'Trips',
    'Total Revenue',
    'Status',
    'Action',
  ];

  const sortOptions = ['Asc', 'Dsc', 'Latest', 'Most revenue'];

  const handleSortSelect = (item: string) => {
    setSelectedSort(item);
    setSortOpen(false);
  };

  const clearFilters = () => {
    setUsernameQuery('');
    setSelectedSort('');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="flex flex-col gap-3 items-start justify-between">
      <Title
        align="left"
        title="Manage Users"
        subtitle="Filter, sort and access detailed user profiles"
      />

      <div className="relative mt-5 mb-10  bg-white border rounded-2xl">
        {/* filters */}
        <p
          className="absolute right-0 top-0 text-gray-400 underline py-2 px-4 text-sm cursor-pointer"
          onClick={clearFilters}
        >
          Clear Filters
        </p>
        <div className="flex justify-between w-full pt-7">
          <div className="flex items-center text-sm bg-white h-12 border m-2 pl-2 rounded-2xl border-gray-500/30 w-full max-w-sm overflow-hidden">
            <input
              className="px-2 w-full h-full outline-none text-gray-500 bg-transparent"
              type="email"
              placeholder="Search by username"
              onChange={(e) => setSearchUser(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setUsernameQuery(searchUser);
                  setCurrentPage(1); //reset to page 1 on new search
                }
              }}
            />
            <img
              src="/assets/icons/searchIcon.svg"
              className="size-10 text-gray-600 bg-gray-500 h-full cursor-pointer"
              onClick={() => {
                setUsernameQuery(searchUser);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex flex-col w-44 m-2 text-sm text-gray-600 relative">
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="w-full text-left px-4 pr-2 py-2 border rounded-2xl bg-white text-gray-800 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none cursor-pointer"
            >
              <span>{selectedSort || 'Sort'}</span>
              <img
                src="/assets/icons/arrow-down.svg"
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
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

        <Table className=" w-full [&_th]:p-4 [&_td]:p-4">
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
            {userData.map((data: UserDataType, index: number) => (
              <TableRow
                key={data.user._id}
                className="border rounded-2xl p-10 bg-white shadow hover:bg-gray-50 transition-colors"
              >
                <TableCell className="p-4">
                  <p className="text-gray-600">
                    ({(currentPage - 1) * limit + index + 1})
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <div className="size-7 md:size-9 flex justify-center items-center rounded-full bg-gray-500 overflow-hidden">
                      {data.user.image ? (
                        <img
                          src={`${data.user.image}`}
                          alt="profile picture"
                          className=" object-cover "
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <p className="text-center text-white font-normal text-xl">
                          {data.user.username[0]}
                        </p>
                      )}
                    </div>
                    <p className="font-normal text-gray-600 text-base">
                      {data.user.username}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-normal text-gray-600 text-base">
                    {data.user.email}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-normal text-gray-600 text-base">
                    {formatDate(data.user.createdAt)}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-3 md:gap-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-normal text-gray-600 text-base">
                        Total:
                      </span>{' '}
                      {data.totalBookings}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-normal text-gray-600 text-base">
                        Completed:
                      </span>{' '}
                      {data.completedBookings}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-normal text-gray-600 text-base">
                        Cancelled:
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
                    }).format(data.totalRevenue)}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-4">
                    <p className="font-normal text-gray-600 text-base">
                      {data.user.status.charAt(0).toUpperCase() +
                        data.user.status.slice(1)}
                    </p>
                    {updateMutation.isPending &&
                    userRoleEditOpenId === data.user._id ? (
                      <div className="animate-spin rounded-full size-5 m-auto border-2 border-white border-t-[#2563eb] "></div>
                    ) : (
                      <Pencil
                        className=" size-4 text-navy-500 cursor-pointer"
                        onClick={() =>
                          setUserRoleEditOpenId((prev) =>
                            prev === data.user._id ? null : data.user._id
                          )
                        }
                      />
                    )}
                    {userRoleEditOpenId === data.user._id && (
                      <ul className="absolute z-10 w-full top-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                        <li
                          className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                          onClick={() => {
                            handleUserRoleChange(data.user._id, 'admin');
                          }}
                        >
                          admin
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                          onClick={() => {
                            handleUserRoleChange(data.user._id, 'user');
                          }}
                        >
                          user
                        </li>
                      </ul>
                    )}
                  </div>
                </TableCell>
                <TableCell className="">
                  <div className="px-4 mx-auto">
                    {deletedUserId === data.user._id &&
                    deleteMutation.isPending ? (
                      <div className="animate-spin rounded-full size-5 m-auto border-2 border-white border-t-[#2563eb] "></div>
                    ) : (
                      <Trash2
                        className="size-5 text-red-400 hover:text-red-500 cursor-pointer"
                        onClick={() => {
                          {
                            setDeletedUserId(data.user._id);
                            handleDeleteUser(data.user._id);
                          }
                        }}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllUsers;
