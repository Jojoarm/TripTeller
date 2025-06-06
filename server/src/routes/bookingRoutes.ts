import express from 'express';
import verifyToken from '../middlewares/auth';
import {
  cancelUserBooking,
  checkBooking,
  createBooking,
  getUserBookings,
  verifyBooking,
} from '../controllers/bookingController';

const bookingRouter = express.Router();

bookingRouter.post('/create-booking', verifyToken, createBooking);
bookingRouter.get('/user-bookings', verifyToken, getUserBookings);
bookingRouter.get('/check-booking/:tripId', verifyToken, checkBooking);
bookingRouter.get('/verify-booking', verifyToken, verifyBooking);
bookingRouter.get('/cancel-booking/:bookingId', verifyToken, cancelUserBooking);

export default bookingRouter;
