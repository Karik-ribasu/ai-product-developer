import { getInternalAppOrigin } from "@/lib/server/app-origin";

import styles from "./feed.module.css";

export type ActivityFeedItem = {
  id: string;
  author: { name: string; handle: string };
  body: string;
  createdAt: string;
  mediaLabel: string | null;
};

export type ActivityFeedPayload = {
  version: number;
  items: ActivityFeedItem[];
};

const FEATURED_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAMhvh2w9whYDGyZMjWVaMITKfKs26FfWy3weFZ0_twGGgzbEr-yY4Fzfyn6MSJ-3TYXf0fhrFjpYEdJEScFnvemQSRNhbiCYGEe1hwHd7UzJp1wtAZG-PYzJfmd8VlOG6xcwvj-YwLbUKQe5L_KkH6FL3qCFH4WzgZ52tTo8tYEIG99LbJAogi-Sc6awnFwNzKfvw2HIHdF34kjAfcjZbGbAZrtU6o285fNf6zmOz0DREoXxtPdXKv8UP3T9ZbEpZVp5V2mzxica8";

async function loadFeed(): Promise<
  { ok: true; data: ActivityFeedPayload } | { ok: false; status: number; message: string }
> {
  const origin = getInternalAppOrigin();
  const res = await fetch(`${origin}/api/activity-feed`, { cache: "no-store" });
  if (!res.ok) {
    let message = "Feed request failed";
    try {
      const body = (await res.json()) as { error?: unknown };
      if (body && typeof body.error === "string") {
        message = body.error;
      }
    } catch {
      /* ignore */
    }
    return { ok: false, status: res.status, message };
  }
  const data = (await res.json()) as ActivityFeedPayload;
  return { ok: true, data };
}

function formatRelative(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const delta = Date.now() - t;
  const hours = Math.floor(delta / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString();
}

export async function ActivityFeedContent() {
  const result = await loadFeed();

  return (
    <>
      {!result.ok ? (
        <section className={styles.errorPanel} aria-live="polite">
          <h2 className={styles.errorTitle}>Could not load the feed</h2>
          <p className={styles.meta} style={{ opacity: 0.75, fontSize: "0.95rem" }}>
            The server returned status {result.status} ({result.message}). Check that PostgreSQL is running,
            migrations are applied, and the app logs for details.
          </p>
          <a className={styles.retry} href="/activity-feed">
            Retry
          </a>
        </section>
      ) : result.data.items.length === 0 ? (
        <section className={styles.errorPanel} aria-label="Empty feed">
          <h2 className={styles.errorTitle}>No posts yet</h2>
          <p className={styles.meta} style={{ opacity: 0.75, fontSize: "0.95rem" }}>
            The activity feed has no rows yet. Run <code>bun run db:seed</code> (or add items via your admin path) so
            PostgreSQL-backed entries appear here.
          </p>
        </section>
      ) : (
        <div className={styles.grid}>
          <div className={styles.timeline}>
            <article className={styles.featured} aria-label="Featured post">
              <div className={styles.featuredVisual}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={FEATURED_IMG} />
              </div>
              <div className={styles.featuredBody}>
                <div>
                  <div className={styles.featuredTop}>
                    <span className={styles.pill}>Milestone reached</span>
                    <span className={styles.time}>{formatRelative(result.data.items[0].createdAt)}</span>
                  </div>
                  <h2 className={styles.featuredHeading}>{result.data.items[0].body}</h2>
                  <p className={styles.featuredText}>
                    {result.data.items[0].author.name} · {result.data.items[0].author.handle}
                  </p>
                </div>
                <div>
                  <div className={styles.progress} aria-hidden>
                    <div className={styles.progressFill} />
                    <span className={styles.progressLabel}>80%</span>
                  </div>
                </div>
              </div>
            </article>

            <div className={styles.cardGrid}>
              {result.data.items.slice(1).map((item) => (
                <article key={item.id} className={styles.card} aria-label={`Post by ${item.author.name}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.avatar} aria-hidden />
                    <div>
                      <p className={styles.author}>{item.author.name}</p>
                      <p className={styles.meta}>{formatRelative(item.createdAt)}</p>
                    </div>
                  </div>
                  <h3 className={styles.cardTitle}>{item.body}</h3>
                  {item.mediaLabel ? (
                    <div className={styles.tagRow}>
                      <span className={styles.tag}>{item.mediaLabel}</span>
                    </div>
                  ) : null}
                  <button type="button" className={styles.cta}>
                    Congratulate
                  </button>
                </article>
              ))}
              <article className={styles.cardAccent} aria-label="System insight">
                <div className={styles.cardHeader}>
                  <span aria-hidden style={{ fontSize: "2rem" }}>
                    ✦
                  </span>
                  <div>
                    <p className={styles.author}>System Insight</p>
                    <p className={styles.meta}>15 min ago</p>
                  </div>
                </div>
                <h3 className={styles.cardTitle}>The “Deep Work” circle has been active for 4 hours.</h3>
              </article>
            </div>
          </div>

          <aside className={styles.side} aria-label="Feed sidebar">
            <div className={styles.leader}>
              <p className={styles.leaderKicker}>Global Leaderboard</p>
              <div className={styles.leaderRank}>
                <span className={styles.rank}>#04</span>
                <span className={styles.rankSuffix}>/ 120</span>
              </div>
              <p className={styles.leaderQuote}>“You are in the top 5% of curators this week. Stay bold.”</p>
            </div>

            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Active Curators</h2>
              <ul className={styles.list}>
                <li className={styles.listRow}>
                  <div className={styles.listLeft}>
                    <div className={styles.listAvatar} aria-hidden />
                    <p className={styles.listName}>Elena Vance</p>
                  </div>
                  <span className={styles.dot} aria-hidden />
                </li>
                <li className={styles.listRow}>
                  <div className={styles.listLeft}>
                    <div className={styles.listAvatar} aria-hidden />
                    <p className={styles.listName}>Julian K.</p>
                  </div>
                  <span className={styles.dot} aria-hidden />
                </li>
                <li className={styles.listRow}>
                  <div className={styles.listLeft}>
                    <div className={styles.listAvatar} aria-hidden />
                    <p className={styles.listName}>Aria Montgomery</p>
                  </div>
                  <span className={styles.dotMuted} aria-hidden />
                </li>
              </ul>
              <button type="button" className={styles.panelCta}>
                Find more curators
              </button>
            </div>

            <div className={styles.pro}>
              <div className={styles.proAccent} aria-hidden />
              <div className={styles.proInner}>
                <h2 className={styles.proTitle}>Go Pro.</h2>
                <p className={styles.proBody}>Unlock team analytics and advanced curation tools.</p>
                <a className={styles.proLink} href="#">
                  Upgrade Identity
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
