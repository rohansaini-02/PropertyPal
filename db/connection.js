// const mongoose = require('mongoose');

// const uri = 'mongodb+srv://avandalal2007:F5UWoffmbEg0hKq2@cluster0.nok9jnz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/first_db'
// mongoose.connect(uri)
//     .then(() => console.log('Connected to Database!')); 

// db/connection.js - Database connection

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;