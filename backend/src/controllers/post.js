import Post from "../models/post.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/clouldinary.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

const allPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "owner",
      select: "-password -refreshToken",
    });

  const updatedPosts = posts.map((post) => ({
    ...post.toObject(),
    file: post.file
      ? {
          ...post.file,
          url: post.file.url.replace("/upload", "/upload/h_100,w_150"),
        }
      : null,
  }));

  return res.status(200).json(new ApiResponse(200, "All posts", updatedPosts));
});

const createPost = asyncHandler(async (req, res) => {
  const { title, description, postType, department, semester, subject } =
    req.body;
  //Check all fields are filled
  if (
    [title, postType, department, semester, subject].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //Upload file
  if (req.fileValidationError) throw new ApiError(400, req.fileValidationError);
  if (!req.file) throw new ApiError(400, "File is required");

  const cloudFile = await uploadOnCloudinary(req.file);
  if (!cloudFile)
    throw new ApiError(500, "Something went wrong while uploading file");

  const { original_filename, secure_url } = cloudFile;
  const owner = req.user._id;

  const post = await Post.create({
    title,
    description,
    owner,
    postType,
    file: {
      fileName: original_filename,
      fileType: req.file.mimetype,
      url: secure_url,
    },
    department,
    semester,
    subject,
  });
  res
    .status(201)
    .json(new ApiResponse(201, "Post created successfully 🎉", post));
});

const showPost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
      path: "owner",
      select: "-password -refreshToken",
    });
    if (!post) {
      throw new ApiError(404, "Page not found");
    }

    return res.status(200).json(new ApiResponse(200, "Post found", post));
  } catch (error) {
    throw new ApiError(404, "Page not found");
  }
});

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, postType, department, semester, subject } =
    req.body;
  if (
    [title, postType, department, semester, subject].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const post = await Post.findByIdAndUpdate(id, {
    title,
    description,
    postType,
    department,
    semester,
    subject,
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  // Update file
  if (req.fileValidationError) throw new ApiError(400, req.fileValidationError);
  try {
    if (typeof req.file !== "undefined") {
      const cloudFile = await uploadOnCloudinary(req.file);
      const { original_filename, secure_url, resource_type } = cloudFile;

      post.file = {
        fileName: original_filename,
        fileType: resource_type,
        url: secure_url,
      };
      await post.save();
    }
  } catch (error) {
    throw new ApiError(500, "Something went wrong while uploading file");
  }

  res.json(new ApiResponse(200, "Post updated successfully"));
});

const downloadPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  res.download(post.file.url);
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.json(new ApiResponse(200, "Post deleted successfully"));
});

export { allPosts, createPost, showPost, updatePost, downloadPost, deletePost };
