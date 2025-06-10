import express from 'express';
import verifyToken, { isAdmin } from '../middlewares/auth';
import {
  changeUserRole,
  createTrip,
  deleteUser,
  getAllBookings,
  getAllTrips,
  getAllUsers,
  getTripBookings,
  getUserBookings,
} from '../controllers/adminController';

const adminRouter = express.Router();

adminRouter.post('/create-trip', verifyToken, isAdmin, createTrip);
adminRouter.put('/edit-role', verifyToken, isAdmin, changeUserRole);
adminRouter.get('/users', verifyToken, isAdmin, getAllUsers);
adminRouter.get('/trips', verifyToken, isAdmin, getAllTrips);
adminRouter.delete('/users/:id', verifyToken, isAdmin, deleteUser);

adminRouter.get('/bookings/trip', verifyToken, isAdmin, getTripBookings);
adminRouter.get('/bookings/user', verifyToken, isAdmin, getUserBookings);
adminRouter.get('/bookings', verifyToken, isAdmin, getAllBookings);

export default adminRouter;
