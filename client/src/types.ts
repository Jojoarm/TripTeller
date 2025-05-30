export type UserType = {
  _id: string;
  username: string;
  email: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  recentSearchedCountries: string[];
  trips: TripType[];
};

export interface TripType {
  _id: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: string;
  duration: number;
  budget: string;
  travelStyle: string;
  country: string;
  interests: string;
  groupType: string;
  bestTimeToVisit: string[];
  weatherInfo: string[];
  location: {
    city: string;
    coordinates: [number, number];
    openStreetMap: string;
  };
  itinerary: {
    day: number;
    location: string;
    activities: {
      time: string;
      description: string;
    }[];
  }[];
  imageUrls: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type TestimonialType = {
  id: number;
  name: string;
  address: string;
  image: string;
  rating: number;
  review: string;
};
