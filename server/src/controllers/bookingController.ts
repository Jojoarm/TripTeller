import { Request, Response } from 'express';
import TripModel, { TripDocument } from '../models/TripModel';
import BookingModel, { BookingType } from '../models/BookingModel';
import Stripe from 'stripe';

export const createBooking = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;
    const { guests, tripId, paymentMethod } = req.body;
    const trip: TripDocument | null = await TripModel.findById(tripId);

    if (!trip) {
      return res.json({ success: false, message: 'Trip not available' });
    }

    const totalPrice = trip.estimatedPrice * guests;

    let bookingId;
    let booking;

    const existingBooking = await BookingModel.findOne({
      user: userId,
      trip: tripId,
    });

    if (existingBooking) {
      if (existingBooking.isPaid) {
        return res.status(400).json({
          success: false,
          message: 'You have already paid for this trip.',
        });
      }

      existingBooking.guests = guests;
      existingBooking.paymentMethod = paymentMethod;
      existingBooking.totalPrice = totalPrice;
      await existingBooking.save();

      booking = existingBooking;
      bookingId = existingBooking._id;
    } else {
      booking = await BookingModel.create({
        user: userId,
        trip: tripId,
        paymentMethod,
        guests,
        totalPrice,
      });
      bookingId = booking._id;
    }

    //Stripe payment
    const origin = req.headers.origin || 'http://localhost:3000';
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: trip.title,
            description: trip.description,
            images: [trip.imageUrls[0]],
          },
          unit_amount: trip.estimatedPrice * 100,
        },
        quantity: guests,
      },
    ];

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-05-28.basil',
    });

    //create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/booking/success?bookingId=${bookingId}`,
      cancel_url: `${origin}/trips/${tripId}`,
      metadata: {
        bookingId: bookingId.toString(),
        userId,
        tripId,
        guests: guests.toString(),
        paymentMethod,
        totalPrice: totalPrice.toString(),
      },
    });

    res.json({
      success: true,
      url: session.url,
      booking,
      message: 'Booking created successfully!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

export const getUserBookings = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    const total = await BookingModel.find({ user: userId }).countDocuments();
    const userBookings = await BookingModel.find({ user: userId })
      .populate('trip')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    if (!userBookings) {
      return res.json({ success: false, message: 'No booking for user found' });
    }

    res.json({
      success: true,
      userBookings,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch user bookings' });
  }
};

//To check if user has already booked trip
export const checkBooking = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;
    const { tripId } = req.params;
    const existingBooking = await BookingModel.findOne({
      user: userId,
      trip: tripId,
    });

    if (
      existingBooking &&
      existingBooking.isPaid === true &&
      existingBooking.status !== 'cancelled'
    ) {
      return res.json({
        success: false,
        message: 'Trip already booked by user',
      });
    }
    res.json({
      success: true,
      message: 'Trip available to book',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch user bookings' });
  }
};

//To check if user has already booked trip
export const verifyBooking = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { bookingId } = req.query;
    const booking = await BookingModel.findById(bookingId);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    return res.json({
      status: booking.status,
      paymentStatus: booking.isPaid,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch user booking' });
  }
};

// user cancel booking
export const cancelUserBooking = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { bookingId } = req.params;
    const booking = await BookingModel.findById(bookingId);

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });

    await BookingModel.findByIdAndUpdate(bookingId, {
      status: 'cancelled',
    });

    res.json({
      success: true,
      message: 'Booking Cancelled!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
};
