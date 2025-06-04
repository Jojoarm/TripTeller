import { Request, Response } from 'express';
import TripModel from '../models/TripModel';

//fetch Trips
export const fetchTrips = async (req: Request, res: Response): Promise<any> => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const interests = (req.query.interests as string)?.split(',') || [];
    const priceRange = (req.query.priceRange as string)?.split(',') || [];
    const sort = (req.query.sort as string) || '';
    const destination = (req.query.destination as string) || '';

    //filters
    const filter: any = {};

    if (interests.length > 0 && interests[0] !== '') {
      filter.interests = {
        $in: interests.map((interest) => new RegExp(interest, 'i')),
      };
    }

    if (priceRange.length > 0 && priceRange[0] !== '') {
      filter.budget = {
        $in: priceRange.map((b) => new RegExp(b, 'i')),
      };
    }
    if (destination) {
      filter.$or = [
        { country: { $regex: destination, $options: 'i' } },
        { 'location.city': { $regex: destination, $options: 'i' } },
      ];
    }

    //sorting
    let sortOption: any = {};
    if (sort === 'Price Low to High') {
      sortOption.estimatedPrice = 1;
    } else if (sort === 'Price High to Low') {
      sortOption.estimatedPrice = -1;
    } else if (sort === 'Newest First') {
      sortOption.createdAt = -1;
    }

    const total = await TripModel.countDocuments(filter);

    const trips = await TripModel.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);
    if (!trips) {
      return res.status(400).json({ message: 'Trips not found' });
    }

    res.status(201).json({
      success: true,
      tripData: trips,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.log('Error fetching trips', error);
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
