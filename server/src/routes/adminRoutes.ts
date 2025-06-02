import express from 'express';
import verifyToken from '../middlewares/auth';
import { createTrip } from '../controllers/adminController';

const adminRouter = express.Router();

adminRouter.post('/create-trip', verifyToken, createTrip);

export default adminRouter;
