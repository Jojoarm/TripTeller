import express from 'express';
import verifyToken, { isAdmin } from '../middlewares/auth';
import {
  adminDashboardData,
  changeUserRole,
  createTrip,
  deleteUser,
  getAllBookings,
  getAllTrips,
  getAllUsers,
  getBookingsByTravelStyle,
  getDailyVisitorStats,
  getTripBookings,
  getUserBookings,
} from '../controllers/adminController';

const adminRouter = express.Router();

adminRouter.post('/create-trip', verifyToken, isAdmin, createTrip);
adminRouter.put('/edit-role', verifyToken, isAdmin, changeUserRole);
adminRouter.get('/users', verifyToken, isAdmin, getAllUsers);
adminRouter.get('/trips', verifyToken, isAdmin, getAllTrips);
adminRouter.get('/dashboard-data', verifyToken, isAdmin, adminDashboardData);
adminRouter.post('/visitors-stats', verifyToken, isAdmin, getDailyVisitorStats);
adminRouter.get(
  '/travel-style',
  verifyToken,
  isAdmin,
  getBookingsByTravelStyle
);
adminRouter.delete('/users/:id', verifyToken, isAdmin, deleteUser);

adminRouter.get('/bookings/trip', verifyToken, isAdmin, getTripBookings);
adminRouter.get('/bookings/user', verifyToken, isAdmin, getUserBookings);
adminRouter.get('/bookings', verifyToken, isAdmin, getAllBookings);

export default adminRouter;
