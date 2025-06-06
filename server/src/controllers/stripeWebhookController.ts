import { Request, Response } from 'express';
import Stripe from 'stripe';
import BookingModel, { BookingType } from '../models/BookingModel';
import transporter from '../config/nodemailer';
import { UserType } from '../models/UserModel';
import { TripDocument } from '../models/TripModel';

interface PopulatedBookingType extends Omit<BookingType, 'user' | 'trip'> {
  user: {
    email: string;
    username: string;
  };
  trip: {
    title: string;
    country: string;
    location: {
      city: string;
    };
  };
}

//Api to handle stripe webhooks
export const stripeWebhooks = async (
  req: Request,
  res: Response
): Promise<any> => {
  // stripe gateway initialize
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-05-28.basil',
  });
  const sig = req.headers['stripe-signature'] as string | undefined;
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).send('Missing Stripe signature or webhook secret');
  }

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${(error as Error).message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      return res.status(400).send('Booking ID not found in metadata');
    }

    const booking = await BookingModel.findByIdAndUpdate(bookingId, {
      isPaid: true,
      status: 'confirmed',
    })
      .populate<{ user: UserType }>('user')
      .populate<{ trip: TripDocument }>('trip');

    if (!booking) {
      return res.status(400).send('Booking not found');
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: booking.user.email,
      subject: 'Trip Booking Details',
      html: `
            <h2>Your Booking Details</h2>
            <p>Dear ${booking.user.username},</p>
            <p>Thank you for your booking! Here are your booking details:</p>
            <ul>
                <li><strong>Booking ID:</strong> ${booking._id}</li>
                <li><strong>Trip Title:</strong> ${booking.trip.title}</li>
                <li><strong>Location:</strong> ${booking.trip.country}, ${
        booking.trip.location.city
      }</li>
                <li><strong>Date: </strong> ${booking.bookingDate.toString()}</li>
                <li><strong>Persons: </strong> ${booking.guests}</li>
                <li><strong>Total Amount:</strong> ${
                  process.env.CURRENCY || '$'
                } ${booking.totalPrice} /trip</li>
            </ul>
            <p>We look forward to welcoming you!</p>
            <p>If you need to make any changes, feel free to contact us.</p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent:', info);
  } else {
    console.log('Unhandled event type', event.type);
  }
  res.json({ received: true });
};
