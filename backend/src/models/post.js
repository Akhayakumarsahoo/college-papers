import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    postType: {
      type: String,
      enum: ["PYQs", "Notes", "Others"],
      required: [true, "Post type is required"],
    },
    file: {
      fileName: {
        type: String,
        required: [true, "File name is required"],
      },
      fileType: {
        type: String,
        required: [true, "File type is required"],
      },
      url: {
        type: String,
        required: [true, "File URL is required"],
      },
    },
    department: {
      type: String,
      ref: "Department",
      enum: [
        "Comp.Sc",
        "Physics",
        "Chemistry",
        "Zoology",
        "Electronics",
        "Math",
        "Botany",
        "ITM",
        "Others",
      ],
      required: [true, "Department is required"],
    },
    semester: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
      required: [true, "Semester is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
