import { PrismaClient } from "@prisma/client";

const STUB_USER_ID = "10000000-0000-4000-8000-000000000001";

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required to run prisma seed");
  }
  return url;
}

async function main(): Promise<void> {
  const prisma = new PrismaClient({
    datasources: { db: { url: requireDatabaseUrl() } },
  });

  try {
    await prisma.stubUser.upsert({
      where: { id: STUB_USER_ID },
      create: { id: STUB_USER_ID, displayName: "Stub User (QA)" },
      update: { displayName: "Stub User (QA)" },
    });

    await prisma.activityFeedItem.upsert({
      where: { id: "feed-1" },
      create: {
        id: "feed-1",
        authorName: "Alex Rivera",
        authorHandle: "@arivera",
        body: "Shipped the curator dashboard slice — typography finally matches the Stitch reference.",
        occurredAt: new Date("2026-04-18T10:15:00.000Z"),
        mediaLabel: null,
      },
      update: {
        authorName: "Alex Rivera",
        authorHandle: "@arivera",
        body: "Shipped the curator dashboard slice — typography finally matches the Stitch reference.",
        occurredAt: new Date("2026-04-18T10:15:00.000Z"),
        mediaLabel: null,
      },
    });

    await prisma.activityFeedItem.upsert({
      where: { id: "feed-2" },
      create: {
        id: "feed-2",
        authorName: "Jamie Chen",
        authorHandle: "@jamiecodes",
        body: "Activity feed is API-backed — deterministic seed for QA baselines.",
        occurredAt: new Date("2026-04-18T11:02:00.000Z"),
        mediaLabel: "Note",
      },
      update: {
        authorName: "Jamie Chen",
        authorHandle: "@jamiecodes",
        body: "Activity feed is API-backed — deterministic seed for QA baselines.",
        occurredAt: new Date("2026-04-18T11:02:00.000Z"),
        mediaLabel: "Note",
      },
    });

    const starterTodos: Array<{
      id: string;
      content: string;
      completed: boolean;
      createdAt: Date;
      updatedAt: Date;
    }> = [
      {
        id: "20000000-0000-4000-8000-000000000001",
        content: "Review Stitch dashboard spacing against ui_spec.json",
        completed: false,
        createdAt: new Date("2026-04-18T09:00:00.000Z"),
        updatedAt: new Date("2026-04-18T09:00:00.000Z"),
      },
      {
        id: "20000000-0000-4000-8000-000000000002",
        content: "Wire todos + activity feed to HTTP JSON API",
        completed: true,
        createdAt: new Date("2026-04-18T09:30:00.000Z"),
        updatedAt: new Date("2026-04-18T09:45:00.000Z"),
      },
    ];

    for (const row of starterTodos) {
      await prisma.todo.upsert({
        where: { id: row.id },
        create: row,
        update: {
          content: row.content,
          completed: row.completed,
          updatedAt: row.updatedAt,
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
