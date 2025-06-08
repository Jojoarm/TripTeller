import express from 'express';
import {
  fetchUser,
  googleAuth,
  resetPassword,
  sendOtp,
  signIn,
  signUp,
  storeRecentSearchedDestinations,
  userLogout,
  verifyOtp,
} from '../controllers/userController';
import {
  validateUserLoginRequest,
  validateUserSignupRequest,
} from '../middlewares/validator';
import verifyToken from '../middlewares/auth';

const userRouter = express.Router();

userRouter.post('/sign-up', validateUserSignupRequest, signUp);
userRouter.post('/sign-in', validateUserLoginRequest, signIn);
userRouter.post('/google-auth', googleAuth);
userRouter.get('/fetch-user', verifyToken, fetchUser);
userRouter.post('/recent-search', verifyToken, storeRecentSearchedDestinations);
userRouter.post('/logout', userLogout);
userRouter.post('/send-otp', sendOtp);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/reset-password', resetPassword);

export default userRouter;
