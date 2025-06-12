import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { GoogleGenAI } from '@google/genai';
import { getDateRanges, parseMarkdownToJson } from '../lib/utils';
import TripModel, { TripDocument } from '../models/TripModel';
import BookingModel, { BookingType } from '../models/BookingModel';
import mongoose from 'mongoose';
import { VisitorModel, VisitorType } from '../models/VisitorModel';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

type DateRange = {
  start: Date;
  end: Date;
};

//dashboard data
export const adminDashboardData = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { today, yesterday, thisWeek, lastWeek, thisMonth, lastMonth } =
      getDateRanges();

    const users = await UserModel.find().lean();
    const trips = await TripModel.find().lean();
    const bookings = await BookingModel.find({ isPaid: true }).lean();

    //revenue calculation
    const calculateRevenue = (
      bookings: BookingType[],
      range: DateRange
    ): number => {
      return bookings
        .filter(
          (b) =>
            b.isPaid &&
            new Date(b.createdAt) >= range.start &&
            new Date(b.createdAt) <= range.end
        )
        .reduce((acc, b) => acc + b.totalPrice, 0);
    };

    // Total Revenue
    const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

    // Revenue Comparisons
    const revenueToday = calculateRevenue(bookings, today);
    const revenueYesterday = calculateRevenue(bookings, yesterday);

    const revenueThisWeek = calculateRevenue(bookings, thisWeek);
    const revenueLastWeek = calculateRevenue(bookings, lastWeek);

    const revenueThisMonth = calculateRevenue(bookings, thisMonth);
    const revenueLastMonth = calculateRevenue(bookings, lastMonth);

    const totalUsers = await UserModel.find().countDocuments();
    const totalTrips = await TripModel.find().countDocuments();
    const totalBookings = await BookingModel.find().countDocuments();

    //today v yesterday stats
    const [
      todayUsers,
      yesterdayUsers,
      todayTrips,
      yesterdayTrips,
      todayBookings,
      yesterdayBookings,
      todayVisitors,
      yesterdayVisitors,
      todayUnique,
      yesterdayUnique,
    ] = await Promise.all([
      UserModel.countDocuments({
        createdAt: { $gte: today.start, $lte: today.end },
      }),
      UserModel.countDocuments({
        createdAt: { $gte: yesterday.start, $lte: yesterday.end },
      }),
      TripModel.countDocuments({
        createdAt: { $gte: today.start, $lte: today.end },
      }),
      TripModel.countDocuments({
        createdAt: { $gte: yesterday.start, $lte: yesterday.end },
      }),
      BookingModel.countDocuments({
        createdAt: { $gte: today.start, $lte: today.end },
      }),
      BookingModel.countDocuments({
        createdAt: { $gte: yesterday.start, $lte: yesterday.end },
      }),
      VisitorModel.countDocuments({
        visitedAt: { $gte: today.start, $lte: today.end },
      }),
      VisitorModel.countDocuments({
        visitedAt: { $gte: yesterday.start, $lte: yesterday.end },
      }),
      VisitorModel.distinct('ip', {
        visitedAt: { $gte: today.start, $lte: today.end },
      }).then((ips) => ips.length),
      VisitorModel.distinct('ip', {
        visitedAt: { $gte: yesterday.start, $lte: yesterday.end },
      }).then((ips) => ips.length),
    ]);

    //this week v last week stats
    const [
      thisWeekUsers,
      lastWeekUsers,
      thisWeekTrips,
      lastWeekTrips,
      thisWeekBookings,
      lastWeekBookings,
      thisWeekVisitors,
      lastWeekVisitors,
      thisWeekUnique,
      lastWeekUnique,
    ] = await Promise.all([
      UserModel.countDocuments({
        createdAt: { $gte: thisWeek.start, $lte: thisWeek.end },
      }),
      UserModel.countDocuments({
        createdAt: { $gte: lastWeek.start, $lte: lastWeek.end },
      }),
      TripModel.countDocuments({
        createdAt: { $gte: thisWeek.start, $lte: thisWeek.end },
      }),
      TripModel.countDocuments({
        createdAt: { $gte: lastWeek.start, $lte: lastWeek.end },
      }),
      BookingModel.countDocuments({
        createdAt: { $gte: lastWeek.start, $lte: lastWeek.end },
      }),
      BookingModel.countDocuments({
        createdAt: { $gte: lastWeek.start, $lte: lastWeek.end },
      }),
      VisitorModel.countDocuments({
        visitedAt: { $gte: thisWeek.start, $lte: thisWeek.end },
      }),
      VisitorModel.countDocuments({
        visitedAt: { $gte: lastWeek.start, $lte: lastWeek.end },
      }),
      VisitorModel.distinct('ip', {
        visitedAt: { $gte: thisWeek.start, $lte: thisWeek.end },
      }).then((ips) => ips.length),
      VisitorModel.distinct('ip', {
        visitedAt: { $gte: lastWeek.start, $lte: lastWeek.end },
      }).then((ips) => ips.length),
    ]);

    //this month v last mont stats
    const [
      thisMonthUsers,
      lastMonthUsers,
      thisMonthTrips,
      lastMonthTrips,
      thisMonthBookings,
      lastMonthBookings,
      thisMonthVisitors,
      lastMonthVisitors,
      thisMonthUnique,
      lastMonthUnique,
    ] = await Promise.all([
      UserModel.countDocuments({
        createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      }),
      UserModel.countDocuments({
        createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      }),
      TripModel.countDocuments({
        createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      }),
      TripModel.countDocuments({
        createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      }),
      BookingModel.countDocuments({
        createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      }),
      BookingModel.countDocuments({
        createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      }),
      VisitorModel.countDocuments({
        visitedAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      }),
      VisitorModel.countDocuments({
        visitedAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      }),
      VisitorModel.distinct('ip', {
        visitedAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      }).then((ips) => ips.length),
      VisitorModel.distinct('ip', {
        visitedAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      }).then((ips) => ips.length),
    ]);

    return res.status(200).json({
      success: true,
      dashboardData: {
        users: {
          today: todayUsers,
          yesterday: yesterdayUsers,
          thisWeek: thisWeekUsers,
          lastWeek: lastWeekUsers,
          thisMonth: thisMonthUsers,
          lastMonth: lastMonthUsers,
          total: totalUsers,
        },
        trips: {
          today: todayTrips,
          yesterday: yesterdayTrips,
          thisWeek: thisWeekTrips,
          lastWeek: lastWeekTrips,
          thisMonth: thisMonthTrips,
          lastMonth: lastMonthTrips,
          total: totalTrips,
        },
        bookings: {
          today: todayBookings,
          yesterday: yesterdayBookings,
          thisWeek: thisWeekBookings,
          lastWeek: lastWeekBookings,
          thisMonth: thisMonthBookings,
          lastMonth: lastMonthBookings,
          total: totalBookings,
        },
        revenue: {
          total: totalRevenue,
          today: revenueToday,
          yesterday: revenueYesterday,
          thisWeek: revenueThisWeek,
          lastWeek: revenueLastWeek,
          thisMonth: revenueThisMonth,
          lastMonth: revenueLastMonth,
        },
        visitors: {
          today: {
            total: todayVisitors,
            unique: todayUnique,
          },
          yesterday: {
            total: yesterdayVisitors,
            unique: yesterdayUnique,
          },
          thisWeek: {
            total: thisWeekVisitors,
            unique: thisWeekUnique,
          },
          lastWeek: {
            total: lastWeekVisitors,
            unique: lastWeekUnique,
          },
          thisMonth: {
            total: thisMonthVisitors,
            unique: thisMonthUnique,
          },
          lastMonth: {
            total: lastMonthVisitors,
            unique: lastMonthUnique,
          },
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get dashboard data' });
  }
};

//get visitors stats
export const getDailyVisitorStats = async (req: Request, res: Response) => {
  try {
    const { days } = req.body;

    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
    startDate.setUTCHours(0, 0, 0, 0);

    // End today at 23:59:59.999 UTC
    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);

    const visitors = await VisitorModel.find({
      visitedAt: { $gte: startDate, $lte: endDate },
    }).lean();

    const getDateKey = (date: Date) =>
      date.toLocaleDateString('en-CA', { timeZone: 'UTC' }); // 'YYYY-MM-DD'

    const dailyStats: Record<string, { total: number; unique: Set<string> }> =
      {};

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setUTCDate(startDate.getUTCDate() + i);
      const dateKey = getDateKey(date);
      dailyStats[dateKey] = { total: 0, unique: new Set() };
    }

    visitors.forEach((visitor) => {
      const dateKey = getDateKey(new Date(visitor.visitedAt));
      const uniqueKey = visitor.userId?.toString() || visitor.ip || 'unknown';

      if (dailyStats[dateKey]) {
        dailyStats[dateKey].total += 1;
        dailyStats[dateKey].unique.add(uniqueKey);
      }
    });

    const result = Object.entries(dailyStats)
      .map(([date, { total, unique }]) => ({
        date,
        total,
        unique: unique.size,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.status(200).json({ success: true, data: result, visitors: visitors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load stats' });
  }
};

export const getBookingsByTravelStyle = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const bookings = await BookingModel.find()
      .populate('trip', 'interests budget')
      .exec();

    const interestCounts: Record<string, number> = {};
    const budgetCounts: Record<string, number> = {};

    bookings.forEach((booking) => {
      const trip = booking.trip as any;

      // for interests count
      const interests = trip?.interests;
      if (interests) {
        interestCounts[interests] = (interestCounts[interests] || 0) + 1;
      }

      // for budget count
      const budget = trip?.budget;
      if (budget) {
        budgetCounts[budget] = (budgetCounts[budget] || 0) + 1;
      }
    });

    const transformCounts = (obj: Record<string, number>) =>
      Object.entries(obj).map(([key, value]) => ({
        option: key,
        count: value,
      }));

    res.status(200).json({
      success: true,
      data: {
        interests: transformCounts(interestCounts),
        budgets: transformCounts(budgetCounts),
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to get bookings stats' });
  }
};

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

    const users = await UserModel.find({ ...filter, isDeleted: false }).lean();

    if (!users) {
      return res.json({
        success: false,
        message: 'No user found',
      });
    }

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
