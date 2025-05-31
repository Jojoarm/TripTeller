import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConfig';
import userRouter from './routes/userRoutes';

const port = process.env.PORT || 3000;

connectDB();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Api working');
});

app.use('/api/users', userRouter);

app.listen(port, () => {
  console.log('Server running on localhost:', port);
});
