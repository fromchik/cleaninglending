import TelegramBot from "node-telegram-bot-api";
import fs from "node:fs";
import { config } from "../config.js";
import type { Lead, LeadPhoto } from "../leads/lead.model.js";
import type { LeadService } from "../leads/lead.service.js";
import { formatLeadList, formatLeadMessage, formatReminderMessage } from "../utils/format.js";
import { formatTelegramError } from "../utils/telegramError.js";
import {
  leadKeyboard,
  listBackKeyboard,
  listMenuKeyboard,
  reminderKeyboard,
  workflowKeyboard
} from "./keyboards.js";
import { startMessage } from "./messages.js";
import { TelegramWorkflow, type WorkflowResult } from "./workflow.js";

export type TelegramNotifier = {
  notifyLead(lead: Lead, photos: LeadPhoto[]): Promise<void>;
};

type TelegramAdminOptions = {
  token: string;
  adminChatId: string;
  leadService: LeadService;
};

export function isAdminChat(chatId: number | string, adminChatId: string): boolean {
  return String(chatId) === String(adminChatId);
}

export function createTelegramAdmin(options: TelegramAdminOptions): TelegramNotifier | null {
  if (!options.token || !options.adminChatId) {
    console.warn("Telegram bot is disabled: TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID is missing.");
    return null;
  }

  const bot = new TelegramBot(options.token, { polling: true });
  const workflow = new TelegramWorkflow(options.leadService, () => new Date(), config.timezone);
  const isAdmin = (chatId: number | string) => isAdminChat(chatId, options.adminChatId);

  bot.onText(/\/start/, async (message) => {
    console.log(`Telegram /start chat id: ${message.chat.id}`);
    await bot.sendMessage(message.chat.id, startMessage);
  });

  bot.onText(/\/leads/, async (message) => {
    if (!isAdmin(message.chat.id)) {
      await bot.sendMessage(message.chat.id, "Ця команда доступна лише власнику.");
      return;
    }

    await bot.sendMessage(message.chat.id, "Оберіть розділ заявок:", {
      reply_markup: listMenuKeyboard()
    });
  });

  bot.on("message", async (message) => {
    const text = message.text?.trim();
    if (!text || text.startsWith("/") || !isAdmin(message.chat.id)) {
      return;
    }

    await sendWorkflowResult(bot, message.chat.id, workflow.handleText(String(message.chat.id), text));
  });

  bot.on("callback_query", async (query) => {
    if (!query.message || !isAdmin(query.message.chat.id)) {
      await bot.answerCallbackQuery(query.id, { text: "Недостатньо прав" });
      return;
    }

    try {
      const result = workflow.handleCallback(String(query.message.chat.id), query.data || "");
      await sendWorkflowResult(bot, query.message.chat.id, result);
      await bot.answerCallbackQuery(query.id, { text: result.answerText || "Готово" });
    } catch (error) {
      console.error("Telegram callback error:", formatTelegramError(error));
      await bot.answerCallbackQuery(query.id, { text: "Не вдалося виконати дію" });
    }
  });

  bot.on("polling_error", (error) => {
    console.error("Telegram polling error:", error.message);
  });

  const reminderTimer = setInterval(() => {
    void sendDueReminders(bot, options.adminChatId, options.leadService);
  }, 60_000);
  reminderTimer.unref();

  return {
    async notifyLead(lead, photos) {
      const sent = await bot.sendMessage(options.adminChatId, formatLeadMessage(lead), {
        reply_markup: leadKeyboard(lead)
      });

      options.leadService.setTelegramMessageId(lead.id, sent.message_id);

      for (const photo of photos) {
        if (fs.existsSync(photo.filePath)) {
          await bot.sendPhoto(options.adminChatId, photo.filePath);
        }
      }
    }
  };
}

async function sendWorkflowResult(bot: TelegramBot, chatId: number, result: WorkflowResult): Promise<void> {
  if (result.lead?.telegramMessageId) {
    try {
      await bot.editMessageText(formatLeadMessage(result.lead), {
        chat_id: chatId,
        message_id: result.lead.telegramMessageId,
        reply_markup: leadKeyboard(result.lead)
      });
    } catch (error) {
      console.warn("Telegram card refresh skipped:", formatTelegramError(error));
    }
  }

  if (result.leads) {
    await bot.sendMessage(chatId, formatLeadList(result.leads), {
      reply_markup: listBackKeyboard()
    });
  }

  if (result.promptText) {
    const replyMarkup = result.keyboard ? workflowKeyboard(result.keyboard, result.lead) : undefined;
    await bot.sendMessage(chatId, result.promptText, replyMarkup ? { reply_markup: replyMarkup } : undefined);
  }
}

async function sendDueReminders(bot: TelegramBot, adminChatId: string, leadService: LeadService): Promise<void> {
  for (const lead of leadService.listDueReminders()) {
    try {
      await bot.sendMessage(adminChatId, formatReminderMessage(lead), {
        reply_markup: reminderKeyboard(lead)
      });
      leadService.advanceReminder(lead.id);
    } catch (error) {
      console.error(`Failed to send reminder for lead #${lead.id}:`, formatTelegramError(error));
    }
  }
}
