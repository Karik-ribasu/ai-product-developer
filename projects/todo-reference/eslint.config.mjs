import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const coreLayersRestriction = {
  "no-restricted-imports": [
    "error",
    {
      paths: [
        {
          name: "react",
          message:
            "Keep domain/application free of React; compose UI only under src/app and src/components.",
        },
        {
          name: "react-dom",
          message:
            "Keep domain/application free of React DOM; compose UI only under src/app and src/components.",
        },
        {
          name: "next",
          message:
            "Keep domain/application free of Next.js; use src/app and infrastructure adapters at the edge.",
        },
      ],
      patterns: [
        {
          group: ["next/*"],
          message:
            "Keep domain/application free of Next.js; use src/app and infrastructure adapters at the edge.",
        },
        {
          group: ["better-sqlite3", "sqlite3", "sql.js"],
          message:
            "SQLite and drivers belong in src/infrastructure, not domain/application.",
        },
        {
          group: ["@prisma/client", "@prisma/*"],
          message:
            "Prisma Client belongs in src/infrastructure (adapters), not domain/application.",
        },
      ],
    },
  ],
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/domain/**/*.ts"],
    rules: coreLayersRestriction,
  },
  {
    files: ["src/application/**/*.ts"],
    rules: coreLayersRestriction,
  },
];

export default eslintConfig;
