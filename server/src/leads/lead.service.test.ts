import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initializeSchema } from "../db/schema.js";
import { LeadService } from "./lead.service.js";

describe("LeadService workflow persistence", () => {
  let db: Database.Database;
  let now: Date;
  let service: LeadService;

  beforeEach(() => {
    db = new Database(":memory:");
    initializeSchema(db);
    now = new Date("2026-05-30T10:00:00.000Z");
    service = new LeadService(db, () => now);
  });

  afterEach(() => db.close());

  function createLead() {
    return service.createLead(
      {
        serviceType: "sofa",
        location: "Київ, Позняки",
        phone: "+380991112233",
        comment: "Пляма на дивані"
      },
      []
    ).lead;
  }

  it("schedules the first new-lead reminder ten minutes after creation", () => {
    const lead = createLead();

    expect(lead.reminderType).toBe("new_first");
    expect(lead.reminderAt).toBe("2026-05-30T10:10:00.000Z");
    expect(lead.newLeadReminderCount).toBe(0);
  });

  it("marks an unreached lead and schedules a callback reminder one hour later", () => {
    const lead = createLead();

    const updated = service.markUnreached(lead.id);

    expect(updated).toMatchObject({
      status: "unreached",
      callResult: "unreached",
      reminderType: "callback",
      reminderAt: "2026-05-30T11:00:00.000Z"
    });
  });

  it("stores a reached lead price and scheduled visit", () => {
    const lead = createLead();

    service.markReached(lead.id);
    service.setPrice(lead.id, 1800);
    const scheduled = service.scheduleVisit(lead.id, "2026-05-31T12:30:00.000Z");

    expect(scheduled).toMatchObject({
      status: "scheduled",
      callResult: "reached",
      priceAmount: 1800,
      scheduledAt: "2026-05-31T12:30:00.000Z",
      reminderType: null,
      reminderAt: null
    });
  });

  it("lists leads by status", () => {
    const first = createLead();
    const second = createLead();
    service.markUnreached(second.id);

    expect(service.listByStatus("new")).toEqual([expect.objectContaining({ id: first.id })]);
    expect(service.listByStatus("unreached")).toEqual([expect.objectContaining({ id: second.id })]);
  });

  it("advances unattended reminders twice and then stops", () => {
    const lead = createLead();

    now = new Date("2026-05-30T10:10:00.000Z");
    expect(service.listDueReminders()).toEqual([expect.objectContaining({ id: lead.id })]);
    expect(service.advanceReminder(lead.id)).toMatchObject({
      reminderType: "new_second",
      reminderAt: "2026-05-30T10:40:00.000Z",
      newLeadReminderCount: 1
    });

    now = new Date("2026-05-30T10:40:00.000Z");
    expect(service.advanceReminder(lead.id)).toMatchObject({
      reminderType: null,
      reminderAt: null,
      newLeadReminderCount: 2
    });
  });

  it("clears a callback reminder after it is sent", () => {
    const lead = createLead();
    service.markUnreached(lead.id);

    now = new Date("2026-05-30T11:00:00.000Z");

    expect(service.advanceReminder(lead.id)).toMatchObject({
      reminderType: null,
      reminderAt: null
    });
  });
});

describe("initializeSchema migrations", () => {
  it("adds workflow columns to an existing leads table", () => {
    const db = new Database(":memory:");
    db.exec(`
      CREATE TABLE leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_type TEXT NOT NULL,
        location TEXT NOT NULL,
        phone TEXT NOT NULL,
        comment TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        telegram_message_id INTEGER
      );
    `);

    initializeSchema(db);

    const columnNames = db.pragma("table_info(leads)").map((column: { name: string }) => column.name);
    expect(columnNames).toEqual(
      expect.arrayContaining([
        "call_result",
        "price_amount",
        "scheduled_at",
        "reminder_type",
        "reminder_at",
        "new_lead_reminder_count"
      ])
    );
    db.close();
  });
});
