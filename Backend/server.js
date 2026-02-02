import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/", chatRoutes);

const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  }catch(error){
    console.error("MongoDB connection error:",error);
  }
}

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
