import { Request, Response } from 'express';
import TripModel from '../models/TripModel';

//fetch Trips
export const fetchTrips = async (req: Request, res: Response): Promise<any> => {
  try {
    const trips = await TripModel.find();
    if (!trips) {
      return res.status(400).json({ message: 'Trips not found' });
    }

    res.status(201).json({ success: true, tripData: trips });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error getting trips!' });
  }
};

//fetch single trip
export const getTrip = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const trip = await TripModel.findById(id);
    if (!trip) {
      return res.status(400).json({ message: 'Trip not found' });
    }

    res.status(201).json({ success: true, tripData: trip });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error getting trip!' });
  }
};
