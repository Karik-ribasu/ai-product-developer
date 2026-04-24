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
    include: ["tests/unit/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage/unit",
      include: [
        "src/domain/**/*.ts",
        "src/application/**/*.ts",
        "src/lib/server/todo-http.ts",
      ],
      exclude: ["**/*.d.ts", "**/*.test.ts", "**/node_modules/**"],
      all: true,
      thresholds: {
        lines: 100,
      },
    },
  },
});
