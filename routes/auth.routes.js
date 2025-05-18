// routes/auth.routes.js - Authentication routes

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');

// Register validation
const registerValidation = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Please include a valid email'),
  check('phone').notEmpty().withMessage('Phone number is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  check('role')
    .isIn(['buyer', 'seller'])
    .withMessage('Role must be either buyer or seller')
];

// Login validation
const loginValidation = [
  check('email').isEmail().withMessage('Please include a valid email'),
  check('password').exists().withMessage('Password is required')
];

// Register user
router.post('/register', registerValidation, authController.register);

// Login user
router.post('/login', loginValidation, authController.login);

// Forgot password
router.post(
  '/forgot-password',
  [check('email').isEmail().withMessage('Please include a valid email')],
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    check('token').notEmpty().withMessage('Token is required'),
    check('newPassword')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  authController.resetPassword
);

module.exports = router; 