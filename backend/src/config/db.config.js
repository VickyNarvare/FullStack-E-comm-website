import mongoose from 'mongoose';
import { env } from './env.config.js';
export const dbConnect = () => {
  return mongoose.connect(env.mongoUri);
};
