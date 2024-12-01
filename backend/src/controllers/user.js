import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const accessCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  domain: "https://college-papers.vercel.app",
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  domain: "https://college-papers.vercel.app",
};

const generateAccessAndRefreshTokens = async (user) => {
  try {
    //Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, batch, department, gender } = req.body;
  //Check all fields are filled
  if (
    [fullName, email, password, batch, department, gender].some(
      (field) => !field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  //Create user
  const user = await User.create({
    fullName,
    email,
    password,
    batch,
    department,
    gender,
  });
  const createdUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );
  //Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while regestering user");
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json(new ApiResponse(201, "You regestered successfully 🎉", createdUser));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Check all fields are filled
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  //Check if the user already exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //Check if the password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json(new ApiResponse(200, "You logged in successfully 🎉", loggedInUser));
});

const logout = asyncHandler(async (req, res) => {
  //Delete refresh token
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { $new: true }
  );
  //Clear cookies
  return res
    .status(200)
    .clearCookie("accessToken", accessCookieOptions)
    .clearCookie("refreshToken", refreshCookieOptions)
    .json(new ApiResponse(200, "You logged out successfully."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //Get refresh token
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }
  //Check if the refresh token is valid
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    //Generate new tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user
    );
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessCookieOptions)
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .json(
        new ApiResponse(
          200,
          "Access token refreshed successfully",
          loggedInUser
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { signup, login, logout, refreshAccessToken };
