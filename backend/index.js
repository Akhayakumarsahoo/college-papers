import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await mongoose
      .connect(MONGO_URL)
      .then(() => console.log("MongoDB is connected successfully"));
    app.listen(PORT, () => {
      console.log(`App is listining to port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MONGODB connection ERROR", error);
    throw error;
  }
})();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", router);
