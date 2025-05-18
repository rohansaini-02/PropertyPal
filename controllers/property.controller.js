// controllers/property.controller.js - Property management controller

const Property = require('../db/models/property');
const { validationResult } = require('express-validator');

// Create a new property listing
exports.createProperty = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const propertyData = {
      ...req.body,
      seller: req.user.id // Get seller ID from authenticated user
    };

    const property = new Property(propertyData);
    await property.save();

    res.status(201).json({
      success: true,
      message: 'Property listed successfully',
      property
    });
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the property listing'
    });
  }
};

// Get all properties for a seller
exports.getSellerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ seller: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error('Get seller properties error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching properties'
    });
  }
};

// Get a single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      seller: req.user.id
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the property'
    });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      seller: req.user.id
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Update property fields
    Object.keys(req.body).forEach(key => {
      property[key] = req.body[key];
    });

    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the property'
    });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the property'
    });
  }
}; 