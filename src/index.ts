import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const userRouter = require('./routes/user');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/v1/users', userRouter);

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
