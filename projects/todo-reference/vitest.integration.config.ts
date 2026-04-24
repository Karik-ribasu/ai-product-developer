import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(root, "src"),
    },
  },
  test: {
    environment: "node",
    fileParallelism: false,
    maxConcurrency: 1,
    include: ["tests/integration/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage/integration",
      include: [
        "src/infrastructure/**/*.ts",
        "src/lib/server/**/*.ts",
        "src/app/**/actions.ts",
        "src/app/todo-action-contract.ts",
        "src/app/api/**/route.ts",
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.test.ts",
        "**/node_modules/**",
        "src/lib/server/app-origin.ts",
      ],
      all: true,
      thresholds: {
        lines: 100,
      },
    },
  },
});
