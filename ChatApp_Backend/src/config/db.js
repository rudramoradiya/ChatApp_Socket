require('dotenv').config(); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const rawUri = process.env.MONGODB_URI || '';
        const masked = rawUri.replace(/:(?:.*)@/, ':*****@');
        console.log('Using MongoDB URI:', masked.substring(0, 200));
        await mongoose.connect(rawUri);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
