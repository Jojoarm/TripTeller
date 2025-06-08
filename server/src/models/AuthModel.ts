import mongoose from 'mongoose';

export interface AuthModelType {
  email: string;
  otp: string;
  expiresAt: Date;
}

const authSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Automatically deletes expired documents
authSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AuthModel = mongoose.model<AuthModelType>('AuthModel', authSchema);

export default AuthModel;
