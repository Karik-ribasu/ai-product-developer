import styles from "./dashboard.module.css";

export default function DashboardLoading() {
  return (
    <div className={styles.page} aria-busy="true" aria-label="Loading dashboard">
      <section className={styles.hero} aria-labelledby="dashboard-loading-title">
        <h1 id="dashboard-loading-title" className={styles.heroTitle}>
          Loading workspace…
        </h1>
        <div className={styles.badges}>
          <span className={styles.badgeSecondary}>Todos</span>
          <span className={styles.badgeTertiary}>Fetching from API</span>
        </div>
      </section>
      <div className={styles.grid}>
        <div className={styles.colMain}>
          <div className={styles.priorities}>
            <div className={styles.prioritiesHeader}>
              <h2 className={styles.prioritiesTitle}>Top Priorities</h2>
            </div>
            <p style={{ opacity: 0.7, fontFamily: "var(--font-sans)" }}>Loading todo list from /api/todos…</p>
          </div>
        </div>
        <aside className={styles.colAside} aria-hidden style={{ opacity: 0.45 }} />
      </div>
    </div>
  );
}
