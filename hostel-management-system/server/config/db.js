const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_management', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Tip: Ensure MongoDB is running locally or set a valid MONGO_URI in your server/.env file.');
    // Do not terminate process immediately so developer can see helpful error or update .env
    return null;
  }
};

module.exports = connectDB;

