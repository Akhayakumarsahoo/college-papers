import { User } from "../models/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (user) => {
  try {
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
      (field) => field?.trim() === ""
    )
  ) {
    return res.json(new ApiResponse(400, "All fields are required"));
  }

  //Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json(new ApiResponse(409, "User already exists"));
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
    return res.json(
      new ApiResponse(500, "Something went wrong while regestering user")
    );
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "You regestered successfully 🎉", createdUser));
});

//Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Check all fields are filled
  if (!(email || password)) {
    return res.json(new ApiResponse(400, "All fields are required"));
  }

  //Check if the user already exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.json(new ApiResponse(404, "User not found"));
  }

  //Check if the password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.json(new ApiResponse(401, "Invalid credentials"));
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "You logged in successfully 🎉", loggedInUser));
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._conditions._id,
    {
      $unset: { refreshToken: 1 },
    },
    { $new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "You logged out successfully."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    return res.json(new ApiResponse(401, "Refresh token not found"));
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.json(new ApiResponse(401, "Invalid refresh token"));
    }
    if (user.refreshToken !== incomingRefreshToken) {
      return res.json(new ApiResponse(401, "Refresh token is expired or used"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user
    );
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          "Access token refreshed successfully",
          loggedInUser
        )
      );
  } catch (error) {
    return res.json(
      new ApiResponse(401, error?.message || "Invalid refresh token")
    );
  }
});

export { signup, login, logout, refreshAccessToken };
