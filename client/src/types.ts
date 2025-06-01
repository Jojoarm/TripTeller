export type UserType = {
  _id: string;
  username: string;
  email: string;
  image: string;
  status: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  recentSearchedCountries: string[];
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
  estimatedPrice: string;
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
  // location: {
  //   city: string;
  //   coordinates: [number, number];
  //   openStreetMap: string;
  // };
  // itinerary: {
  //   day: number;
  //   location: string;
  //   activities: {
  //     time: string;
  //     description: string;
  //   }[];
  // }[];
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export type TestimonialType = {
  id: number;
  name: string;
  address: string;
  image: string;
  rating: number;
  review: string;
};
