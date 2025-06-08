import mongoose from 'mongoose';
import transporter from '../config/nodemailer';
import { BookingType } from '../models/BookingModel';
import { UserType } from '../models/UserModel';

export interface PopulatedBookingType
  extends Omit<BookingType, 'user' | 'trip'> {
  _id: mongoose.Types.ObjectId;
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

export const sendSuccessfulBookingEmail = async (
  booking: PopulatedBookingType
) => {
  try {
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

    await transporter.sendMail(mailOptions);

    console.log('Successful booking email sent:');
  } catch (error) {
    console.log(error);
    throw new Error('Error sending welcome email');
  }
};

export const sendWelcomeEmail = async (user: UserType) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Welcome to TripTeller',
      html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to TripTeller</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #2563eb, #2563eb); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Welcome to TripTeller</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p>Hello ${user.username},</p>
                <p>Thank you for signing up! It's so great to have you onboard</p>   
                <div style="text-align: center; margin: 30px 0;">
                <p style="color: #2563eb">Feel free to utilize our AI generated trips to plan your next vacation idea</p>
                </div>
                <p>Best regards from us,<br>@The TripTeller Team</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:');
  } catch (error) {
    console.log(error);
    throw new Error('Error sending welcome email');
  }
};

export const sendOtpEmail = async (user: UserType, code: string) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset',
      html: `
           <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right,rgb(80, 126, 227), #2563eb); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Reset Your Password</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p>Hello, ${user.username}</p>
                <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
                <p>Your password reset token is:</p>
                <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb;">${code}</span>
                </div>
                <p>Enter this code on the verification page to complete your password reset.</p>
                <p>This code will expire in 5 minutes for security reasons.</p>
                <p>Best regards,<br>@TripTeller Team</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error('Error sending password reset email');
  }
};

export const sendPasswordResetSuccessful = async (user: UserType) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset Successful',
      html: `
          <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Successful</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #2563eb, #2563eb); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p>Hello ${user.username},</p>
                <p>We're writing to confirm that your password has been successfully reset.</p>
                <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #2563eb; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
                    ✓
                </div>
                </div>
                <p>If you did not initiate this password reset, please contact our support team immediately.</p>
                <p>For security reasons, we recommend that you:</p>
                <ul>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication if available</li>
                <li>Avoid using the same password across multiple sites</li>
                </ul>
                <p>Thank you for helping us keep your account secure.</p>
                <p>Best regards,<br>@TripTeller Team</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error('Error sending password reset success email');
  }
};
