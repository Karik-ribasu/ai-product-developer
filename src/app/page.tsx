import { DashboardPageClient } from "@/components/ui/organisms/dashboard-page-client";

/**
 * MVP primary surface (`mvp-primary-dashboard` per ui_spec). Data loads client-side
 * so `next build` does not execute the Bun-only SQLite stack during static generation.
 */
export default function Home() {
  return <DashboardPageClient />;
}
