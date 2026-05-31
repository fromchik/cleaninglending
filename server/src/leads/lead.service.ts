import type Database from "better-sqlite3";
import type {
  CreateLeadInput,
  CreateLeadPhotoInput,
  CallResult,
  Lead,
  LeadPhoto,
  ReminderType,
  LeadStatus,
  ServiceType
} from "./lead.model.js";

type LeadRow = {
  id: number;
  service_type: ServiceType;
  location: string;
  phone: string;
  comment: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  telegram_message_id: number | null;
  call_result: CallResult | null;
  price_amount: number | null;
  scheduled_at: string | null;
  reminder_type: ReminderType | null;
  reminder_at: string | null;
  new_lead_reminder_count: number;
};

type PhotoRow = {
  id: number;
  lead_id: number;
  file_name: string;
  file_path: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

export class LeadService {
  constructor(
    private readonly db: Database.Database,
    private readonly now: () => Date = () => new Date()
  ) {}

  createLead(input: CreateLeadInput, photos: CreateLeadPhotoInput[]): { lead: Lead; photos: LeadPhoto[] } {
    const now = this.now().toISOString();
    const reminderAt = addMinutes(now, 10);

    const create = this.db.transaction(() => {
      const result = this.db
        .prepare(
          `INSERT INTO leads (
             service_type, location, phone, comment, status, created_at, updated_at, reminder_type, reminder_at
           )
           VALUES (?, ?, ?, ?, 'new', ?, ?, 'new_first', ?)`
        )
        .run(input.serviceType, input.location, input.phone, input.comment || null, now, now, reminderAt);

      const leadId = Number(result.lastInsertRowid);
      const insertPhoto = this.db.prepare(
        `INSERT INTO lead_photos (lead_id, file_name, file_path, mime_type, size_bytes, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      );

      for (const photo of photos) {
        insertPhoto.run(leadId, photo.fileName, photo.filePath, photo.mimeType, photo.sizeBytes, now);
      }

      return leadId;
    });

    const leadId = create();
    const lead = this.getLead(leadId);

    if (!lead) {
      throw new Error(`Lead #${leadId} was not created`);
    }

    return {
      lead,
      photos: this.getLeadPhotos(leadId)
    };
  }

  getLead(id: number): Lead | null {
    const row = this.db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as LeadRow | undefined;
    return row ? mapLead(row) : null;
  }

  getLeadPhotos(leadId: number): LeadPhoto[] {
    const rows = this.db
      .prepare("SELECT * FROM lead_photos WHERE lead_id = ? ORDER BY id ASC")
      .all(leadId) as PhotoRow[];

    return rows.map(mapPhoto);
  }

  listRecent(limit = 10): Lead[] {
    const rows = this.db
      .prepare("SELECT * FROM leads ORDER BY id DESC LIMIT ?")
      .all(limit) as LeadRow[];

    return rows.map(mapLead);
  }

  listByStatus(status: LeadStatus, limit = 10): Lead[] {
    const rows = this.db
      .prepare("SELECT * FROM leads WHERE status = ? ORDER BY id DESC LIMIT ?")
      .all(status, limit) as LeadRow[];

    return rows.map(mapLead);
  }

  updateStatus(id: number, status: LeadStatus): Lead | null {
    const now = this.now().toISOString();
    const clearsReminder = !["new", "unreached"].includes(status);
    this.db
      .prepare(
        `UPDATE leads
         SET status = ?, updated_at = ?,
             reminder_type = CASE WHEN ? THEN NULL ELSE reminder_type END,
             reminder_at = CASE WHEN ? THEN NULL ELSE reminder_at END
         WHERE id = ?`
      )
      .run(status, now, clearsReminder ? 1 : 0, clearsReminder ? 1 : 0, id);
    return this.getLead(id);
  }

  markReached(id: number): Lead | null {
    return this.updateWorkflowFields(id, {
      status: "taken",
      callResult: "reached",
      reminderType: null,
      reminderAt: null
    });
  }

  markUnreached(id: number): Lead | null {
    return this.updateWorkflowFields(id, {
      status: "unreached",
      callResult: "unreached",
      reminderType: "callback",
      reminderAt: addMinutes(this.now().toISOString(), 60)
    });
  }

  setPrice(id: number, priceAmount: number): Lead | null {
    if (!Number.isInteger(priceAmount) || priceAmount <= 0) {
      return null;
    }

    return this.updateWorkflowFields(id, { status: "price_sent", priceAmount });
  }

  scheduleVisit(id: number, scheduledAt: string): Lead | null {
    return this.updateWorkflowFields(id, {
      status: "scheduled",
      scheduledAt,
      reminderType: null,
      reminderAt: null
    });
  }

  listDueReminders(): Lead[] {
    const rows = this.db
      .prepare("SELECT * FROM leads WHERE reminder_at IS NOT NULL AND reminder_at <= ? ORDER BY reminder_at ASC")
      .all(this.now().toISOString()) as LeadRow[];

    return rows.map(mapLead);
  }

  advanceReminder(id: number): Lead | null {
    const lead = this.getLead(id);
    if (!lead?.reminderType) {
      return lead;
    }

    if (lead.reminderType === "new_first" && lead.status === "new") {
      return this.updateWorkflowFields(id, {
        reminderType: "new_second",
        reminderAt: addMinutes(this.now().toISOString(), 30),
        newLeadReminderCount: 1
      });
    }

    if (lead.reminderType === "new_second" && lead.status === "new") {
      return this.updateWorkflowFields(id, {
        reminderType: null,
        reminderAt: null,
        newLeadReminderCount: 2
      });
    }

    return this.updateWorkflowFields(id, { reminderType: null, reminderAt: null });
  }

  clearReminder(id: number): Lead | null {
    return this.updateWorkflowFields(id, { reminderType: null, reminderAt: null });
  }

  setTelegramMessageId(id: number, messageId: number): void {
    this.db.prepare("UPDATE leads SET telegram_message_id = ?, updated_at = ? WHERE id = ?").run(
      messageId,
      this.now().toISOString(),
      id
    );
  }

  private updateWorkflowFields(
    id: number,
    fields: {
      status?: LeadStatus;
      callResult?: CallResult | null;
      priceAmount?: number | null;
      scheduledAt?: string | null;
      reminderType?: ReminderType | null;
      reminderAt?: string | null;
      newLeadReminderCount?: number;
    }
  ): Lead | null {
    const entries = Object.entries(fields);
    if (entries.length === 0) {
      return this.getLead(id);
    }

    const columnNames: Record<string, string> = {
      status: "status",
      callResult: "call_result",
      priceAmount: "price_amount",
      scheduledAt: "scheduled_at",
      reminderType: "reminder_type",
      reminderAt: "reminder_at",
      newLeadReminderCount: "new_lead_reminder_count"
    };
    const assignments = entries.map(([key]) => `${columnNames[key]} = ?`);
    const values = entries.map(([, value]) => value);
    this.db
      .prepare(`UPDATE leads SET ${assignments.join(", ")}, updated_at = ? WHERE id = ?`)
      .run(...values, this.now().toISOString(), id);
    return this.getLead(id);
  }
}

function mapLead(row: LeadRow): Lead {
  return {
    id: row.id,
    serviceType: row.service_type,
    location: row.location,
    phone: row.phone,
    comment: row.comment,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    telegramMessageId: row.telegram_message_id,
    callResult: row.call_result,
    priceAmount: row.price_amount,
    scheduledAt: row.scheduled_at,
    reminderType: row.reminder_type,
    reminderAt: row.reminder_at,
    newLeadReminderCount: row.new_lead_reminder_count
  };
}

function addMinutes(isoDate: string, minutes: number): string {
  return new Date(new Date(isoDate).getTime() + minutes * 60_000).toISOString();
}

function mapPhoto(row: PhotoRow): LeadPhoto {
  return {
    id: row.id,
    leadId: row.lead_id,
    fileName: row.file_name,
    filePath: row.file_path,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at
  };
}
