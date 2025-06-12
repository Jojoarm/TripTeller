import { NextFunction, Request, Response } from 'express';
import { VisitorModel } from '../models/VisitorModel';

export const trackVisitor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userId = req.userId;
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    await VisitorModel.create({ ip, userId: userId, userAgent });
  } catch (error) {
    console.error('Failed to track visitor:', error);
  }

  next();
};
