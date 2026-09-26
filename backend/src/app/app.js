import cookieParser from 'cookie-parser';
import express from 'express';
import authRouter from '../router/auth.route.js';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);

export default app;
