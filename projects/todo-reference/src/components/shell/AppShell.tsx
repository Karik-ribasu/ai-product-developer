import Link from "next/link";

import { endStubSession } from "@/app/logout/stub-session";

import styles from "./AppShell.module.css";

export type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>Curator</span>
          <span className={styles.brandMeta}>todo-reference / MVP</span>
        </div>
        <nav className={styles.nav} aria-label="Primary">
          <Link className={styles.navLink} href="/dashboard">
            Dashboard
          </Link>
          <Link className={styles.navLink} href="/activity-feed">
            Activity feed
          </Link>
          <Link className={styles.navLink} href="/tasks/new">
            New task
          </Link>
        </nav>
        <form action={endStubSession}>
          <button className={styles.logout} type="submit">
            Log out
          </button>
        </form>
      </header>
      {children}
    </div>
  );
}
