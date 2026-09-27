import cookieParser from 'cookie-parser';
import express from 'express';
import authRouter from '../router/auth.route.js';
import productRouter from '../router/product.route.js';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Authorization, Content-Type'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);

export default app;
