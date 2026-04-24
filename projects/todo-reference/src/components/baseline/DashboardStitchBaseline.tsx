import s from "./StitchDashboardBaseline.module.css";

const TEAM_A =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCbZ__KaYlxddEMy6MGzuZenezCVuBjs14KEOPixwWJlvqrBgljNtvCU5KU9GuNc_AAzDjHZHt4moJMZjoH-x8aZ6WJgERTtJZulr12cVYWLTP6_O40Wzt0CY9Ul4Hu-W9coNB-0NWwZcRjV-FQoARLM21Nbw2qae40VTX_uC2mwfqGyXarZx11-W7m0eGB_nUrjAHUdjozuZt8SC_0gsent3QUPkHXchVYnx2HieL5EF2_wc2SewG2-2gjOqagBpr5IvbqqgAfH_U";

const TEAM_B =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDLxHVwtQ2z8W9dhtogUi9kJKF_ctXifTOR-2mspmKnKGPscYY3SAlhusSl0qSl4xZVGfd40TP0MHzVIVH7J85ZQca36UPU9qWgbdr2TnDloa6WLARsv1Re7GhjByXvk4HJa459tEla9n60ReAChLdQgltx3ImMORi4wv1wEycJiBRSEAW5kavEHB69JcAKcUDIWFNob3SsvMEd7rU64Q-QTCUoAOM7WCvg-iVvcIrviyzUHeDE7DpYvMjqq319ZQl5FmMWtsBgdWE";

const INSPIRE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHmeHpWsWDYdftFOuA_Nn92C4YypjslGTWJePDwtp2SpnNCHOj6kFJ-yIs0SPGdKqdWSFgNDMw-zNA_OcHk6XCfRlbtDoZQT-3lj6bRgkVAplUMTqzEhpGfoZuwfFseKHf3tx0EvWnOAqcT-DrmO96pT6BPz_qDLfdCqy4CR8Ima8AY_8f1-QOvptGewAUFupidBZVJAIhTPb89beIL7HirDOucwhTSmOeWNwQI1ZK6V4K-yAFGmk-NT41P_8U2i0TtXYq37LQGjw";

const PROFILE_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA73z42QSSoHdfO2YLmi-Xubz9HwLEf0CxGhxRbmAhciy_Y_4i2vubZhVVCk2B4A6cQJIFcmm5-W8zVXK2ApFWpD4k4mrs_05oxl2UjWQkPjXKzzPOw8TiSAyUcYSO5O4wcnu5GAGjmq6Ot1vGiW38qY5tV_r9fftrP68hQZmaGgm3Hz5oL6pgfWbAMoRqdN169HyloNgIXW_dmvzFr9sik9ziqWl1iaciRTa1U8wcDFBg3Pxk6W-UFiaXOpKkyEa_WJfa-7wT0eOA";

/** Full viewport mirror of Stitch `11611814ea7a4a2881d76c0c95fd3066` for `STITCH_BASELINE_UI` §4.2 */
export function DashboardStitchBaseline() {
  return (
    <div className={s.shellRoot}>
      <header className={s.shellHeader}>
        <div className={s.shellHeaderLeft}>
          <span className={s.shellBrand}>Klockwork Neo</span>
          <div className={s.shellTopNav}>
            <nav className={s.shellTopNavInner} aria-label="Primary">
              <span className={s.shellTopNavActive}>Dashboard</span>
              <span className={s.shellTopNavLink}>Tasks</span>
              <span className={s.shellTopNavLink}>Activity</span>
            </nav>
          </div>
        </div>
        <div className={s.shellHeaderTools}>
          <div className={s.shellSearchWrap}>
            <input
              className={s.shellSearch}
              type="text"
              placeholder="Search tasks..."
              readOnly
              tabIndex={-1}
              aria-hidden
            />
          </div>
          <button type="button" className={s.shellIconBtn} aria-hidden tabIndex={-1}>
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button type="button" className={s.shellIconBtn} aria-hidden tabIndex={-1}>
            <span className="material-symbols-outlined">add_box</span>
          </button>
          <div className={s.shellAvatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={PROFILE_SRC} width={40} height={40} />
          </div>
        </div>
      </header>

      <div className={s.shellBody}>
        <aside className={s.shellAside} aria-label="Workspace">
          <div className={s.shellAsideTitle}>
            <h2 className={s.shellAsideHeading}>The Curator</h2>
            <p className={s.shellAsideTag}>Stay Bold.</p>
          </div>
          <nav className={s.shellSideNav}>
            <span className={s.shellSideActive}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </span>
            <span className={s.shellSideLink}>
              <span className="material-symbols-outlined">checklist</span>
              <span>Tasks</span>
            </span>
            <span className={s.shellSideLink}>
              <span className="material-symbols-outlined">rss_feed</span>
              <span>Activity</span>
            </span>
            <span className={s.shellSideLink}>
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </span>
          </nav>
          <div className={s.shellSidebarCta}>
            <button type="button" className={s.shellNewProject}>
              New Project
            </button>
          </div>
        </aside>

        <main className={s.shellMain}>
          <section className={s.hero} aria-labelledby="baseline-hero">
            <h1 id="baseline-hero" className={s.heroTitle}>
              Today&apos;s <span className={s.heroAccent}>Edit.</span>
            </h1>
            <div className={s.badges}>
              <span className={s.badgeSecondary}>Tuesday, Oct 24</span>
              <span className={s.badgeTertiary}>12 Tasks Pending</span>
            </div>
          </section>

          <div className={s.grid}>
            <div className={s.colMain}>
              <div className={s.priorities}>
                <div className={s.prioritiesHeader}>
                  <h2 className={s.prioritiesTitle}>Top Priorities</h2>
                  <button type="button" className={s.addCircle} aria-hidden tabIndex={-1}>
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                </div>
                <div className={s.taskList}>
                  <div className={s.taskRow}>
                    <div className={s.taskCb}>
                      <span className={`material-symbols-outlined ${s.taskCbMuted}`}>check</span>
                    </div>
                    <div className={s.taskBody}>
                      <h3 className={s.taskTitle}>Finalize Q4 Editorial Strategy</h3>
                      <p className={s.taskMeta}>High Priority • Marketing</p>
                    </div>
                    <span className={`${s.taskTime} ${s.timePrimary}`}>10:00 AM</span>
                  </div>
                  <div className={s.taskRow}>
                    <div className={s.taskCb}>
                      <span className={`material-symbols-outlined ${s.taskCbMuted}`}>check</span>
                    </div>
                    <div className={s.taskBody}>
                      <h3 className={s.taskTitle}>Client Review: Neo Brand Identity</h3>
                      <p className={s.taskMeta}>Medium Priority • Design</p>
                    </div>
                    <span className={`${s.taskTime} ${s.timeSecondary}`}>02:30 PM</span>
                  </div>
                  <div className={`${s.taskRow} ${s.taskRowDone}`}>
                    <div className={`${s.taskCb} ${s.taskCbDark}`}>
                      <span
                        className="material-symbols-outlined"
                        style={{ color: "#fff", fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    </div>
                    <div className={s.taskBody}>
                      <h3 className={`${s.taskTitle} ${s.taskTitleStrike}`}>Review Weekly Analytics</h3>
                      <p className={s.taskMeta}>Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={s.subGrid}>
                <div className={s.focusCard}>
                  <h3 className={s.cardH3}>Focus Mode</h3>
                  <p className={s.cardP}>
                    Deep work session: UI Refinement. Silence all notifications for 90 minutes.
                  </p>
                  <button type="button" className={s.timerBtn}>
                    Start Timer
                  </button>
                </div>
                <div className={s.captureCard}>
                  <h3 className={s.cardH3}>Quick Capture</h3>
                  <textarea className={s.textarea} readOnly placeholder="Type a thought..." tabIndex={-1} />
                </div>
              </div>
            </div>

            <aside className={s.colAside} aria-label="Categories">
              <div className={s.workCard}>
                <div className={s.workDeco} aria-hidden>
                  <span className="material-symbols-outlined">work</span>
                </div>
                <h2 className={s.workH2}>Work</h2>
                <p className={s.workSub}>8 ACTIVE PROJECTS</p>
                <div className={s.avatars}>
                  <div className={s.av}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" src={TEAM_A} width={32} height={32} />
                  </div>
                  <div className={s.av}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" src={TEAM_B} width={32} height={32} />
                  </div>
                  <div className={s.avMore}>+4</div>
                </div>
              </div>

              <div className={s.personalCard}>
                <div className={s.personalDeco} aria-hidden>
                  <span className="material-symbols-outlined">favorite</span>
                </div>
                <h2 className={s.workH2}>Personal</h2>
                <p className={s.workSub}>4 TASKS LEFT</p>
                <div className={s.barTrack}>
                  <div className={s.barFill} />
                </div>
              </div>

              <div className={s.inspireWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={INSPIRE} width={400} height={192} />
                <div className={s.inspireCap}>Inspiration of the Day</div>
              </div>

              <div className={s.analytics}>
                <h3>Productivity</h3>
                <div className={s.bars}>
                  <div className={`${s.bar} ${s.b1}`} />
                  <div className={`${s.bar} ${s.b2}`} />
                  <div className={`${s.bar} ${s.b3}`} />
                  <div className={`${s.bar} ${s.b4}`} />
                  <div className={`${s.bar} ${s.b5}`} />
                </div>
                <p className={s.analyticsFoot}>UP 12% FROM LAST WEEK</p>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <button type="button" className={s.shellMobileFab} aria-hidden tabIndex={-1}>
        <span className="material-symbols-outlined">add</span>
      </button>

      <nav className={s.shellMobileNav} aria-label="Mobile primary">
        <span className={s.shellMobileItem} data-active="true">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            dashboard
          </span>
          <span>Home</span>
        </span>
        <span className={s.shellMobileItem} data-active="false">
          <span className="material-symbols-outlined">checklist</span>
          <span>Tasks</span>
        </span>
        <span className={s.shellMobileItem} data-active="false">
          <span className="material-symbols-outlined">rss_feed</span>
          <span>Feed</span>
        </span>
        <span className={s.shellMobileItem} data-active="false">
          <span className="material-symbols-outlined">settings</span>
          <span>Config</span>
        </span>
      </nav>
    </div>
  );
}
