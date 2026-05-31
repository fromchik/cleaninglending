import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { config } from "../config.js";

fs.mkdirSync(config.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, config.uploadDir);
  },
  filename: (_req, file, callback) => {
    const safeBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^\w.-]+/g, "-")
      .slice(0, 60);
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBase}${ext}`);
  }
});

export const uploadPhotos = multer({
  storage,
  limits: {
    files: config.maxPhotos,
    fileSize: config.maxFileSizeMb * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Можна завантажувати лише зображення"));
      return;
    }

    callback(null, true);
  }
});
