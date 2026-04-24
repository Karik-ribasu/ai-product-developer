import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { DELETE, PATCH } from "@/app/api/todos/[id]/route";
import { GET, POST } from "@/app/api/todos/route";

import { deleteAllTodos } from "./db-test-utils";

describe("todos HTTP API (integration)", () => {
  const prevDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    await deleteAllTodos();
  });

  afterEach(() => {
    if (prevDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = prevDatabaseUrl;
    }
  });

  it("lists and creates todos", async () => {
    const empty = await GET();
    expect(empty.status).toBe(200);
    expect(await empty.json()).toEqual([]);

    const created = await POST(
      new Request("http://localhost/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "api-todo" }),
      }),
    );
    expect(created.status).toBe(201);
    const createdBody = await created.json();
    expect(createdBody.content).toBe("api-todo");

    const listed = await GET();
    expect(listed.status).toBe(200);
    const listedBody = await listed.json();
    expect(listedBody).toHaveLength(1);
    expect(listedBody[0].id).toBe(createdBody.id);
  });

  it("returns 500 when DATABASE_URL is missing", async () => {
    const prev = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    const res = await GET();
    expect(res.status).toBe(500);
    process.env.DATABASE_URL = prev;
  });

  it("rejects invalid JSON on create", async () => {
    const res = await POST(
      new Request("http://localhost/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{not-json",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("maps validation errors on create", async () => {
    const res = await POST(
      new Request("http://localhost/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "  " }),
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("validation");
  });

  it("maps infrastructure errors on create", async () => {
    const prev = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    const res = await POST(
      new Request("http://localhost/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "ok" }),
      }),
    );
    expect(res.status).toBe(500);
    process.env.DATABASE_URL = prev;
  });

  it("updates content, toggles completion, and deletes", async () => {
    const created = await POST(
      new Request("http://localhost/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "one" }),
      }),
    );
    const { id } = (await created.json()) as { id: string };

    const patchedContent = await PATCH(
      new Request("http://localhost/api/todos/x", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "two" }),
      }),
      { params: Promise.resolve({ id }) },
    );
    expect(patchedContent.status).toBe(200);
    expect((await patchedContent.json()).content).toBe("two");

    const patchedToggle = await PATCH(
      new Request("http://localhost/api/todos/x", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleCompleted: true }),
      }),
      { params: Promise.resolve({ id }) },
    );
    expect(patchedToggle.status).toBe(200);
    expect((await patchedToggle.json()).completed).toBe(true);

    const deleted = await DELETE(
      new Request("http://localhost/api/todos/x", { method: "DELETE" }),
      { params: Promise.resolve({ id }) },
    );
    expect(deleted.status).toBe(204);
  });

  it("rejects invalid JSON on patch", async () => {
    const res = await PATCH(
      new Request("http://localhost/api/todos/x", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: "{",
      }),
      { params: Promise.resolve({ id: randomUUID() }) },
    );
    expect(res.status).toBe(400);
  });

  it("maps validation, not-found, and empty patch failures", async () => {
    const emptyPatch = await PATCH(
      new Request("http://localhost/api/todos/x", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
      { params: Promise.resolve({ id: randomUUID() }) },
    );
    expect(emptyPatch.status).toBe(400);

    const missingId = "00000000-0000-0000-0000-000000000000";
    const missingToggle = await PATCH(
      new Request("http://localhost/api/todos/x", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleCompleted: true }),
      }),
      { params: Promise.resolve({ id: missingId }) },
    );
    expect(missingToggle.status).toBe(404);

    const missingDelete = await DELETE(
      new Request("http://localhost/api/todos/x", { method: "DELETE" }),
      { params: Promise.resolve({ id: missingId }) },
    );
    expect(missingDelete.status).toBe(404);
  });
});
