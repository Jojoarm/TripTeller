export type UserType = {
  _id: string;
  username: string;
  email: string;
  image: string;
  status: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  recentSearchedDestinations: string[];
  trips: string[];
};

export interface Country {
  name: string;
  coordinates: [number, number];
  value: string;
  openStreetMap?: string;
}

export interface Activity {
  time: string;
  description: string;
}

export interface DayPlan {
  day: number;
  location: string;
  activities: Activity[];
}

export interface Location {
  city: string;
  coordinates: [number, number];
  openStreetMap: string;
}

export interface TripType {
  _id: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: number;
  duration: number;
  budget: string;
  travelStyle: string;
  country: string;
  interests: string;
  groupType: string;
  bestTimeToVisit: string[];
  weatherInfo: string[];
  itinerary: DayPlan[];
  location: Location;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingType {
  _id: string;
  user: string;
  trip: TripType;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: Date;
  paymentMethod: string;
  isPaid: boolean;
}

export type TestimonialType = {
  id: number;
  name: string;
  address: string;
  image: string;
  rating: number;
  review: string;
};

export type FetchTripsParams = {
  interests?: string[];
  priceRange?: string[];
  sort?: string;
  destination?: string;
  page?: number;
  limit?: number;
};
