import { Request, Response } from 'express';
import Stripe from 'stripe';
import BookingModel, { BookingType } from '../models/BookingModel';
import transporter from '../config/nodemailer';
import { UserType } from '../models/UserModel';
import { TripDocument } from '../models/TripModel';
import { sendSuccessfulBookingEmail } from '../middlewares/email';
import mongoose from 'mongoose';

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

    await sendSuccessfulBookingEmail(booking);
  } else {
    console.log('Unhandled event type', event.type);
  }
  res.json({ received: true });
};
