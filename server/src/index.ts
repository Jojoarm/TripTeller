import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/dbConfig';

const port = process.env.PORT || 3000;

connectDB();

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Api working');
});

app.listen(port, () => {
  console.log('Server running on localhost:', port);
});
