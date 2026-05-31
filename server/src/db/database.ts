import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { initializeSchema } from "./schema.js";

export function createDatabase(databasePath: string): Database.Database {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new Database(databasePath);
  initializeSchema(db);
  return db;
}
