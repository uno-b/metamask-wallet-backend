import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

const userRouter = require('./routes/user');
const userController = require('./controllers/user');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/api/v1/login', userController.login);
app.use('/api/v1/users', userRouter);

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
