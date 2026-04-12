import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dir, "..");
const examplePath = join(repoRoot, ".env.example");
const localPath = join(repoRoot, ".env.local");

if (!existsSync(examplePath)) {
  console.error("bootstrap-env-local: missing .env.example at repo root.");
  process.exit(1);
}

if (existsSync(localPath)) {
  console.log("bootstrap-env-local: .env.local already exists; leaving it unchanged.");
  process.exit(0);
}

copyFileSync(examplePath, localPath);
console.log("bootstrap-env-local: created .env.local from .env.example (gitignored, not for commit).");
