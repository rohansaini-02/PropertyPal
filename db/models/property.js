// models/property.js - Property model

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'villa', 'plot', 'commercial']
  },
  listingType: {
    type: String,
    required: true,
    enum: ['sale', 'rent']
  },
  ownershipType: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  details: {
    area: {
      type: Number,
      required: true
    },
    areaUnit: {
      type: String,
      enum: ['sqft', 'sqm', 'acres'],
      default: 'sqft'
    },
    bedrooms: {
      type: Number
    },
    bathrooms: {
      type: Number
    },
    floor: {
      type: Number
    },
    totalFloors: {
      type: Number
    }
  },
  amenities: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyImage'
  }],
  documents: [{
    name: String,
    fileUrl: String,
    fileType: String,
    uploadDate: Date
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for faster searching
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ listingType: 1 });
propertySchema.index({ seller: 1 });
propertySchema.index({ status: 1 });

module.exports = mongoose.model('Property', propertySchema);