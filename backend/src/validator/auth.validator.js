import { body, validationResult } from 'express-validator';
export const registerValidetor = [
  body('userName')
    .exists()
    .withMessage('Name is Required.')
    .bail()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters.')
    .isString()
    .withMessage('Name must be a String'),
  body('email')
    .exists()
    .withMessage('Email is Required.')
    .bail()
    .isEmail()
    .withMessage('Please enter valid email address')
    .isString()
    .withMessage('Email must be a String'),
  body('password')
    .exists()
    .withMessage('Password is Required.')
    .bail()
    .trim()
    .isLength({ min: 6, max: 10 })
    .withMessage('Password length must be between 6 to 10 characters')
    .isString()
    .withMessage('Password must be a String'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Invaild Request',
        errors: errors.array(),
      });
    }
    next();
  },
];

export const loginValidetor = [
  body('email')
    .exists()
    .withMessage('email is Required.')
    .bail()
    .isEmail()
    .withMessage('Please enter vaild Email address.')
    .isString()
    .withMessage('Email must be a String'),
  body('password')
    .exists()
    .withMessage('password is Required.')
    .bail()
    .trim()
    .isLength({ min: 6, max: 10 })
    .withMessage('Password length must be between 6 to 10 characters')
    .isString()
    .withMessage('Password must be a String'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Invaild User',
        errors: errors.array(),
      });
    }
    next();
  },
];
