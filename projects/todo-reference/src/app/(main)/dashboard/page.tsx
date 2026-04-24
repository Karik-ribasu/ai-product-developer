import { DashboardStitchBaseline } from "@/components/baseline/DashboardStitchBaseline";
import { TodoWorkspace } from "@/components/ui/organisms/TodoWorkspace";
import { getInternalAppOrigin } from "@/lib/server/app-origin";
import { todoListResultFromFetchResponse } from "@/lib/todo-api-response";

import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

const TEAM_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCbZ__KaYlxddEMy6MGzuZenezCVuBjs14KEOPixwWJlvqrBgljNtvCU5KU9GuNc_AAzDjHZHt4moJMZjoH-x8aZ6WJgERTtJZulr12cVYWLTP6_O40Wzt0CY9Ul4Hu-W9coNB-0NWwZcRjV-FQoARLM21Nbw2qae40VTX_uC2mwfqGyXarZx11-W7m0eGB_nUrjAHUdjozuZt8SC_0gsent3QUPkHXchVYnx2HieL5EF2_wc2SewG2-2gjOqagBpr5IvbqqgAfH_U";

const TEAM_IMG_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDLxHVwtQ2z8W9dhtogUi9kJKF_ctXifTOR-2mspmKnKGPscYY3SAlhusSl0qSl4xZVGfd40TP0MHzVIVH7J85ZQca36UPU9qWgbdr2TnDloa6WLARsv1Re7GhjByXvk4HJa459tEla9n60ReAChLdQgltx3ImMORi4wv1wEycJiBRSEAW5kavEHB69JcAKcUDIWFNob3SsvMEd7rU64Q-QTCUoAOM7WCvg-iVvcIrviyzUHeDE7DpYvMjqq319ZQl5FmMWtsBgdWE";

const INSPIRATION_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHmeHpWsWDYdftFOuA_Nn92C4YypjslGTWJePDwtp2SpnNCHOj6kFJ-yIs0SPGdKqdWSFgNDMw-zNA_OcHk6XCfRlbtDoZQT-3lj6bRgkVAplUMTqzEhpGfoZuwfFseKHf3tx0EvWnOAqcT-DrmO96pT6BPz_qDLfdCqy4CR8Ima8AY_8f1-QOvptGewAUFupidBZVJAIhTPb89beIL7HirDOucwhTSmOeWNwQI1ZK6V4K-yAFGmk-NT41P_8U2i0TtXYq37LQGjw";

async function loadTodosFromHttpApi() {
  const origin = getInternalAppOrigin();
  const res = await fetch(`${origin}/api/todos`, { cache: "no-store" });
  return todoListResultFromFetchResponse(res);
}

export default async function DashboardPage() {
  if (process.env.STITCH_BASELINE_UI === "1") {
    return <DashboardStitchBaseline />;
  }

  const listResult = await loadTodosFromHttpApi();
  const todos = listResult.ok ? listResult.data : [];
  const pending = todos.filter((t) => !t.completed).length;
  const today = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(
    new Date(),
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="dashboard-hero-title">
        <h1 id="dashboard-hero-title" className={styles.heroTitle}>
          Today&apos;s <span className={styles.heroAccent}>Edit.</span>
        </h1>
        <div className={styles.badges}>
          <span className={styles.badgeSecondary}>{today}</span>
          <span className={styles.badgeTertiary}>
            {pending} Task{pending === 1 ? "" : "s"} Pending
          </span>
        </div>
      </section>

      <div className={styles.grid}>
        <div className={styles.colMain}>
          <div className={styles.priorities}>
            <div className={styles.prioritiesHeader}>
              <h2 className={styles.prioritiesTitle}>Top Priorities</h2>
              <button type="button" className={styles.addDecor} aria-hidden tabIndex={-1}>
                ⊕
              </button>
            </div>
            {listResult.ok ? (
              <TodoWorkspace embedded initialListError={null} initialTodos={listResult.data} />
            ) : (
              <TodoWorkspace embedded initialListError={listResult.error} initialTodos={[]} />
            )}
          </div>

          <div className={styles.subGrid}>
            <div className={styles.focusCard}>
              <h3 className={styles.focusTitle}>Focus Mode</h3>
              <p className={styles.focusBody}>
                Deep work session: UI Refinement. Silence all notifications for 90 minutes.
              </p>
              <button type="button" className={styles.focusCta}>
                Start Timer
              </button>
            </div>
            <div className={styles.captureCard}>
              <h3 className={styles.focusTitle}>Quick Capture</h3>
              <label className="visually-hidden" htmlFor="quick-capture">
                Quick capture
              </label>
              <textarea
                id="quick-capture"
                className={styles.captureArea}
                placeholder="Type a thought..."
                readOnly
              />
            </div>
          </div>
        </div>

        <aside className={styles.colAside} aria-label="Highlights">
          <div className={styles.categoryCard}>
            <span className={styles.categoryGlyph} aria-hidden>
              💼
            </span>
            <h2 className={styles.categoryTitle}>Work</h2>
            <p className={styles.categoryMeta}>8 active projects</p>
            <div className={styles.avatarRow}>
              <div className={styles.avatarTile}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={TEAM_IMG} />
              </div>
              <div className={styles.avatarTile}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={TEAM_IMG_2} />
              </div>
              <div className={styles.moreTile} aria-hidden>
                +4
              </div>
            </div>
          </div>

          <div className={styles.personalCard}>
            <span className={styles.personalGlyph} aria-hidden>
              ♥
            </span>
            <h2 className={styles.categoryTitle}>Personal</h2>
            <p className={styles.categoryMeta}>4 tasks left</p>
            <div className={styles.barTrack}>
              <div className={styles.barFill} />
            </div>
          </div>

          <div className={styles.visualCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={INSPIRATION_IMG} />
            <div className={styles.visualCaption}>Inspiration of the Day</div>
          </div>

          <div className={styles.statsCard}>
            <h3 className={styles.statsHeading}>Productivity</h3>
            <div className={styles.chart} aria-hidden>
              <div className={styles.chartBar} style={{ height: "50%" }} />
              <div className={styles.chartBar} style={{ height: "75%" }} />
              <div className={styles.chartBar} style={{ height: "100%" }} />
              <div className={styles.chartBar} style={{ height: "66%" }} />
              <div className={styles.chartBar} style={{ height: "80%" }} />
            </div>
            <p className={styles.chartNote}>UP 12% FROM LAST WEEK</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
