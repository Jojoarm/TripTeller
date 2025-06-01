import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

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

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SignIn/SignUp using google
export const googleAuth = async (req: Request, res: Response): Promise<any> => {
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
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
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
