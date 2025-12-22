import cloudinary from "cloudinary";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "/tmp/" });

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    upload.single("file")(req as any, res as any, async (err: any) => {
      if (err) {
        res.status(500).json({ error: "File upload failed" });
        return reject(err);
      }

      const file = (req as any).file;
      const { senderId, receiverId } = req.query; // Extract sender & receiver from request

      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return reject("No file uploaded");
      }

      if (!senderId || !receiverId) {
        res.status(400).json({ error: "Sender and receiver are required" });
        return reject("Sender and receiver are required");
      }

      try {
        // Upload file to Cloudinary under 'receiver/sender' folder
        const result = await cloudinary.v2.uploader.upload(file.path, {
          folder: `chat-app/chat-files/${senderId}/${receiverId}`,
          // format:'auto',
          resource_type: "auto", // Automatically detect file type (image, video, raw file)
        });

        // Remove the temp file after upload
        fs.unlinkSync(file.path);

        res.status(200).json({
          message: "File uploaded to Cloudinary",
          fileUrl: result.secure_url,
        });

        resolve(null);
      } catch (error) {
        res.status(500).json({ error: "Cloudinary upload failed" });
        reject(error);
      }
    });
  });
}

export const config = { api: { bodyParser: false } };
