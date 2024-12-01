import Post from "../models/post.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/clouldinary.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

const allPosts = asyncHandler(async (req, res) => {
  // const page = parseInt(req.query.page, 10) || 1;
  // const limit = parseInt(req.query.limit, 10) || 10;
  // const skip = (page - 1) * limit;
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    // .skip(skip)
    // .limit(limit)
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

const showCreatePost = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, "Create post page"));
});

const createPost = asyncHandler(async (req, res) => {
  const { title, description, postType, department, semester, subject } =
    req.body;
  const cloudFile = await uploadOnCloudinary(req.file.path);
  if (!cloudFile)
    throw new ApiError(500, "Something went wrong while uploading file");

  const { original_filename, secure_url, resource_type } = cloudFile;
  const owner = req.user._id;

  const post = await Post.create({
    title,
    description,
    owner,
    postType,
    file: {
      fileName: original_filename,
      fileType: resource_type,
      url: secure_url,
    },
    department,
    semester,
    subject,
  });
  console.log(post);

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
  try {
    if (typeof req.file !== "undefined") {
      const cloudFile = await uploadOnCloudinary(req.file.path);
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

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.json(new ApiResponse(200, "Post deleted successfully"));
});

export {
  allPosts,
  showCreatePost,
  createPost,
  showPost,
  updatePost,
  deletePost,
};
