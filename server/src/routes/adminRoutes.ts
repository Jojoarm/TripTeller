import express from 'express';
import verifyToken, { isAdmin } from '../middlewares/auth';
import {
  createTrip,
  getAllBookings,
  getAllUsers,
  getTripBookings,
  getUserBookings,
} from '../controllers/adminController';

const adminRouter = express.Router();

adminRouter.post('/create-trip', verifyToken, isAdmin, createTrip);
adminRouter.get('/users', verifyToken, isAdmin, getAllUsers);

adminRouter.get('/bookings/trip', verifyToken, isAdmin, getTripBookings);
adminRouter.get('/bookings/user', verifyToken, isAdmin, getUserBookings);
adminRouter.get('/bookings', verifyToken, isAdmin, getAllBookings);

export default adminRouter;
