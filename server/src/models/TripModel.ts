import mongoose, { Schema, Document } from 'mongoose';

interface Activity {
  time: string;
  description: string;
}

interface ItineraryDay {
  day: number;
  location: string;
  activities: Activity[];
}

interface Location {
  city: string;
  coordinates: [number, number];
  openStreetMap: string;
}

export interface TripDocument extends Document {
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
  location: Location;
  itinerary: ItineraryDay[];
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<Activity>({
  time: { type: String, required: true },
  description: { type: String, required: true },
});

const ItineraryDaySchema = new Schema<ItineraryDay>({
  day: { type: Number, required: true },
  location: { type: String, required: true },
  activities: { type: [ActivitySchema], required: true },
});

const LocationSchema = new Schema<Location>({
  city: { type: String, required: true },
  coordinates: {
    type: [Number],
    required: true,
    validate: (val: number[]) => val.length === 2,
  },
  openStreetMap: { type: String, required: true },
});

const TripSchema = new Schema<TripDocument>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    estimatedPrice: { type: Number, required: true },
    duration: { type: Number, required: true },
    budget: { type: String, required: true },
    travelStyle: { type: String, required: true },
    country: { type: String, required: true },
    interests: { type: String, required: true },
    groupType: { type: String, required: true },
    bestTimeToVisit: { type: [String], required: true },
    weatherInfo: { type: [String], required: true },
    location: { type: LocationSchema, required: true },
    itinerary: { type: [ItineraryDaySchema], required: true },
    imageUrls: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

const TripModel = mongoose.model<TripDocument>('TripModel', TripSchema);

export default TripModel;
