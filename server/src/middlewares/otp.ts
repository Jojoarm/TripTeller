import crypto from 'crypto';
import AuthModel from '../models/AuthModel';

export const generateOtp = (): string => {
  return crypto.randomInt(100000, 1000000).toString(); // 6-digit code
};

export const saveOtp = async (email: string, otp: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  await AuthModel.create({ email, otp, expiresAt });
};

export const validateOtp = async (
  email: string,
  otp: string
): Promise<boolean> => {
  const record = await AuthModel.findOne({ email, otp });
  return !!record; // true if found and not expired
};

export const deleteOtp = async (email: string): Promise<void> => {
  await AuthModel.deleteMany({ email });
};
