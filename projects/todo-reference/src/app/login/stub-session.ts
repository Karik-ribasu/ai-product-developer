"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { STUB_AUTH_COOKIE_NAME } from "@/lib/stub-auth/constants";

export async function beginStubSession(): Promise<void> {
  const jar = await cookies();
  jar.set(STUB_AUTH_COOKIE_NAME, "1", { httpOnly: true, sameSite: "lax", path: "/" });
  redirect("/dashboard");
}
