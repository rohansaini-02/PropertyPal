// routes/property.routes.js - Property routes

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const isSeller = require('../middleware/isSeller');
const propertyController = require('../controllers/property.controller');

// Validation middleware
const propertyValidation = [
  check('title').notEmpty().withMessage('Title is required'),
  check('propertyType').isIn(['apartment', 'house', 'villa', 'plot', 'commercial'])
    .withMessage('Invalid property type'),
  check('listingType').isIn(['sale', 'rent']).withMessage('Invalid listing type'),
  check('ownershipType').notEmpty().withMessage('Ownership type is required'),
  check('price').isNumeric().withMessage('Price must be a number'),
  check('location.address').notEmpty().withMessage('Address is required'),
  check('location.city').notEmpty().withMessage('City is required'),
  check('location.state').notEmpty().withMessage('State is required'),
  check('location.pincode').notEmpty().withMessage('Pincode is required'),
  check('details.area').isNumeric().withMessage('Area must be a number'),
  check('description').notEmpty().withMessage('Description is required')
];

// Create a new property listing
router.post(
  '/',
  [auth, isSeller, ...propertyValidation],
  propertyController.createProperty
);

// Get all properties for the authenticated seller
router.get(
  '/my-properties',
  [auth, isSeller],
  propertyController.getSellerProperties
);

// Get a single property by ID
router.get(
  '/:id',
  [auth, isSeller],
  propertyController.getPropertyById
);

// Update a property
router.put(
  '/:id',
  [auth, isSeller, ...propertyValidation],
  propertyController.updateProperty
);

// Delete a property
router.delete(
  '/:id',
  [auth, isSeller],
  propertyController.deleteProperty
);

module.exports = router; 