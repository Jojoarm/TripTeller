import express from 'express';
import verifyToken from '../middlewares/auth';
import { fetchTrips, getTrip } from '../controllers/tripController';

const tripRouter = express.Router();

tripRouter.get('/trips', fetchTrips);
tripRouter.get('/trips/:id', getTrip);

export default tripRouter;
