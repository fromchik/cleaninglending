import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initializeSchema } from "../db/schema.js";
import { LeadService } from "../leads/lead.service.js";
import { TelegramWorkflow } from "./workflow.js";

describe("TelegramWorkflow", () => {
  let db: Database.Database;
  let now: Date;
  let leadService: LeadService;
  let workflow: TelegramWorkflow;

  beforeEach(() => {
    db = new Database(":memory:");
    initializeSchema(db);
    now = new Date("2026-05-30T10:00:00.000Z");
    leadService = new LeadService(db, () => now);
    workflow = new TelegramWorkflow(leadService, () => now, "Europe/Kyiv");
  });

  afterEach(() => db.close());

  function createLead() {
    return leadService.createLead(
      {
        serviceType: "sofa",
        location: "Київ, Позняки",
        phone: "+380991112233",
        comment: ""
      },
      []
    ).lead;
  }

  it("guides a reached customer through price, date, and time", () => {
    const lead = createLead();

    expect(workflow.handleCallback("owner", `lead:${lead.id}:reached`)).toMatchObject({
      promptText: "Введіть узгоджену ціну цілим числом, наприклад: 1800",
      lead: { callResult: "reached" }
    });
    expect(workflow.handleText("owner", "1800")).toMatchObject({
      promptText: "Оберіть дату виїзду:",
      keyboard: "date",
      lead: { priceAmount: 1800 }
    });
    expect(workflow.handleCallback("owner", `lead:${lead.id}:date:tomorrow`)).toMatchObject({
      promptText: "Введіть час виїзду у форматі HH:MM, наприклад: 14:30"
    });
    expect(workflow.handleText("owner", "14:30")).toMatchObject({
      promptText: "Виїзд призначено.",
      keyboard: "scheduled",
      lead: {
        status: "scheduled",
        scheduledAt: "2026-05-31T14:30:00"
      }
    });
  });

  it("rejects an invalid price without changing the lead", () => {
    const lead = createLead();
    workflow.handleCallback("owner", `lead:${lead.id}:reached`);

    expect(workflow.handleText("owner", "18OO")).toEqual({
      promptText: "Ціна має бути цілим додатним числом. Наприклад: 1800"
    });
    expect(leadService.getLead(lead.id)?.priceAmount).toBeNull();
  });

  it("rejects an invalid custom date and accepts a corrected date", () => {
    const lead = createLead();
    workflow.handleCallback("owner", `lead:${lead.id}:reached`);
    workflow.handleText("owner", "1800");
    workflow.handleCallback("owner", `lead:${lead.id}:date:custom`);

    expect(workflow.handleText("owner", "31.02")).toEqual({
      promptText: "Введіть реальну дату у форматі DD.MM, наприклад: 02.06"
    });
    expect(workflow.handleText("owner", "02.06")).toEqual({
      promptText: "Введіть час виїзду у форматі HH:MM, наприклад: 14:30"
    });
  });

  it("rejects an invalid time without scheduling the lead", () => {
    const lead = createLead();
    workflow.handleCallback("owner", `lead:${lead.id}:reached`);
    workflow.handleText("owner", "1800");
    workflow.handleCallback("owner", `lead:${lead.id}:date:today`);

    expect(workflow.handleText("owner", "25:70")).toEqual({
      promptText: "Введіть час у форматі HH:MM, наприклад: 14:30"
    });
    expect(leadService.getLead(lead.id)?.scheduledAt).toBeNull();
  });

  it("marks an unreached customer and allows a retry", () => {
    const lead = createLead();

    expect(workflow.handleCallback("owner", `lead:${lead.id}:unreached`)).toMatchObject({
      promptText: "Повторний дзвінок нагадаю через годину.",
      keyboard: "retry",
      lead: { status: "unreached" }
    });
    expect(workflow.handleCallback("owner", `lead:${lead.id}:retry`)).toMatchObject({
      promptText: "Позначте результат повторного дзвінка.",
      keyboard: "call"
    });
  });

  it("closes or rejects a scheduled lead", () => {
    const first = createLead();
    const second = createLead();
    leadService.scheduleVisit(first.id, "2026-05-31T14:30:00");
    leadService.scheduleVisit(second.id, "2026-05-31T15:30:00");

    expect(workflow.handleCallback("owner", `lead:${first.id}:closed`)).toMatchObject({
      lead: { status: "closed" }
    });
    expect(workflow.handleCallback("owner", `lead:${second.id}:rejected`)).toMatchObject({
      lead: { status: "rejected" }
    });
  });

  it("returns filtered lead lists", () => {
    const lead = createLead();

    expect(workflow.handleCallback("owner", "list:new")).toMatchObject({
      keyboard: "list_back",
      leads: [expect.objectContaining({ id: lead.id })]
    });
  });

  it("returns an error for stale callbacks", () => {
    expect(workflow.handleCallback("owner", "lead:999:reached")).toEqual({
      answerText: "Заявку не знайдено"
    });
  });

  it("does not reopen a completed lead from an old callback button", () => {
    const lead = createLead();
    leadService.scheduleVisit(lead.id, "2026-05-31T14:30:00");
    leadService.updateStatus(lead.id, "closed");

    expect(workflow.handleCallback("owner", `lead:${lead.id}:reached`)).toEqual({
      answerText: "Ця кнопка вже не актуальна"
    });
    expect(leadService.getLead(lead.id)?.status).toBe("closed");
  });
});
