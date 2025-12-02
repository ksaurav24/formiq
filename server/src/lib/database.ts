import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger";
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/formiq")
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
