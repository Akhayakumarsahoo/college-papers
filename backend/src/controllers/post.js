import Post from "../models/post.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/clouldinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const allPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).populate({
    path: "owner",
    select: "-password -refreshToken",
  });

  const updatedPosts = posts.map((post) => {
    if (post.file?.url) {
      post.file.url = post.file.url.replace("/upload", "/upload/h_100,w_150");
    }
    return post;
  });

  res.json(new ApiResponse(200, "All posts", updatedPosts));
});

const createPost = asyncHandler(async (req, res) => {
  const { title, description, postType, department, semester, subject } =
    req.body;

  const cloudFile = await uploadOnCloudinary(req.file.path);

  console.log(cloudFile);

  const { original_filename, secure_url, resource_type } = cloudFile;
  const owner = req.user._conditions._id;
  // console.log(owner);

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

  res.json(new ApiResponse(201, "Post created successfully 🎉", post));
});

const showPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate({
    path: "owner",
    select: "-password -refreshToken",
  });
  if (!post) {
    return res.json(new ApiResponse(404, "Post not found"));
  }
  res.json(new ApiResponse(200, "Post found", post));
});

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, postType, department, semester, subject } =
    req.body;

  const post = await Post.findByIdAndUpdate(id, {
    title,
    description,
    postType,
    department,
    semester,
    subject,
  });
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
  res.json(new ApiResponse(200, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.json(new ApiResponse(200, "Post deleted successfully"));
});

export { allPosts, createPost, showPost, updatePost, deletePost };
