import mongoose from 'mongoose';
import { UserType } from './UserModel';
import { TripDocument } from './TripModel';

export interface BookingType {
  user: mongoose.Types.ObjectId | UserType;
  trip: mongoose.Types.ObjectId | TripDocument;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: Date;
  paymentMethod: string;
  isPaid: boolean;
}

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
    trip: { type: mongoose.Schema.ObjectId, ref: 'TripModel', required: true },
    guests: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: { type: String, required: true, default: 'Credit Card' },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model<BookingType>('BookingModel', bookingSchema);

export default BookingModel;
