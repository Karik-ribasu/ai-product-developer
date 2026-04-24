import { Suspense } from "react";

import { ActivityFeedStitchBaseline } from "@/components/baseline/ActivityFeedStitchBaseline";

import { ActivityFeedContent } from "./ActivityFeedContent";
import { ActivityFeedLoading } from "./ActivityFeedLoading";

import styles from "./feed.module.css";

export const dynamic = "force-dynamic";

export default function ActivityFeedPage() {
  if (process.env.STITCH_BASELINE_UI === "1") {
    return <ActivityFeedStitchBaseline />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>— Social Pulse</p>
          <h1 className={styles.title}>Community Flow.</h1>
        </div>
        <div className={styles.filters} aria-label="Feed filters">
          <span className={styles.chip}>Teams</span>
          <span className={styles.chipMuted}>Friends</span>
        </div>
      </header>

      <Suspense fallback={<ActivityFeedLoading />}>
        <ActivityFeedContent />
      </Suspense>

      <button type="button" className={styles.fab} aria-label="Create">
        +
      </button>
    </div>
  );
}
