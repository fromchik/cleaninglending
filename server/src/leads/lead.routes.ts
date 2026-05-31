import { Router, type Request, type Response } from "express";
import type { LeadService } from "./lead.service.js";
import { validateLeadInput, validateLeadPhotos } from "./lead.validation.js";
import { uploadPhotos } from "../uploads/upload.middleware.js";
import type { TelegramNotifier } from "../telegram/bot.js";
import { config } from "../config.js";
import { formatTelegramError } from "../utils/telegramError.js";

type LeadRouterOptions = {
  leadService: LeadService;
  telegramNotifier: TelegramNotifier | null;
};

export function createLeadRouter(options: LeadRouterOptions): Router {
  const router = Router();

  router.post("/", uploadPhotos.array("photos", config.maxPhotos), async (req: Request, res: Response) => {
    const validation = validateLeadInput(req.body);

    if (!validation.ok) {
      res.status(400).json({
        ok: false,
        error: "VALIDATION_ERROR",
        message: validation.message
      });
      return;
    }

    const files = Array.isArray(req.files) ? req.files : [];
    const photoValidation = validateLeadPhotos(files);

    if (!photoValidation.ok) {
      res.status(400).json({
        ok: false,
        error: "VALIDATION_ERROR",
        message: photoValidation.message
      });
      return;
    }

    const photos = files.map((file) => ({
      fileName: file.filename,
      filePath: file.path,
      mimeType: file.mimetype,
      sizeBytes: file.size
    }));

    const created = options.leadService.createLead(validation.value, photos);

    if (options.telegramNotifier) {
      try {
        await options.telegramNotifier.notifyLead(created.lead, created.photos);
      } catch (error) {
        console.error("Failed to send Telegram notification:", formatTelegramError(error));
      }
    }

    res.status(201).json({
      ok: true,
      leadId: created.lead.id,
      message: "Заявку надіслано"
    });
  });

  return router;
}
