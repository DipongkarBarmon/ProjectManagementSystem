import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";
import config from "../config/index";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "attachments",
  mimetype?: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Force raw for PDFs so they can be downloaded properly without Cloudinary restrictions
    const resourceType = mimetype === "application/pdf" ? "raw" : "auto";
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

const storage = multer.memoryStorage();
export const upload = multer({ storage });
