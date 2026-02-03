import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: { message: "File is required" } });
  }

  const b64 = req.file.buffer.toString("base64");
  const dataUri = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "portfolio"
  });

  return res.json({ url: result.secure_url });
}
