import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // 1. Hardcoded URI for testing
    const uri = "mongodb+srv://pranaydubey272:chatshatpjn@chatshat.bsgimwr.mongodb.net/?retryWrites=true&w=majority&appName=ChatShat";

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // 2. THIS IS THE MOST IMPORTANT FIX
    // We MUST throw the error so Netlify can log it
    console.error(`MongoDB connection error: ${error.message}`);
    throw new Error(`DB Connection Failed: ${error.message}`);
  }
};

export { connectDB };
