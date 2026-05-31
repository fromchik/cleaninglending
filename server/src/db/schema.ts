import type Database from "better-sqlite3";

export function initializeSchema(db: Database.Database): void {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_type TEXT NOT NULL,
      location TEXT NOT NULL,
      phone TEXT NOT NULL,
      comment TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      telegram_message_id INTEGER,
      call_result TEXT,
      price_amount INTEGER,
      scheduled_at TEXT,
      reminder_type TEXT,
      reminder_at TEXT,
      new_lead_reminder_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS lead_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );
  `);

  addColumnIfMissing(db, "leads", "call_result", "TEXT");
  addColumnIfMissing(db, "leads", "price_amount", "INTEGER");
  addColumnIfMissing(db, "leads", "scheduled_at", "TEXT");
  addColumnIfMissing(db, "leads", "reminder_type", "TEXT");
  addColumnIfMissing(db, "leads", "reminder_at", "TEXT");
  addColumnIfMissing(db, "leads", "new_lead_reminder_count", "INTEGER NOT NULL DEFAULT 0");
  db.exec("CREATE INDEX IF NOT EXISTS idx_leads_due_reminders ON leads (reminder_at)");
}

function addColumnIfMissing(db: Database.Database, table: string, column: string, definition: string): void {
  const columns = db.pragma(`table_info(${table})`) as Array<{ name: string }>;
  if (!columns.some((existing) => existing.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}
