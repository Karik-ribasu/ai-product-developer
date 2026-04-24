-- CreateTable
CREATE TABLE "todos" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_feed_items" (
    "id" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "author_handle" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "media_label" TEXT,

    CONSTRAINT "activity_feed_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stub_users" (
    "id" UUID NOT NULL,
    "display_name" TEXT NOT NULL,

    CONSTRAINT "stub_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_feed_items_occurred_at_idx" ON "activity_feed_items"("occurred_at" DESC);
