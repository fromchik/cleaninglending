import "dotenv/config";
import path from "node:path";

function numberFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const config = {
  port: numberFromEnv("PORT", 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  databasePath: path.resolve(process.cwd(), process.env.DATABASE_PATH || "./data/cleaning.sqlite"),
  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./uploads"),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramAdminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || "",
  timezone: process.env.TIMEZONE || "Europe/Kyiv",
  maxPhotos: numberFromEnv("MAX_PHOTOS", 6),
  maxFileSizeMb: numberFromEnv("MAX_FILE_SIZE_MB", 10)
};
