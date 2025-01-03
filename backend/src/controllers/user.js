import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 14 * 24 * 60 * 60 * 1000,
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
  const { fullName, email, password, batch, department } = req.body;
  //Check all fields are filled
  if (
    [fullName, email, password, batch, department].some(
      (field) => field?.trim() === ""
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
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(201, "You regestered successfully 🎉", {
        user: createdUser,
        accessToken,
      })
    );
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
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, "You logged in successfully 🎉", {
        user: loggedInUser,
        accessToken,
      })
    );
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
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  //Clear cookies
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "You logged out successfully."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //Get refresh token
  const incomingRefreshToken = req.cookies.refreshToken;
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
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(200, "Access token refreshed successfully", {
          user: loggedInUser,
          accessToken,
        })
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "User found successfully", req.user));
});

const updateUserData = asyncHandler(async (req, res) => {
  const { fullName, batch, department } = req.body;
  if ([fullName, batch, department].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      fullName,
      batch,
      department,
    },
    { new: true }
  ).select("-password -refreshToken");
  if (!user)
    throw new ApiError(500, "Something went wrong while updating user data", {
      user,
    });
  return res
    .status(200)
    .json(new ApiResponse(200, "Your profile updated successfully 🎉", user));
});

export { signup, login, logout, refreshAccessToken, updateUserData, getUser };
