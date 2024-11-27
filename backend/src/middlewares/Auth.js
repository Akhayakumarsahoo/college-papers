// import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Post from "../models/post.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authoration")?.replace("Bearer", "");
    // console.log(token);

    if (!token) {
      return res.json(new ApiResponse(401, "You must login/signup first!"));
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.json(new ApiResponse(401, "Invalid Access Token!"));
    }
    // console.log(user._conditions._id);

    req.user = user;
    next();
  } catch (error) {
    return res.json(
      new ApiResponse(401, error?.message || "Invalid Access Token!")
    );
  }
});

export const isOwner = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return new ApiResponse(404, "Post not found!");
  }
  if (!req.user._id === post.owner) {
    return res.json(
      new ApiResponse(403, "You are not authorized to perform this action!")
    );
  }
  next();
});
