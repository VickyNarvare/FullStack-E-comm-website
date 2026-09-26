import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';

export const createAccessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, env.accessTokenSecret, {
    expiresIn: '15Min',
  });
  return accessToken;
};
export const readAccessToken = (accessToken) => {
  console.log(jwt.verify(accessToken, env.accessTokenSecret));
  return jwt.verify(accessToken, env.accessTokenSecret);
};
export const createRefreshToken = (userId) => {
  const refreshToke = jwt.sign({ userId }, env.refreshTokenSecret, {
    expiresIn: '7Days',
  });
  return refreshToke;
};
export const readRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, env.refreshTokenSecret);
};
