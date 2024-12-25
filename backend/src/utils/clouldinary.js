import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;

    const isPDF = localFilePath.mimetype === "application/pdf";
    const uploadResult = await cloudinary.uploader.upload(localFilePath.path, {
      folder: "college-papers",
      public_id: localFilePath.filename,
      resource_type: isPDF ? "raw" : "image",
    });

    fs.unlinkSync(localFilePath.path);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localFilePath.path);
    console.log("Cloudinary Error", error);
    return null;
  }
};

const deleteFromCloudinary = async function (publicId) {
  try {
    if (!publicId) {
      return null;
    }
    // console.log("Deleting public ID:", publicId);
    const deleteResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
      invalidate: true,
    });
    // console.log("Cloudinary Delete Result:", deleteResult);
    return deleteResult;
  } catch (error) {
    console.error("Cloudinary Error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
