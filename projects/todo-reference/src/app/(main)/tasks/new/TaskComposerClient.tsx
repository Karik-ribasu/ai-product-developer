"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { TodoActionError } from "@/app/todo-action-contract";
import { createTodoViaHttp } from "@/lib/client/todo-http-client";
import { ErrorBanner } from "@/components/ui/molecules/ErrorBanner";

import styles from "./task-composer.module.css";

type Priority = "low" | "urgent" | "critical";

function buildTodoContent(title: string, details: string, priority: Priority): string {
  const head = title.trim();
  const body = details.trim();
  const tier = `Priority: ${priority}`;
  if (!body) return `${head}\n\n${tier}`;
  return `${head}\n\n${body}\n\n${tier}`;
}

export function TaskComposerClient() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState<Priority>("urgent");
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);
  const [banner, setBanner] = useState<{
    error: TodoActionError;
    retry: () => Promise<void>;
  } | null>(null);

  const canSave = useMemo(() => title.trim().length > 0, [title]);

  async function save() {
    setBanner(null);
    setFieldError(undefined);
    const content = buildTodoContent(title, details, priority);
    setSubmitting(true);
    try {
      const result = await createTodoViaHttp(content);
      if (!result.ok) {
        if (result.error.code === "VALIDATION") {
          setFieldError(result.error.message);
          return;
        }
        setBanner({
          error: result.error,
          retry: async () => {
            setBanner(null);
            await save();
          },
        });
        return;
      }
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.shell}>
      <div className={styles.topRow}>
        <div className={styles.kickerRow}>
          <p className={styles.kicker}>New Entry — Task-294</p>
          <h1 className={styles.title}>Curate your next objective.</h1>
          <p className={styles.lede}>
            Precision in definition leads to excellence in execution. Define the parameters of your next architectural
            milestone.
          </p>
        </div>
        <Link className={styles.back} href="/dashboard">
          Back to dashboard
        </Link>
      </div>

      {banner ? (
        <ErrorBanner
          error={banner.error}
          title="Could not save task"
          onRetry={() => void banner.retry()}
          onDismiss={() => setBanner(null)}
        />
      ) : null}

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <section className={styles.fieldBlock} aria-labelledby="task-title-label">
            <label className={styles.label} id="task-title-label" htmlFor="task-title">
              Task title
            </label>
            <input
              id="task-title"
              className={styles.titleInput}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldError) setFieldError(undefined);
              }}
              placeholder="Title of the curator's masterpiece..."
              autoComplete="off"
              aria-invalid={fieldError ? true : undefined}
              aria-describedby={fieldError ? "task-title-error" : undefined}
            />
            {fieldError ? (
              <p id="task-title-error" className={styles.fieldError} role="alert">
                {fieldError}
              </p>
            ) : null}
          </section>

          <section className={styles.fieldBlock} aria-labelledby="task-details-label">
            <label className={styles.label} id="task-details-label" htmlFor="task-details">
              Context &amp; details
            </label>
            <textarea
              id="task-details"
              className={styles.textarea}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Articulate the vision behind this task. Be precise, be bold."
            />
          </section>

          <div className={styles.metaGrid}>
            <section className={styles.fieldBlock} aria-labelledby="task-date-label">
              <label className={styles.label} id="task-date-label" htmlFor="task-date">
                Target date
              </label>
              <input id="task-date" className={styles.dateInput} type="date" />
            </section>

            <section className={styles.fieldBlock} aria-labelledby="priority-label">
              <div className={styles.label} id="priority-label">
                Priority tier
              </div>
              <div className={styles.priorityRow}>
                <button
                  type="button"
                  className={priority === "low" ? styles.priorityActive : styles.priority}
                  onClick={() => setPriority("low")}
                >
                  Low
                </button>
                <button
                  type="button"
                  className={priority === "urgent" ? styles.priorityActive : styles.priority}
                  onClick={() => setPriority("urgent")}
                >
                  Urgent
                </button>
                <button
                  type="button"
                  className={priority === "critical" ? styles.priorityActive : styles.priority}
                  onClick={() => setPriority("critical")}
                >
                  Critical
                </button>
              </div>
            </section>
          </div>
        </div>

        <aside className={styles.sideCol} aria-label="Categorization">
          <div className={styles.sideCard}>
            <h3>Categorization</h3>
            <div className={styles.tags}>
              <span className={styles.tagSecondary}>Editorial</span>
              <span className={styles.tagTertiary}>Strategy</span>
              <span className={styles.tagGhost}>+ Add Tag</span>
            </div>
            <div className={styles.divider}>
              <div>
                <p className={styles.microLabel}>Assigned Architect</p>
                <div className={styles.assignee}>
                  <div className={styles.avatar} aria-hidden>
                    JD
                  </div>
                  <div className={styles.microLabel} style={{ opacity: 1, fontSize: "0.9rem", letterSpacing: "0.02em" }}>
                    Julianne Deville
                  </div>
                </div>
              </div>
              <div>
                <p className={styles.microLabel}>Project Stream</p>
                <div className={styles.assignee} style={{ gap: "var(--space-2)" }}>
                  <span
                    aria-hidden
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      background: "var(--task-accent)",
                      borderRadius: "999px",
                    }}
                  />
                  <div className={styles.microLabel} style={{ opacity: 1, fontSize: "0.9rem", letterSpacing: "0.02em" }}>
                    Neo-Modernism 2024
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.stickyCta}>
            <button
              type="button"
              className={styles.save}
              disabled={!canSave || submitting}
              onClick={() => void save()}
            >
              Save task
              <span aria-hidden>➤</span>
            </button>
            <p className={styles.saveNote}>Autosave active — v.4.0.1</p>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerBlock}>
          <div className={styles.rule} />
          <h4>The Vision</h4>
          <p>Curating the future means documenting every step with brutalist honesty and editorial flair.</p>
        </div>
        <div className={styles.footerBlock}>
          <div className={styles.ruleSecondary} />
          <h4>The Method</h4>
          <p>No soft edges. No blurred lines. Only direct action and clear typographic hierarchies.</p>
        </div>
        <div className={styles.footerBlock}>
          <div className={styles.ruleTertiary} />
          <h4>The Output</h4>
          <p>Your dashboard is a magazine where your life is the lead story. Make it count.</p>
        </div>
      </footer>
    </main>
  );
}
