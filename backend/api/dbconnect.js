import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

if (!process.env.MONGO_URI) {
  console.error("Mongo URI is missing");
  process.exit(1);
}

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed (dbconnect.js)");
    console.log("exiting...");
    process.exit(1);
  }
};

export default dbConnect;