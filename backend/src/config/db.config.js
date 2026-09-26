import mongoose from 'mongoose';
import { env } from './env.config.js';
export const dbConnect = () => {
  mongoose.connect(env.mongoUri);
  console.log('DB connected sucessfully');
};
