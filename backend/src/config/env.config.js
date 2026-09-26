import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  imagekitEndPoint:
    process.env.IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_END_POINT,
  imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,
};
