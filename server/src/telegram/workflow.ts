import type { Lead, LeadStatus } from "../leads/lead.model.js";
import type { LeadService } from "../leads/lead.service.js";

export type WorkflowKeyboard = "call" | "date" | "retry" | "scheduled" | "list_back" | "list_menu";

export type WorkflowResult = {
  answerText?: string;
  promptText?: string;
  keyboard?: WorkflowKeyboard;
  lead?: Lead;
  leads?: Lead[];
};

type OwnerState =
  | { leadId: number; step: "price" }
  | { leadId: number; step: "date_choice" }
  | { leadId: number; step: "custom_date" }
  | { leadId: number; step: "time"; date: string };

const listStatuses: LeadStatus[] = ["new", "unreached", "scheduled", "closed", "rejected"];

export class TelegramWorkflow {
  private readonly ownerStates = new Map<string, OwnerState>();

  constructor(
    private readonly leadService: LeadService,
    private readonly now: () => Date = () => new Date(),
    private readonly timezone = "Europe/Kyiv"
  ) {}

  handleCallback(ownerId: string, data: string): WorkflowResult {
    if (data === "list:menu") {
      return { promptText: "Оберіть розділ заявок:", keyboard: "list_menu" };
    }

    const listMatch = data.match(/^list:([a-z_]+)$/);
    if (listMatch) {
      const status = listMatch[1] as LeadStatus;
      if (!listStatuses.includes(status)) {
        return { answerText: "Невідомий розділ" };
      }
      return { leads: this.leadService.listByStatus(status), keyboard: "list_back" };
    }

    const match = data.match(/^lead:(\d+):([a-z_]+)(?::([a-z_]+))?$/);
    if (!match) {
      return { answerText: "Невідома команда" };
    }

    const leadId = Number(match[1]);
    const action = match[2];
    const option = match[3];
    const lead = this.leadService.getLead(leadId);
    if (!lead) {
      return { answerText: "Заявку не знайдено" };
    }
    if (!canUseAction(lead.status, action)) {
      return { answerText: "Ця кнопка вже не актуальна" };
    }

    if (action === "reached") {
      this.ownerStates.set(ownerId, { leadId, step: "price" });
      return {
        promptText: "Введіть узгоджену ціну цілим числом, наприклад: 1800",
        lead: this.leadService.markReached(leadId) || lead
      };
    }

    if (action === "unreached") {
      this.ownerStates.delete(ownerId);
      return {
        promptText: "Повторний дзвінок нагадаю через годину.",
        keyboard: "retry",
        lead: this.leadService.markUnreached(leadId) || lead
      };
    }

    if (action === "retry") {
      this.ownerStates.delete(ownerId);
      return {
        promptText: "Позначте результат повторного дзвінка.",
        keyboard: "call",
        lead: this.leadService.clearReminder(leadId) || lead
      };
    }

    if (action === "date") {
      return this.handleDateChoice(ownerId, leadId, option);
    }

    if (action === "closed" || action === "rejected") {
      this.ownerStates.delete(ownerId);
      return {
        answerText: action === "closed" ? "Замовлення виконано" : "Заявку відхилено",
        lead: this.leadService.updateStatus(leadId, action) || lead
      };
    }

    return { answerText: "Невідома команда" };
  }

  handleText(ownerId: string, text: string): WorkflowResult {
    const state = this.ownerStates.get(ownerId);
    if (!state) {
      return {};
    }

    if (state.step === "price") {
      if (!/^\d+$/.test(text.trim()) || Number(text) <= 0) {
        return { promptText: "Ціна має бути цілим додатним числом. Наприклад: 1800" };
      }
      const lead = this.leadService.setPrice(state.leadId, Number(text));
      if (!lead) {
        return { answerText: "Заявку не знайдено" };
      }
      this.ownerStates.set(ownerId, { leadId: state.leadId, step: "date_choice" });
      return { promptText: "Оберіть дату виїзду:", keyboard: "date", lead };
    }

    if (state.step === "custom_date") {
      const date = parseCustomDate(text, this.now(), this.timezone);
      if (!date) {
        return { promptText: "Введіть реальну дату у форматі DD.MM, наприклад: 02.06" };
      }
      this.ownerStates.set(ownerId, { leadId: state.leadId, step: "time", date });
      return { promptText: "Введіть час виїзду у форматі HH:MM, наприклад: 14:30" };
    }

    if (state.step === "time") {
      const time = text.trim();
      if (!isValidTime(time)) {
        return { promptText: "Введіть час у форматі HH:MM, наприклад: 14:30" };
      }
      this.ownerStates.delete(ownerId);
      const lead = this.leadService.scheduleVisit(state.leadId, `${state.date}T${time}:00`);
      if (!lead) {
        return { answerText: "Заявку не знайдено" };
      }
      return { promptText: "Виїзд призначено.", keyboard: "scheduled", lead };
    }

    return { promptText: "Оберіть дату виїзду кнопкою нижче.", keyboard: "date" };
  }

  private handleDateChoice(ownerId: string, leadId: number, option?: string): WorkflowResult {
    const state = this.ownerStates.get(ownerId);
    if (state?.leadId !== leadId || state.step !== "date_choice") {
      return { answerText: "Спочатку позначте дзвінок і введіть ціну" };
    }

    if (option === "custom") {
      this.ownerStates.set(ownerId, { leadId, step: "custom_date" });
      return { promptText: "Введіть дату у форматі DD.MM, наприклад: 02.06" };
    }

    if (option !== "today" && option !== "tomorrow") {
      return { answerText: "Невідома дата" };
    }

    const date = addCalendarDays(getLocalDate(this.now(), this.timezone), option === "tomorrow" ? 1 : 0);
    this.ownerStates.set(ownerId, { leadId, step: "time", date });
    return { promptText: "Введіть час виїзду у форматі HH:MM, наприклад: 14:30" };
  }
}

function getLocalDate(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addCalendarDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const updated = new Date(Date.UTC(year, month - 1, day + days));
  return updated.toISOString().slice(0, 10);
}

function parseCustomDate(input: string, now: Date, timezone: string): string | null {
  const match = input.trim().match(/^(\d{2})\.(\d{2})$/);
  if (!match) {
    return null;
  }

  const currentDate = getLocalDate(now, timezone);
  const currentYear = Number(currentDate.slice(0, 4));
  const day = Number(match[1]);
  const month = Number(match[2]);
  let candidate = formatValidDate(currentYear, month, day);
  if (!candidate) {
    return null;
  }
  if (candidate < currentDate) {
    candidate = formatValidDate(currentYear + 1, month, day);
  }
  return candidate;
}

function formatValidDate(year: number, month: number, day: number): string | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }
  return date.toISOString().slice(0, 10);
}

function isValidTime(time: string): boolean {
  const match = time.match(/^(\d{2}):(\d{2})$/);
  return Boolean(match && Number(match[1]) <= 23 && Number(match[2]) <= 59);
}

function canUseAction(status: LeadStatus, action: string): boolean {
  if (action === "reached" || action === "unreached") {
    return ["new", "taken", "unreached", "price_sent"].includes(status);
  }
  if (action === "retry") {
    return status === "unreached";
  }
  if (action === "date") {
    return status === "price_sent";
  }
  if (action === "closed" || action === "rejected") {
    return status === "scheduled";
  }
  return true;
}
