import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import multer from "multer";
import { config } from "./config.js";
import { createLeadRouter } from "./leads/lead.routes.js";
import type { LeadService } from "./leads/lead.service.js";
import type { TelegramNotifier } from "./telegram/bot.js";

type AppOptions = {
  leadService: LeadService;
  telegramNotifier: TelegramNotifier | null;
};

export function createApp(options: AppOptions) {
  const app = express();

  app.use(
    cors({
      origin: config.clientOrigin
    })
  );
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/leads", createLeadRouter(options));
  app.use(errorHandler);

  return app;
}

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({
      ok: false,
      error: "UPLOAD_ERROR",
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? `Кожне фото має бути до ${config.maxFileSizeMb} MB`
          : `Можна завантажити до ${config.maxPhotos} фото`
    });
    return;
  }

  if (error instanceof Error && error.message === "Можна завантажувати лише зображення") {
    res.status(400).json({
      ok: false,
      error: "UPLOAD_ERROR",
      message: error.message
    });
    return;
  }

  console.error("Unhandled API error:", error);
  res.status(500).json({
    ok: false,
    error: "SERVER_ERROR",
    message: "Не вдалося обробити заявку. Спробуйте ще раз."
  });
};
