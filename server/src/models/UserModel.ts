import mongoose from 'mongoose';

export interface UserType {
  username: string;
  googleId?: string;
  email: string;
  password: string;
  image: string;
  status: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  recentSearchedDestinations: string[];
  trips: mongoose.Types.ObjectId[];
  isDeleted: boolean;
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String, required: false },
    status: { type: String, enum: ['admin', 'user'], default: 'user' },
    recentSearchedDestinations: { type: [String], default: [] },
    trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TripModel' }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<UserType>('UserModel', userSchema);

export default UserModel;
