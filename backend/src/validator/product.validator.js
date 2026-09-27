import { body, param, validationResult } from 'express-validator';
export const productValidator = [
  body('title')
    .trim()
    .exists()
    .withMessage('title is required. ')
    .bail()
    .isLength({ min: 20, max: 100 })
    .withMessage('title must be between 20 and 100 characters.'),
  body('description')
    .trim()
    .exists()
    .withMessage('description is required. ')
    .bail()
    .isLength({ min: 50, max: 500 })
    .withMessage('description must be between 50 and 500 characters.'),
  body('category')
    .trim()
    .exists()
    .withMessage('category is required. ')
    .bail()
    .isString()
    .withMessage('category is must be String.'),
  body('stock')
    .trim()
    .exists()
    .withMessage('stock is required. ')
    .bail()
    .isInt({ min: 0 })
    .withMessage('stock is must be Number.'),
  body('price.amount')
    .trim()
    .exists()
    .withMessage('amount is required.')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('amount must be a number or floating Number '),
  body('price.currency')
    .trim()
    .exists()
    .withMessage('Currency is required')
    .bail()
    .isString()
    .withMessage('Currency must be a string value')
    .isIn(['INR', 'USD'])
    .withMessage('Currency either be INR or USD'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Invalid request.',
        errors: errors.array(),
      });
    }
    next();
  },
];

export const paramVelidator = [
  param('id')
    .exists()
    .withMessage('id is required.')
    .bail()
    .isMongoId()
    .withMessage('id must be a mongo id')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Invalid request',
        errors: errors.array(),
      });
    }
    next();
  },
];
