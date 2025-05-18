// middleware/isSeller.js - Seller role check middleware

const isSeller = (req, res, next) => {
  // Check if user exists and has seller role
  if (!req.user || req.user.role !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Seller role required.'
    });
  }
  next();
};

module.exports = isSeller; 