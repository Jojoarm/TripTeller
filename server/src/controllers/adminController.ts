import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { GoogleGenAI } from '@google/genai';
import { parseMarkdownToJson } from '../lib/utils';
import TripModel, { TripDocument } from '../models/TripModel';
import BookingModel from '../models/BookingModel';
import mongoose from 'mongoose';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

//change user role
export const changeUserRole = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { status, id } = req.body;

    if (!['admin', 'user'].includes(status)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(id, { status });

    if (!updatedUser || updatedUser.isDeleted) {
      return res
        .status(500)
        .json({ success: false, message: 'User not found' });
    }
    res
      .status(200)
      .json({ success: true, updatedUser, message: 'User Role Updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update role' });
  }
};

//create trip
export const createTrip = async (req: Request, res: Response): Promise<any> => {
  try {
    const { country, duration, travelStyle, interests, budget, groupType } =
      req.body;
    const userId = req.userId;

    const prompt = `
You are an AI travel assistant. Based on the user preferences below, generate a travel itinerary in raw JSON (no markdown, no comments, no formatting, just pure JSON).

### User Preferences
- Country: ${country}
- Duration (in days): ${duration}
- Travel Style: ${travelStyle}
- Interests: ${interests}
- Budget: ${budget}
- Group Type: ${groupType}

### Output Format
Respond with a **pure JSON** object matching the following format exactly. DO NOT include explanations or markdown:

{
  "title": "Trip title",
  "description": "Brief summary of trip highlights (max 100 words)",
  "estimatedPrice": "1234",
  "duration": ${duration},
  "budget": "${budget}",
  "travelStyle": "${travelStyle}",
  "country": "${country}",
  "interests": "${interests}",
  "groupType": "${groupType}",
  "bestTimeToVisit": [
    "🌸 Spring (Mar–May): Beautiful blossoms and mild temperatures",
    "☀️ Summer (Jun–Aug): Best for beaches and festivals",
    "🍁 Autumn (Sep–Nov): Scenic foliage and fewer crowds",
    "❄️ Winter (Dec–Feb): Snowy adventures and cozy vibes"
  ],
  "weatherInfo": [
    "☀️ Summer: 25–35°C (77–95°F)",
    "🌦️ Autumn: 15–25°C (59–77°F)",
    "🌧️ Spring: 10–20°C (50–68°F)",
    "❄️ Winter: 0–10°C (32–50°F)"
  ],
  "location": {
    "city": "City or region",
    "coordinates": [latitude, longitude],
    "openStreetMap": "https://openstreetmap.org/..."
  },
  "itinerary": [
    {
      "day": 1,
      "location": "City Name",
      "activities": [
        { "time": "Morning", "description": "🏰 Visit historic site" },
        { "time": "Afternoon", "description": "🖼️ Explore art museum" },
        { "time": "Evening", "description": "🍷 Enjoy rooftop dinner" }
      ]
    }
    // Repeat for each day up to ${duration}
  ]
}
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    if (!response) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate trip from gemini',
      });
    }

    const tripResult = parseMarkdownToJson(response.text);

    if (!tripResult) {
      return res
        .status(500)
        .json({ success: false, message: 'Failed to parse trip' });
    }

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&&client_id=${unsplashApiKey}`
    );

    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null);

    const trip = new TripModel({
      userId,
      title: tripResult.title,
      description: tripResult.description,
      estimatedPrice: tripResult.estimatedPrice,
      duration: tripResult.duration,
      budget: tripResult.budget,
      travelStyle: tripResult.travelStyle,
      country: tripResult.country,
      interests: tripResult.interests,
      groupType: tripResult.groupType,
      bestTimeToVisit: tripResult.bestTimeToVisit,
      weatherInfo: tripResult.weatherInfo,
      location: tripResult.location,
      itinerary: tripResult.itinerary,
      imageUrls,
    });

    await trip.save();

    res.status(200).json({ success: true, message: 'Trip created' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to generate trip' });
  }
};

export const getTripBookings = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { tripId } = req.body;
    const tripBookings = await BookingModel.find({ trip: tripId })
      .populate('user')
      .sort({ createdAt: -1 });
    if (!tripBookings) {
      return res.json({
        success: false,
        message: 'No booking for selected trip',
      });
    }
    const totalBookings = tripBookings.length;
    const totalRevenue = tripBookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );
    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, tripBookings },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch trip bookings' });
  }
};

export const getUserBookings = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.body;
    const userBookings = await BookingModel.find({ user: userId })
      .populate('trip')
      .sort({ createdAt: -1 });
    if (!userBookings) {
      return res.json({
        success: false,
        message: 'No booking for selected user',
      });
    }
    const totalBookings = userBookings.length;
    const totalRevenue = userBookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );
    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, userBookings },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch user bookings' });
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const bookings = await BookingModel.find().sort({ createdAt: -1 });
    if (!bookings) {
      return res.json({
        success: false,
        message: 'No booking found',
      });
    }
    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .filter((booking) => booking.isPaid)
      .reduce((acc, booking) => acc + booking.totalPrice, 0);
    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const username = (req.query.username as string) || '';
    const sort = (req.query.sort as string) || '';

    //filters

    const filter: any = {};
    if (username) {
      filter.username = { $regex: req.query.username, $options: 'i' };
    }

    //sorting
    // let sortOption: any = {};
    // if (sort === 'Asc') {
    //   sortOption.username = 1;
    // } else if (sort === 'Dsc') {
    //   sortOption.username = -1;
    // } else if (sort === 'Latest') {
    //   sortOption.createdAt = -1;
    // } else if (sort === 'Most revenue') {
    //   sortOption.totalRevenue = 1;
    // }

    const users = await UserModel.find({ ...filter, isDeleted: false }).lean();

    if (!users) {
      return res.json({
        success: false,
        message: 'No user found',
      });
    }

    // const totalUsers = await UserModel.find().countDocuments();

    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const bookings = await BookingModel.find({ user: user._id })
          .populate('trip')
          .lean();
        const totalBookings = bookings.length;
        const totalRevenue = bookings
          .filter((booking) => booking.isPaid)
          .reduce((acc, booking) => acc + booking.totalPrice, 0);
        const cancelledBookings = bookings.filter(
          (booking) => booking.status === 'cancelled'
        ).length;
        const completedBookings = bookings.filter(
          (booking) => booking.status === 'confirmed'
        ).length;
        return {
          user: user,
          totalBookings,
          totalRevenue,
          cancelledBookings,
          completedBookings,
          bookings,
        };
      })
    );

    // Sorting logic
    let sortedUsers = [...usersWithBookings];

    if (sort === 'Most revenue') {
      sortedUsers.sort((a, b) => b.totalRevenue - a.totalRevenue);
    } else if (sort === 'Asc') {
      sortedUsers.sort((a, b) =>
        a.user.username.localeCompare(b.user.username)
      );
    } else if (sort === 'Dsc') {
      sortedUsers.sort((a, b) =>
        b.user.username.localeCompare(a.user.username)
      );
    } else if (sort === 'Latest') {
      sortedUsers.sort(
        (a, b) =>
          new Date(b.user.createdAt).getTime() -
          new Date(a.user.createdAt).getTime()
      );
    }

    const totalUsers = sortedUsers.length;

    const paginatedUsers = sortedUsers.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      data: paginatedUsers,
      pagination: {
        totalItems: totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getAllTrips = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const searchString = (req.query.searchString as string) || '';
    const sort = (req.query.sort as string) || '';

    //filters

    const filter: any = {};
    if (searchString) {
      filter.$or = [
        { country: { $regex: searchString, $options: 'i' } },
        { 'location.city': { $regex: searchString, $options: 'i' } },
        { title: { $regex: searchString, $options: 'i' } },
        { interests: { $regex: searchString, $options: 'i' } },
      ];
    }

    const trips = await TripModel.find(filter).lean();

    if (!trips) {
      return res.json({
        success: false,
        message: 'No trip found',
      });
    }

    const tripsWithBookings = await Promise.all(
      trips.map(async (trip) => {
        const bookings = await BookingModel.find({ trip: trip._id })
          .populate('user')
          .lean();
        const totalBookings = bookings.length;
        const totalRevenue = bookings
          .filter((booking) => booking.isPaid)
          .reduce((acc, booking) => acc + booking.totalPrice, 0);
        const cancelledBookings = bookings.filter(
          (booking) => booking.status === 'cancelled'
        ).length;
        const completedBookings = bookings.filter(
          (booking) => booking.status === 'confirmed'
        ).length;
        return {
          trip: trip,
          totalBookings,
          totalRevenue,
          cancelledBookings,
          completedBookings,
          bookings,
        };
      })
    );

    // Sorting logic
    let sortedTrips = [...tripsWithBookings];

    if (sort === 'Most revenue') {
      sortedTrips.sort((a, b) => b.totalRevenue - a.totalRevenue);
    } else if (sort === 'Price Low to High') {
      sortedTrips.sort((a, b) => a.trip.estimatedPrice - b.trip.estimatedPrice);
    } else if (sort === 'Price High to Low') {
      sortedTrips.sort((a, b) => b.trip.estimatedPrice - a.trip.estimatedPrice);
    } else if (sort === 'Latest') {
      sortedTrips.sort(
        (a, b) =>
          new Date(b.trip.createdAt).getTime() -
          new Date(a.trip.createdAt).getTime()
      );
    }

    const totalTrips = sortedTrips.length;

    const paginatedTrips = sortedTrips.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      data: paginatedTrips,
      pagination: {
        totalItems: totalTrips,
        currentPage: page,
        totalPages: Math.ceil(totalTrips / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

//delete user
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user ID' });
    }

    const user = await UserModel.findOne({ _id: id, isDeleted: false });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found or already deleted' });
    }

    user.isDeleted = true;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
