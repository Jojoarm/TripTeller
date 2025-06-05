import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConfig';
import userRouter from './routes/userRoutes';
import adminRouter from './routes/adminRoutes';
import tripRouter from './routes/tripRoutes';
import bookingRouter from './routes/bookingRoutes';
import { stripeWebhooks } from './controllers/stripeWebhookController';

const port = process.env.PORT || 3000;

connectDB();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

//api to listen to stripe webhooks
app.post(
  '/api/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Api working');
});

app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/trips', tripRouter);
app.use('/api/bookings', bookingRouter);

app.listen(port, () => {
  console.log('Server running on localhost:', port);
});
