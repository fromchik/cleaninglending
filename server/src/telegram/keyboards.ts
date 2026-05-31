import type TelegramBot from "node-telegram-bot-api";
import type { Lead } from "../leads/lead.model.js";
import type { WorkflowKeyboard } from "./workflow.js";

type LeadSummary = Pick<Lead, "id" | "status">;

export function leadKeyboard(lead: LeadSummary): TelegramBot.InlineKeyboardMarkup {
  if (lead.status === "unreached") {
    return retryKeyboard(lead.id);
  }

  if (lead.status === "scheduled") {
    return scheduledKeyboard(lead.id);
  }

  if (lead.status === "closed" || lead.status === "rejected") {
    return { inline_keyboard: [] };
  }

  return callKeyboard(lead.id);
}

export function callKeyboard(leadId: number): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "📞 Дозвонився", callback_data: `lead:${leadId}:reached` },
        { text: "☎️ Не дозвонився", callback_data: `lead:${leadId}:unreached` }
      ]
    ]
  };
}

export function dateKeyboard(leadId: number): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "Сьогодні", callback_data: `lead:${leadId}:date:today` },
        { text: "Завтра", callback_data: `lead:${leadId}:date:tomorrow` }
      ],
      [{ text: "Інша дата", callback_data: `lead:${leadId}:date:custom` }]
    ]
  };
}

export function retryKeyboard(leadId: number): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [[{ text: "📞 Подзвонити повторно", callback_data: `lead:${leadId}:retry` }]]
  };
}

export function scheduledKeyboard(leadId: number): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "✅ Виконано", callback_data: `lead:${leadId}:closed` },
        { text: "❌ Відмова", callback_data: `lead:${leadId}:rejected` }
      ]
    ]
  };
}

export function listMenuKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: "🆕 Нові", callback_data: "list:new" }],
      [{ text: "☎️ Не дозвонилися", callback_data: "list:unreached" }],
      [{ text: "📅 Призначені", callback_data: "list:scheduled" }],
      [{ text: "✅ Виконані", callback_data: "list:closed" }],
      [{ text: "❌ Відмови", callback_data: "list:rejected" }]
    ]
  };
}

export function listBackKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [[{ text: "← До розділів", callback_data: "list:menu" }]]
  };
}

export function reminderKeyboard(lead: LeadSummary): TelegramBot.InlineKeyboardMarkup {
  return lead.status === "unreached" ? retryKeyboard(lead.id) : callKeyboard(lead.id);
}

export function workflowKeyboard(
  keyboard: WorkflowKeyboard,
  lead?: LeadSummary
): TelegramBot.InlineKeyboardMarkup | undefined {
  if (keyboard === "list_menu") return listMenuKeyboard();
  if (keyboard === "list_back") return listBackKeyboard();
  if (!lead) return undefined;
  if (keyboard === "date") return dateKeyboard(lead.id);
  if (keyboard === "retry") return retryKeyboard(lead.id);
  if (keyboard === "scheduled") return scheduledKeyboard(lead.id);
  return callKeyboard(lead.id);
}
