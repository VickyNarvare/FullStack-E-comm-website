import express from 'express';
import { Authenicate } from '../../middleware/auth.middleware.js';
import {
  getProfile,
  login,
  logout,
  refresh,
  register,
} from '../controller/auth.controller.js';
import {
  loginValidetor,
  registerValidetor,
} from '../validator/auth.validator.js';
const router = express.Router();
router.post('/register', registerValidetor, register);
router.post('/login', loginValidetor, login);
router.post('/refresh', refresh);
router.get('/me', Authenicate, getProfile);
router.post('/logout', Authenicate, logout);
export default router;
