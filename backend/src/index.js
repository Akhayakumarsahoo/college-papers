import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

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
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routers
import userRouter from "./routes/user.js";
import postsRouter from "./routes/post.js";

app.use("/api/users", userRouter);
app.use("/api/posts", postsRouter);
