import Link from "next/link";

import tc from "@/app/(main)/tasks/new/task-composer.module.css";
import sh from "./TaskCreationStitchBaseline.module.css";

const TASK_PROFILE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBjNWbK2Uo8oBXAHwaGLqrtoOl5F-k5Q9pd6E6zrcleKuC-fwRnoM4WnEHctbZTecRYKFQiQ3DFnMnGHIV6lNJT4gdxEQdqCTsMND6D5vWGcgE_-jy5OZxnCjV__xBR039k3Bj-YgQQIzTq9bPNDQA9Y7L0NT8iRgFPB75QbZ9kNjLbsG7W6ViuSr8gL_us4sw8Icn8nWx5Gb5C670Tj-rY5WOBv2D_0_F8OjL2ZXvXbemcye-gXFOdxNTA5DqEaLeIytLHLgJVre8";

/** Full Stitch task creation dark screen for STITCH_BASELINE_UI */
export function TaskCreationStitchBaseline() {
  return (
    <div className={sh.root}>
      <aside className={sh.aside} aria-label="Workspace">
        <div className={sh.asideTop}>
          <div className={sh.asideBrand}>The Curator</div>
          <div className={sh.asideTag}>Stay Bold.</div>
        </div>
        <nav className={sh.nav}>
          <span className={sh.navItem}>
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </span>
          <span className={sh.navActive}>
            <span className="material-symbols-outlined">checklist</span>
            Tasks
          </span>
          <span className={sh.navItem}>
            <span className="material-symbols-outlined">rss_feed</span>
            Activity
          </span>
          <span className={sh.navItem}>
            <span className="material-symbols-outlined">settings</span>
            Settings
          </span>
        </nav>
        <div className={sh.navCta}>
          <button type="button" className={sh.newProject}>
            New Project
          </button>
        </div>
      </aside>

      <div className={sh.main}>
        <header className={sh.topHeader}>
          <div className={sh.topBrand}>Klockwork Neo</div>
          <div className={sh.topTools}>
            <div className={sh.searchWrap}>
              <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>
                search
              </span>
              <input
                className={sh.searchInput}
                type="text"
                placeholder="Search Curator..."
                readOnly
                tabIndex={-1}
                aria-hidden
              />
            </div>
            <button type="button" className={sh.iconBtn} aria-hidden tabIndex={-1}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button type="button" className={sh.iconBtn} aria-hidden tabIndex={-1}>
              <span className="material-symbols-outlined">add_box</span>
            </button>
            <div className={sh.avatar}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={TASK_PROFILE} width={40} height={40} />
            </div>
          </div>
        </header>

        <div className={sh.inner}>
          <main className={tc.shell} style={{ padding: 0, maxWidth: "none", margin: 0 }}>
            <div className={tc.topRow}>
              <div className={tc.kickerRow}>
                <p className={tc.kicker}>New Entry — Task-294</p>
                <h1 className={tc.title}>Curate your next objective.</h1>
                <p className={tc.lede}>
                  Precision in definition leads to excellence in execution. Define the parameters of your next
                  architectural milestone.
                </p>
              </div>
              <Link className={tc.back} href="/dashboard">
                Back to dashboard
              </Link>
            </div>

            <div className={tc.grid}>
              <div className={tc.mainCol}>
                <section className={tc.fieldBlock}>
                  <label className={tc.label} htmlFor="baseline-task-title">
                    Task title
                  </label>
                  <input
                    id="baseline-task-title"
                    className={tc.titleInput}
                    readOnly
                    tabIndex={-1}
                    placeholder="Title of the curator's masterpiece..."
                  />
                </section>

                <section className={tc.fieldBlock}>
                  <label className={tc.label} htmlFor="baseline-task-details">
                    Context &amp; details
                  </label>
                  <textarea
                    id="baseline-task-details"
                    className={tc.textarea}
                    readOnly
                    tabIndex={-1}
                    rows={6}
                    placeholder="Articulate the vision behind this task. Be precise, be bold."
                  />
                </section>

                <div className={tc.metaGrid}>
                  <section className={tc.fieldBlock}>
                    <label className={tc.label} htmlFor="baseline-task-date">
                      Target date
                    </label>
                    <input id="baseline-task-date" className={tc.dateInput} type="date" readOnly tabIndex={-1} />
                  </section>

                  <section className={tc.fieldBlock}>
                    <div className={tc.label}>Priority tier</div>
                    <div className={tc.priorityRow}>
                      <button type="button" className={tc.priority}>
                        Low
                      </button>
                      <button type="button" className={tc.priorityActive}>
                        Urgent
                      </button>
                      <button type="button" className={tc.priority}>
                        Critical
                      </button>
                    </div>
                  </section>
                </div>
              </div>

              <aside className={tc.sideCol} aria-label="Categorization">
                <div className={tc.sideCard}>
                  <h3>Categorization</h3>
                  <div className={tc.tags}>
                    <span className={tc.tagSecondary}>Editorial</span>
                    <span className={tc.tagTertiary}>Strategy</span>
                    <span className={tc.tagGhost}>+ Add Tag</span>
                  </div>
                  <div className={tc.divider}>
                    <div>
                      <p className={tc.microLabel}>Assigned Architect</p>
                      <div className={tc.assignee}>
                        <div className={tc.avatar} aria-hidden>
                          JD
                        </div>
                        <div
                          className={tc.microLabel}
                          style={{ opacity: 1, fontSize: "0.9rem", letterSpacing: "0.02em" }}
                        >
                          Julianne Deville
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className={tc.microLabel}>Project Stream</p>
                      <div className={tc.assignee} style={{ gap: "var(--space-2)" }}>
                        <span
                          aria-hidden
                          style={{
                            width: "0.5rem",
                            height: "0.5rem",
                            background: "var(--task-accent)",
                            borderRadius: "999px",
                          }}
                        />
                        <div
                          className={tc.microLabel}
                          style={{ opacity: 1, fontSize: "0.9rem", letterSpacing: "0.02em" }}
                        >
                          Neo-Modernism 2024
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={tc.stickyCta}>
                  <button type="button" className={tc.save}>
                    SAVE TASK
                    <span className="material-symbols-outlined">send</span>
                  </button>
                  <p className={tc.saveNote}>Autosave active — v.4.0.1</p>
                </div>
              </aside>
            </div>

            <footer className={tc.footer}>
              <div className={tc.footerBlock}>
                <div className={tc.rule} />
                <h4>The Vision</h4>
                <p>Curating the future means documenting every step with brutalist honesty and editorial flair.</p>
              </div>
              <div className={tc.footerBlock}>
                <div className={tc.ruleSecondary} />
                <h4>The Method</h4>
                <p>No soft edges. No blurred lines. Only direct action and clear typographic hierarchies.</p>
              </div>
              <div className={tc.footerBlock}>
                <div className={tc.ruleTertiary} />
                <h4>The Output</h4>
                <p>Your dashboard is a magazine where your life is the lead story. Make it count.</p>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
