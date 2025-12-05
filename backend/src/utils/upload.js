import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import stream from "stream";

export function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured");
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return cloudinary;
}

// Multer memory storage to stream file to Cloudinary
// Set file size limit to 10MB per file
export const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function uploadBufferToCloudinary(buffer, filename, folder = "products") {
  const cloud = configureCloudinary();
  return new Promise((resolve, reject) => {
    const pass = new stream.PassThrough();
    pass.end(buffer);
    const options = { folder, public_id: filename?.split(".")?.[0] };
    const streamUpload = cloud.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    pass.pipe(streamUpload);
  });
}



