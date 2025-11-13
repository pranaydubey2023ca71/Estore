// db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Hardcode your URL here (replace <YOUR_MONGO_URI>)
    const uri = "mongodb+srv://pranaydubey272:chatshatpjn@chatshat.bsgimwr.mongodb.net/?retryWrites=true&w=majority&appName=ChatShat";

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export { connectDB };
