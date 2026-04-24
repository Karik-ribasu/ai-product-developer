FROM oven/bun:1 AS builder

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./
# prisma/schema.prisma must exist before `postinstall` → `prisma generate`
COPY prisma ./prisma
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM node:22-bookworm-slim AS runner

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package.json /app/bun.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/fixtures ./src/fixtures
COPY --from=builder /app/next.config.ts ./next.config.ts

RUN npm rebuild better-sqlite3

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
