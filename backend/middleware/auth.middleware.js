import { readAccessToken } from '../src/utils/auth.utils.js';
import userRegisterModel from '../src/model/auth.model.js';

export const Authenicate = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return res.status(400).json({
      message: 'Access token not found in the request header.',
    });
  }

  let verifiedAccessToken;
  try {
    verifiedAccessToken = readAccessToken(accessToken);
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Access token expired. Please refresh the token.'
        : 'Invalid access token.';
    return res.status(401).json({ message });
  }

  const user = await userRegisterModel.findById(verifiedAccessToken.userId);
  if (!user?.refreshToken) {
    return res.status(401).json({ message: 'Session ended. Please log in again.' });
  }

  req.user = verifiedAccessToken;
  next();
};
