import bcrypt from 'bcryptjs';
import userRegisterModel from '../model/auth.model.js';
import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from '../utils/auth.utils.js';

export const register = async (req, res) => {
  const { userName, email, password } = req.body;
  const isUserAlreadyExist = await userRegisterModel.findOne({ email });
  if (isUserAlreadyExist) {
    res.status(400).json({
      message: 'User already exist with this email address.',
      errors: {
        path: email,
        message: 'User already exist with this email address.',
      },
    });
  }

  //user created in db
  const user = await userRegisterModel.create({
    userName,
    email,
    hashPassword: await bcrypt.hash(password, 10),
  });
  const userId = user.id;

  const refreshToken = createRefreshToken(userId);
  const accessToken = createAccessToken(userId);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
  });

  await userRegisterModel.findByIdAndUpdate(user._id, {
    refreshToken,
  });

  res.status(201).json({
    message: 'user register Successfully',
    data: {
      userId: user._id,
      userName: user.UserName,
      email: user.email,
    },
    accessToken,
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userRegisterModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: 'invalid email and password',
    });
  }
  const isValidPassword = await bcrypt.compare(password, user.hashPassword);

  if (!isValidPassword) {
    return res.status(401).json({
      message: 'invalid email and password',
    });
  }
  const userId = user._id;
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  await userRegisterModel.findOneAndUpdate(
    {
      email,
    },
    {
      refreshToken,
    }
  );
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
  });

  res.status(200).json({
    massage: 'user loginIn Successfully.',
    data: {
      user: {
        userName: user.userName,
        email: user.email,
      },
      accessToken,
    },
  });
};
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh Token is required.' });
  }
  try {
    const varifyRefreshToken = readRefreshToken(refreshToken);
    const { userId } = varifyRefreshToken;
    const user = await userRegisterModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    if (refreshToken != user.refreshToken) {
      await userRegisterModel.findByIdAndUpdate(user._id, {
        refreshToken: null,
      });
      return res.status(401).json({
        message: 'refresh token mismatch',
      });
    }
    const accessToken = createAccessToken(user._id);
    const newRefreshToken = createRefreshToken(user._id);
    await userRegisterModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
    });
    res.status(200).json({
      message: 'refresh token rotated Successfully',
      data: {
        user: {
          userName: user.userName,
          email: user.email,
        },
        accessToken,
      },
    });
  } catch (error) {
    res.status(401).json({ message: 'Invaild refersh token' });
  }
};
export const getProfile = async (req, res) => {
  const { userId } = req.user;
  const user = await userRegisterModel.findById(userId);
  res.status(200).json({
    message: 'user data fatched Successfully.',
    data: {
      user: {
        userName: user?.userName,
        email: user?.email,
        userId: user?._id,
      },
    },
  });
};
export const logout = async (req, res) => {
  const { userId } = req.user;
  await userRegisterModel.findByIdAndUpdate(userId, {
    refreshToken: null,
  });
  res.clearCookie('refreshToken');
  res.status(200).json({
    message: 'User logged out successfully.',
  });
};
