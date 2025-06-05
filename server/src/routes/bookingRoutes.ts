import express from 'express';
import verifyToken from '../middlewares/auth';
import {
  checkBooking,
  createBooking,
  getUserBookings,
  verifyBooking,
} from '../controllers/bookingController';

const bookingRouter = express.Router();

bookingRouter.post('/create-booking', verifyToken, createBooking);
bookingRouter.get('/bookings', verifyToken, getUserBookings);
bookingRouter.get('/check-booking/:tripId', verifyToken, checkBooking);
bookingRouter.get('/verify-booking', verifyToken, verifyBooking);

export default bookingRouter;
