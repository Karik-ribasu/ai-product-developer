import { beginStubSession } from "./stub-session";

import styles from "./login.module.css";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const showStubDisclaimer = process.env.STITCH_BASELINE_UI !== "1";

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.brandBlock}>
          <h1 className={styles.brand}>Klockwork Neo</h1>
          <p className={styles.tagline}>Stay Bold. Stay Organized.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardGlow} aria-hidden>
            <span className={`material-symbols-outlined ${styles.cardGlowIcon}`}>auto_awesome</span>
          </div>
          <div className={styles.cardInner}>
            <h2 className={styles.title}>Welcome back.</h2>

            <div className={styles.stack}>
              <button type="button" className={styles.provider}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className={styles.providerIcon}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuASxLzY47LAT7TvFWIwmuruqnaUkSuu23igMFKkihnf3s_xqM54HsUx9hNKh69GSKHHIOJXaioIzXT0T0E-7WjxNbN2LVJpV_SmRTzEFEOy0cvat65OsuVmKZBeBhpxIxFTq7x1u18DWyCHFwIsYVPwlnMizDB3mEysrE6Z4aN8HotoZbRUGGxyzYGEqsmaZhJ90Jy5umVWaAFhSAAsb9t-KgzpuFS1nyUWES3PLJycy9k_SmuTK68r_V1QNVtaIBa0y5VkIEhP-QM"
                />
                Continue with Google
              </button>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerLabel}>OR EMAIL</span>
                <span className={styles.dividerLine} />
              </div>

              <form className={styles.form} action={beginStubSession}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Account Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    className={styles.input}
                    type="email"
                    autoComplete="username"
                    placeholder="curator@neo.work"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="password">
                    Security Key
                  </label>
                  <input
                    id="password"
                    name="password"
                    className={styles.input}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                </div>
                <button className={styles.primaryCta} type="submit">
                  Enter Workspace
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className={styles.postCard}>
          <p className={styles.footerNote}>
            New to the platform?{" "}
            <a className={styles.inlineLink} href="#">
              Sign Up
            </a>
          </p>
          <div className={styles.legalRow}>
            <a className={styles.legalLink} href="#">
              Privacy Protocol
            </a>
            <span className={styles.legalDot} aria-hidden />
            <a className={styles.legalLink} href="#">
              System Status
            </a>
          </div>
        </div>

        {showStubDisclaimer ? (
          <p className={styles.stubDisclaimer}>
            MVP stub authentication only — no real OAuth. Submitting the form sets the <code>stub-auth</code> cookie and
            sends you to the dashboard. The seeded workspace persona is <strong>Stub User (QA)</strong> (see{" "}
            <code>prisma/seed.ts</code>).
          </p>
        ) : null}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTile}>
          <span className={`material-symbols-outlined ${styles.footerIcon}`}>verified_user</span>
          <div>
            <p className={styles.footerKicker}>Security</p>
            <p className={styles.footerTitle}>End-to-end Curated</p>
          </div>
        </div>
        <div className={styles.footerTile}>
          <span className={`material-symbols-outlined ${styles.footerIconSecondary}`}>speed</span>
          <div>
            <p className={styles.footerKicker}>Performance</p>
            <p className={styles.footerTitle}>Zero Latency Focus</p>
          </div>
        </div>
        <div className={styles.footerTile}>
          <span className={`material-symbols-outlined ${styles.footerIconPrimary}`}>grid_view</span>
          <div>
            <p className={styles.footerKicker}>Interface</p>
            <p className={styles.footerTitle}>Neubrutalist Modular</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
