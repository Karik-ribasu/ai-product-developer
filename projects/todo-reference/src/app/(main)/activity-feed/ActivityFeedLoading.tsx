import styles from "./feed.module.css";

export function ActivityFeedLoading() {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Loading activity feed">
      <div className={styles.timeline}>
        <div className={styles.featured} style={{ opacity: 0.65 }}>
          <div
            className={styles.featuredVisual}
            style={{ minHeight: "12rem", background: "rgba(0, 0, 0, 0.06)" }}
          />
          <div className={styles.featuredBody}>
            <div className={styles.featuredTop}>
              <span className={styles.pill}>Loading…</span>
            </div>
            <h2 className={styles.featuredHeading}>Fetching community posts…</h2>
            <p className={styles.featuredText}>Hang tight while we load the PostgreSQL-backed feed.</p>
          </div>
        </div>
        <div className={styles.cardGrid}>
          {[1, 2, 3].map((k) => (
            <div key={k} className={styles.card} style={{ opacity: 0.5 }}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar} aria-hidden />
                <div>
                  <p className={styles.author}>…</p>
                  <p className={styles.meta}>…</p>
                </div>
              </div>
              <h3 className={styles.cardTitle}>…</h3>
            </div>
          ))}
        </div>
      </div>
      <aside className={styles.side} aria-hidden>
        <div className={styles.leader} style={{ opacity: 0.4 }}>
          <p className={styles.leaderKicker}>…</p>
        </div>
      </aside>
    </div>
  );
}
