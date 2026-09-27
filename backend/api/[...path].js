import app from '../src/app/app.js';
import { dbConnect } from '../src/config/db.config.js';

let connectionPromise;

export default async function handler(req, res) {
  try {
    if (!connectionPromise) {
      connectionPromise = dbConnect().catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
    }

    await connectionPromise;
    return app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(503).json({ message: 'Database connection failed.' });
  }
}
