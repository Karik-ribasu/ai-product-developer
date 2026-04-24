"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./CuratorChrome.module.css";

const PROFILE_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA73z42QSSoHdfO2YLmi-Xubz9HwLEf0CxGhxRbmAhciy_Y_4i2vubZhVVCk2B4A6cQJIFcmm5-W8zVXK2ApFWpD4k4mrs_05oxl2UjWQkPjXKzzPOw8TiSAyUcYSO5O4wcnu5GAGjmq6Ot1vGiW38qY5tV_r9fftrP68hQZmaGgm3Hz5oL6pgfWbAMoRqdN169HyloNgIXW_dmvzFr9sik9ziqWl1iaciRTa1U8wcDFBg3Pxk6W-UFiaXOpKkyEa_WJfa-7wT0eOA";

export type CuratorNav = "dashboard" | "tasks" | "activity";

function navFromPath(pathname: string): CuratorNav {
  if (pathname.startsWith("/activity-feed")) return "activity";
  if (pathname.startsWith("/tasks")) return "tasks";
  return "dashboard";
}

export type CuratorChromeProps = {
  children: React.ReactNode;
};

export function CuratorChrome({ children }: CuratorChromeProps) {
  const pathname = usePathname() ?? "/dashboard";
  const active = navFromPath(pathname);

  return (
    <div className={styles.root}>
      <header className={styles.topHeader}>
        <div className={styles.brandRow}>
          <span className={styles.brand}>Klockwork Neo</span>
          <nav className={styles.topNav} aria-label="Primary">
            <Link
              className={active === "dashboard" ? styles.topNavLinkActive : styles.topNavLink}
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link className={active === "tasks" ? styles.topNavLinkActive : styles.topNavLink} href="/tasks/new">
              Tasks
            </Link>
            <Link
              className={active === "activity" ? styles.topNavLinkActive : styles.topNavLink}
              href="/activity-feed"
            >
              Activity
            </Link>
          </nav>
        </div>
        <div className={styles.headerTools}>
          <div className={styles.searchWrap}>
            <label className="visually-hidden" htmlFor="curator-search">
              Search
            </label>
            <input
              id="curator-search"
              className={styles.search}
              type="search"
              placeholder="Search tasks..."
              autoComplete="off"
            />
          </div>
          <button type="button" className={styles.iconButton} aria-label="Notifications">
            <span className={`material-symbols-outlined ${styles.headerMaterialIcon}`}>notifications</span>
          </button>
          <button type="button" className={styles.iconButton} aria-label="Create">
            <span className={`material-symbols-outlined ${styles.headerMaterialIcon}`}>add_box</span>
          </button>
          <div className={styles.avatar}>
            {/* eslint-disable-next-line @next/next/no-img-element -- remote Stitch reference asset */}
            <img alt="User profile" src={PROFILE_SRC} width={40} height={40} />
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar} aria-label="Workspace">
          <div className={styles.sidebarTitle}>
            <h2 className={styles.sidebarHeading}>The Curator</h2>
            <p className={styles.sidebarTag}>Stay Bold.</p>
          </div>
          <nav className={styles.sideNav}>
            <Link
              className={active === "dashboard" ? styles.sideLinkActive : styles.sideLink}
              href="/dashboard"
            >
              <span className={`material-symbols-outlined ${styles.sideMaterial}`}>dashboard</span>
              <span>Dashboard</span>
            </Link>
            <Link className={active === "tasks" ? styles.sideLinkActive : styles.sideLink} href="/tasks/new">
              <span className={`material-symbols-outlined ${styles.sideMaterial}`}>checklist</span>
              <span>Tasks</span>
            </Link>
            <Link
              className={active === "activity" ? styles.sideLinkActive : styles.sideLink}
              href="/activity-feed"
            >
              <span className={`material-symbols-outlined ${styles.sideMaterial}`}>rss_feed</span>
              <span>Activity</span>
            </Link>
            <span className={styles.sideLink} style={{ opacity: 0.45, pointerEvents: "none" }}>
              <span className={`material-symbols-outlined ${styles.sideMaterial}`}>settings</span>
              <span>Settings</span>
            </span>
          </nav>
          <div className={styles.sidebarCta}>
            <button type="button" className={styles.newProject}>
              New Project
            </button>
          </div>
        </aside>

        <div className={styles.main}>{children}</div>
      </div>

      <nav className={styles.mobileNav} aria-label="Mobile primary">
        <Link className={styles.mobileNavItem} data-active={active === "dashboard"} href="/dashboard">
          <span
            className={`material-symbols-outlined ${styles.mobileIcon}`}
            style={active === "dashboard" ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            dashboard
          </span>
          <span>Home</span>
        </Link>
        <Link className={styles.mobileNavItem} data-active={active === "tasks"} href="/tasks/new">
          <span className={`material-symbols-outlined ${styles.mobileIcon}`}>checklist</span>
          <span>Tasks</span>
        </Link>
        <Link className={styles.mobileNavItem} data-active={active === "activity"} href="/activity-feed">
          <span className={`material-symbols-outlined ${styles.mobileIcon}`}>rss_feed</span>
          <span>Feed</span>
        </Link>
        <span className={styles.mobileNavItem} data-active="false" style={{ opacity: 0.5 }}>
          <span className={`material-symbols-outlined ${styles.mobileIcon}`}>settings</span>
          <span>Config</span>
        </span>
      </nav>

      {active === "dashboard" ? (
        <button type="button" className={styles.mobileFab} aria-label="Add">
          <span className={`material-symbols-outlined ${styles.mobileFabIcon}`}>add</span>
        </button>
      ) : null}
    </div>
  );
}
