import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import Database from "better-sqlite3";

import { ensureTodoSchema } from "@/infrastructure/sqlite/bootstrap-schema";

export function openSqliteTodoDatabase(filePath: string): Database.Database {
  mkdirSync(dirname(filePath), { recursive: true });
  const db = new Database(filePath);
  ensureTodoSchema(db);
  return db;
}
