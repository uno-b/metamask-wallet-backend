import { Request, Response, NextFunction } from 'express';
const { ethers } = require('ethers');
import jwt from 'jsonwebtoken';

const User = require('../models/user');

exports.login = async (req: Request, res: Response) => {
  try {
    const { address, message, signature } = req.body;

    const existingUser = await User.findOne({ address });

    if (existingUser) {
      // User already exists
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET!,
        {
          expiresIn: '24h',
        }
      );

      res.json({ user: existingUser, token });
    } else {
      // New User
      const signedAddress = ethers.verifyMessage(message, signature);

      if (signedAddress !== address) {
        res.status(401).json({ error: 'Wrong signature' });
      }

      const newUser = new User({ address });
      await newUser.save();
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      res.json({ user: newUser, token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

exports.getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export interface IGetUserAuthInfoRequest extends Request {
  user: string;
}

exports.verifyToken = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
      console.log(err);

      if (err) return res.sendStatus(403);

      req.user = user;

      next();
    });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
