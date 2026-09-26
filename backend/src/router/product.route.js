import express from 'express';
import { upload } from '../config/multer.config.js';
import { createProduct } from '../controller/product.controller.js';
import { productValidator } from '../validator/product.validator.js';
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
  upload.fields([
    { name: 'productFiles', maxCount: 5 },
    { name: 'images', maxCount: 5 },
    { name: 'files', maxCount: 5 },
  ]),
  parsePrice,
  productValidator,
  createProduct
);

export default router;
