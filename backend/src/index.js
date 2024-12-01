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
      console.log(`⚙️  Server is listining to port ${PORT}`);
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
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routers
import userRouter from "./routes/user.js";
import postsRouter from "./routes/post.js";
import ApiError from "./utils/apiError.js";

app.use("/api/users", userRouter);
app.use("/api/posts", postsRouter);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle unexpected errors
  console.error(err); // Log for debugging
  res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: [],
  });
});

// process.on("SIGINT", async () => {
//   console.log("Gracefully shutting down...");
//   await mongoose.connection.close();
//   process.exit(0);
// });
