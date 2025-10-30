import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO || ""); // Connect to MongoDB using the connection string from environment variables
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);// Exit process with failure, with code 1 indicating an error and successful connection is 0
  }
};
