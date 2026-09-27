import express from 'express';
import { upload } from '../config/multer.config.js';
import {
  createProduct,
  deleteProduct,
  getAllProduct,
} from '../controller/product.controller.js';
import { Authenticate } from '../middleware/auth.middleware.js';
import {
  paramVelidator,
  productValidator,
} from '../validator/product.validator.js';
const router = express.Router();

const parsePrice = (req, res, next) => {
  try {
    if (req.body?.price && typeof req.body.price === 'string') {
      req.body.price = JSON.parse(req.body.price);
    }
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid price format.',
      error: error.message,
    });
  }
};

router.post(
  '/create',
  Authenticate,
  upload.fields([{ name: 'files', maxCount: 5 }]),
  parsePrice,
  productValidator,
  createProduct
);
router.post('/delete/:id', Authenticate, paramVelidator, deleteProduct);
router.get('/', getAllProduct);

export default router;
