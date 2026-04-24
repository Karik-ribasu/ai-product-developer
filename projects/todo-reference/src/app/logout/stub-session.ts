"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { STUB_AUTH_COOKIE_NAME } from "@/lib/stub-auth/constants";

export async function endStubSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(STUB_AUTH_COOKIE_NAME);
  redirect("/login");
}
