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

    const uploadResult = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        public_id: "shoes",
        resource_type: "auto",
      }
    );
    console.log("File is uploaded successfully", uploadResult);

    fs.unlinksync(localFilePath);
    return uploadResult;
  } catch (error) {
    fs.unlinksync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    console.log(error);
    return null;
  }
};

export default uploadOnCloudinary;
