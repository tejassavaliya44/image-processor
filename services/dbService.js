const mongoose = require('mongoose');

async function connectDB() {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/image-processor';
        await mongoose.connect(mongoURI);
        console.log('Connection Established with MongoDB Successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}

module.exports = connectDB;