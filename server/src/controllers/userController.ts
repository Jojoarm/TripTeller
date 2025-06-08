import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import {
  sendOtpEmail,
  sendPasswordResetSuccessful,
  sendWelcomeEmail,
} from '../middlewares/email';
import {
  deleteOtp,
  generateOtp,
  saveOtp,
  validateOtp,
} from '../middlewares/otp';

interface GooglePayload {
  email: string;
  name: string;
  sub: string;
  picture: string;
}

export const signUp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: 'User Already Exist!' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    await sendWelcomeEmail(newUser);

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.status },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000,
    });

    res
      .status(201)
      .json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error creating user' });
  }
};

export const signIn = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.status },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000,
    });

    res
      .status(201)
      .json({ success: true, message: 'Login Successful', userId: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error with user login!' });
  }
};

// SignIn/SignUp using google
export const googleAuth = async (req: Request, res: Response): Promise<any> => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { tokenId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid token payload' });
    }

    const { email, name, sub, picture } = payload as GooglePayload;

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        email,
        username: name,
        googleId: sub,
        image: picture,
      });

      await sendWelcomeEmail(user);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.status },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: 'Error with google authentication!' });
  }
};

//user logout
export const userLogout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      expires: new Date(0),
    });
    res.status(200).send({ message: 'Logged out successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error logging out user' });
  }
};

//fetch User
export const fetchUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(201).json({ success: true, userData: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error getting user!' });
  }
};

// Store User Recent SearchedCities
export const storeRecentSearchedDestinations = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { destination } = req.body;

    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user?.recentSearchedDestinations.length < 3) {
      user?.recentSearchedDestinations.push(destination);
    } else {
      user?.recentSearchedDestinations.shift();
      user?.recentSearchedDestinations.push(destination);
    }
    await user.save();
    res.json({ success: true, message: 'City added' });
  } catch (error) {
    res.json({ success: false, message: (error as Error).message });
  }
};

export const sendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'Email not registered' });

    const otp = generateOtp();
    await saveOtp(email, otp);
    await sendOtpEmail(user, otp);

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: 'Error with password reset!' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, code } = req.body;
    const isValid = await validateOtp(email, code);

    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired OTP' });
    }

    await deleteOtp(email); // Cleanup after verification

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Error verifying otp!' });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;

    await user.save();

    await sendPasswordResetSuccessful(user);

    res
      .status(200)
      .json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: 'Error resetting password!' });
  }
};
