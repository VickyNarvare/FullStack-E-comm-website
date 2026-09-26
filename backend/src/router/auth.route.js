import express from 'express';
import {
  getProfile,
  login,
  logout,
  refresh,
  register,
} from '../controller/auth.controller.js';
import { Authenticate } from '../middleware/auth.middleware.js';
import {
  loginValidetor,
  registerValidetor,
} from '../validator/auth.validator.js';
const router = express.Router();
router.post('/register', registerValidetor, register);
router.post('/login', loginValidetor, login);
router.post('/refresh', refresh);
router.get('/me', Authenticate, getProfile);
router.post('/logout', Authenticate, logout);
export default router;
