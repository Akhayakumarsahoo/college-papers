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

export default uploadOnCloudinary;
