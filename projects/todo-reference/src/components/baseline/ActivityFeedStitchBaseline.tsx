import s from "./ActivityFeedStitchBaseline.module.css";

const FEED_PROFILE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCJjd6AAGxTEs_WQtLsgejTZcb_-bWuLRC5EE7l574aQUWns5dCgHwgc3cbi-3iQKNlFZ8sfXb-lbC-znJWC9ZuFEzObyzmjXxj_s0CIMev9sA92LL3onrbfALdVTUFgWwDJyuOD92RYm064JcZtMpcam157ODjDSjyPklOqzoeKkXnntR0MXyK01D3ofg2VMgP73iLG_0hQEQ-z9NDp9lf7w-xohZmAHNpSFAoBNwYMd7CDOucgyLxuQpBQ3YjUwqu6BjJGbJ7niU";

const FEAT_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAMhvh2w9whYDGyZMjWVaMITKfKs26FfWy3weFZ0_twGGgzbEr-yY4Fzfyn6MSJ-3TYXf0fhrFjpYEdJEScFnvemQSRNhbiCYGEe1hwHd7UzJp1wtAZG-PYzJfmd8VlOG6xcwvj-YwLbUKQe5L_KkH6FL3qCFH4WzgZ52tTo8tYEIG99LbJAogi-Sc6awnFwNzKfvw2HIHdF34kjAfcjZbGbAZrtU6o285fNf6zmOz0DREoXxtPdXKv8UP3T9ZbEpZVp5V2mzxica8";

const AVA1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC25fSwJJupIqwkbjV5xyVpI_yNGZ0qT8HNCLRg6CGzf5Hl8PndkK--fBDQMGu03lbZGtzcbxTzHVtXE51okncl7ClxDQZG25HNSQ-oSXOL-oGcgAzeM9wyfV7MeIcaOTFjn389e21uD4iWMM7T0fZ3H04gyWPVpzMV6W8X4JYTm_jnlLuT3SIOlAk_ceJYl_rq_dWn6PcQybS3dM9mi9B0og0_RJqOmRuh45RUBNqZg-8nxYYj07-1jFYA44vbVz5mww82687-eUU";

const AVA2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDGV9buh2DBb3rlhLQ408nI4S7wASxwAKYerZt6TLUTHcMQPL7pwN5oIGqnjFIdin4Pk4ZtavbT58MMcBEPKH3uWZNAjGCE2uB4iMvZhPHdjBR6SOZS-39oCBOQZsZWa7FsNdteLKODbVNYX1uQxOUfwSEqd4GDYmaJCL70P9Uh8iLNd2AhRoo_5OMU2yXyahqr_8znl61l0AONBYiaOlMR516L5V7i1n9YndoZU8Xe9jSwTzWjVkJkahffNmzJiRGL6MBOEhj05fQ";

const AVA3 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD6lAy6Lzdwc5wqdgzPxjfjNfBBWncxWfh-389hM93hG4GoUwEia4Q4LX44sM-us9CCig841NND4A-_rEs1z4vBL62pmwZ-g8l67iRYPtAXQO68bfOyZKaYA7ejKDlTPrUvvGIajZfMIRxCq7L1C2UZnLd6RPdC6K3cBo3tbvvBym1OnEJCgIp-_AcjpzunxFcb_NtOGH5yYCSTV4gQGIFNhwgPONcYB2dOEd7osrfNKolKuno4SgzZLMkcVS61CmvS8S9Vwf6Rj7k";

const MARCUS_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBxCOpQg2AgxUkd3zWsw4yJedJVUKx1ukNVnZAI96uSDykJI8HXnIMo_ld-cPwaIKyzDsMYfwmz3CJHthxTDA4k40qv5_aJ5YvFjGUsQ3HOoYbme1qAEdCxjkP8nFg9AkXUlSLTZCV48NWFU1bRcN2kxtzoUYqLFu6M2ZClJzQizsguvHyPyVLVwvD45i5xM8MGLqwJygh0kijCLpYbCQI4vzbna1Y2JED1Jg9e4ue79-fzsiisGYm1u2ysb_Yg5ISGMB5m_9q5p6E";

const OFFICE_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDldej3fUlpcEeNt7bijzFIqMZgm0xfLvqz4IyK1ohr_o4gx9I0Y1ZHmslQsOfGsJVVYyF6wuHmzDQzXBMRiaRhv6ClFPQk6b_7s7ajb6jI04Tx9OqD1NnLT7LHq1WOB9wC2uYKMdFq55Ah85XWZSIP1QyCQmGgHzPghefqVAlJlAk2iNThOj0OkZWqn67a7iklnaD9bhar-7SPi_Ns9ZCOfpHvNWuJe0k4cTzYwp29ig4bp2Iy0i50C2ZmjMPcLDgQOc7GZ1yWG_Q";

const AV_ELENA =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA_8KCrOy4o62bxe1NcZ9SHzIDjCH2fZpOmfPFQnju8Br0gAvM6WEI6ObEHz8cAXERoKdqPgrgZsregwsRIlB2SnPdknABf9qaGnBl3DCwbBPq5lDm1udGEse3zQcUmlVm7UJoGG3DpAy7_SdcG0dUIZ0B7Rdf8MKcbxmKf_NX6lmBMRDHy87OC7Sw3b8m53x21tZHb_QcpisqzogQLJvIBzotn_-5_c56cpWTnwe-2lz7NZF3meN99Gt0hv8XmE7-txuIqFDDRL9w";

const AV_JULIAN =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB88-9FRmnrC76jihwWB7Px7CinhiRhXAwKnZ0DGfOT7GzICZcox_dPBW0OdNUoI868Rbc5T5PggLb363CU10PKpjKiqmsXhMCdkKWJezsEUXIVaXSF-aUuZyqBORyXuYGksdYMEJHYcSRnPOVZIzousDHQ7RluIRorjtXqsL23Z1FM2H8bJde_kZlLoD_Aw-Agls2_hFwjDJTZPfh9evEJhtWUDbcNLjfIIejvoH99_zLSXBf47zRQIfptAfKLVx-jJ68zNJiRseM";

const AV_ARIA =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBB1sUFn5dtXos8G1goCrk_uG4NDHvmw_FDF11QS_oxE2T77e6-dnKrVgk9SmXWs0P_YocvzDoshvN2TieB7h4SbtQF_VquLf6B1hQu8RKl7JEeSSLBkvP2vhm4zK_j_Eai7WPYjmRog0IejKRlonqyYzW3AIMcJwOVbd6pj9iTwhrXL82YeofRZU1wyCbHAPaUb5ajyCObVgvmIKC7OhEDHfNz91fux9Cd3JcZgOMNM4U3EWygYAHbGjNIkWYDvFG-W50vt17RF4";

/** Full Stitch activity feed screen `eeb35234b6764d199f5085e69e9cc0fc` for STITCH_BASELINE_UI */
export function ActivityFeedStitchBaseline() {
  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={s.headerLeft}>
          <span className={s.brand}>Klockwork Neo</span>
          <nav className={s.topNav} aria-label="Primary">
            <span className={s.topNavLink}>Dashboard</span>
            <span className={s.topNavLink}>Tasks</span>
            <span className={s.topNavActive}>Activity</span>
            <span className={s.topNavLink}>Settings</span>
          </nav>
        </div>
        <div className={s.headerTools}>
          <div className={s.searchWrap}>
            <span className={`material-symbols-outlined ${s.searchIcon}`}>search</span>
            <input
              className={s.search}
              type="text"
              placeholder="Search projects..."
              readOnly
              tabIndex={-1}
              aria-hidden
            />
          </div>
          <button type="button" className={s.iconBtn} aria-hidden tabIndex={-1}>
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button type="button" className={s.iconBtn} aria-hidden tabIndex={-1}>
            <span className="material-symbols-outlined">add_box</span>
          </button>
          <div className={s.avatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={FEED_PROFILE} width={40} height={40} />
          </div>
        </div>
      </header>

      <div className={s.body}>
        <aside className={s.aside} aria-label="Workspace">
          <div className={s.asideTitle}>
            <h1 className={s.asideH1}>The Curator</h1>
            <p className={s.asideTag}>STAY BOLD.</p>
          </div>
          <nav className={s.sideNav}>
            <span className={s.sideLink}>
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </span>
            <span className={s.sideLink}>
              <span className="material-symbols-outlined">checklist</span>
              Tasks
            </span>
            <span className={s.sideActive}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                rss_feed
              </span>
              Activity
            </span>
            <span className={s.sideLink}>
              <span className="material-symbols-outlined">settings</span>
              Settings
            </span>
          </nav>
          <div className={s.asideCta}>
            <button type="button" className={s.newProject}>
              New Project
            </button>
          </div>
        </aside>

        <main className={s.main}>
          <header className={s.pageHeader}>
            <div>
              <span className={s.kicker}>— Social Pulse</span>
              <h2 className={s.title}>Community Flow.</h2>
            </div>
            <div className={s.filters} aria-label="Feed filters">
              <span className={s.chip}>TEAMS</span>
              <span className={s.chipMuted}>FRIENDS</span>
            </div>
          </header>

          <div className={s.grid}>
            <div className={s.colMain}>
                <article className={s.featured}>
                  <div className={s.featuredImgWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" src={FEAT_IMG} />
                  </div>
                  <div className={s.featuredBody}>
                    <div>
                      <div className={s.featuredTop}>
                        <span className={s.pill}>Milestone reached</span>
                        <span className={s.time}>2h ago</span>
                      </div>
                      <h3 className={s.featuredH3}>Team Project Alpha is 80% done.</h3>
                      <p className={s.featuredP}>
                        The final sprint has begun! The architecture phase is complete and the team is now moving into
                        final asset polish.
                      </p>
                    </div>
                    <div>
                      <div className={s.progressTrack}>
                        <div className={s.progressFill} />
                        <span className={s.progressLabel}>80%</span>
                      </div>
                      <div className={s.avatarRow}>
                        <div className={s.roundAv} style={{ background: "var(--stitch-secondary-container)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img alt="" src={AVA1} />
                        </div>
                        <div className={s.roundAv} style={{ background: "var(--stitch-primary-container)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img alt="" src={AVA2} />
                        </div>
                        <div className={s.roundAv} style={{ background: "var(--stitch-tertiary-container)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img alt="" src={AVA3} />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <div className={s.cardGrid}>
                  <article className={s.smallCard}>
                    <div className={s.cardHead}>
                      <div className={s.sqAv}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" src={MARCUS_IMG} />
                      </div>
                      <div>
                        <h4 className={s.cardName}>Marcus Chen</h4>
                        <p className={s.cardSub}>Just Now</p>
                      </div>
                    </div>
                    <h3 className={s.cardH}>Sarah completed 5 tasks today!</h3>
                    <div className={s.tagRow}>
                      <span className={s.miniTag}>Productivity Streak</span>
                      <span className={s.miniTag} style={{ background: "var(--stitch-surface-container)" }}>
                        +500 XP
                      </span>
                    </div>
                    <button type="button" className={s.ctaBtn}>
                      Congratulate
                    </button>
                  </article>

                  <article className={s.smallCardSecondary}>
                    <div className={s.cardHead}>
                      <span className="material-symbols-outlined" style={{ fontSize: "2.25rem", fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                      </span>
                      <div>
                        <h4 className={s.cardName}>System Insight</h4>
                        <p className={s.cardSub} style={{ color: "var(--stitch-on-secondary-container)" }}>
                          15 min ago
                        </p>
                      </div>
                    </div>
                    <h3 className={s.cardH}>The &quot;Deep Work&quot; circle has been active for 4 hours.</h3>
                    <div className={s.tagRow} style={{ marginTop: "auto", justifyContent: "flex-end" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>
                        trending_up
                      </span>
                    </div>
                  </article>

                  <article className={s.imageCard}>
                    <div className={s.imageCardInner}>
                      <div className={s.imageHalf}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" src={OFFICE_IMG} />
                      </div>
                      <div className={s.imageBody}>
                        <div className={s.liveRow}>
                          <span className={s.liveDot} />
                          <span className={s.liveTxt}>Live Session Underway</span>
                        </div>
                        <h3 className={s.cardH} style={{ fontSize: "1.5rem", lineHeight: "2rem" }}>
                          &quot;Creative Ops&quot; just started a collaborative whiteboard.
                        </h3>
                        <div className={s.tagRow} style={{ marginTop: "var(--space-4)", gap: "var(--space-4)" }}>
                          <button type="button" className={s.ctaBtn} style={{ background: "#000", color: "#fff" }}>
                            Join Now
                          </button>
                          <button type="button" className={s.ctaBtn}>
                            View Board
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
            </div>

            <aside className={s.sideCol}>
              <div className={s.leaderboard}>
                <span className={s.lbKicker}>Global Leaderboard</span>
                <div className={s.lbRank}>
                  <span className={s.lbNum}>#04</span>
                  <span className={s.lbDen}>/ 120</span>
                </div>
                <p className={s.lbQuote}>
                  &quot;You are in the top 5% of curators this week. Stay bold.&quot;
                </p>
              </div>

              <div className={s.curatorsCard}>
                <h4 className={s.curatorsTitle}>Active Curators</h4>
                <ul className={s.curatorList}>
                  <li className={s.curatorRow}>
                    <div className={s.curatorLeft}>
                      <div className={s.curatorAv} style={{ background: "var(--stitch-tertiary-container)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" src={AV_ELENA} />
                      </div>
                      <p className={s.curatorName}>Elena Vance</p>
                    </div>
                    <span className={s.statusOn} />
                  </li>
                  <li className={s.curatorRow}>
                    <div className={s.curatorLeft}>
                      <div className={s.curatorAv} style={{ background: "var(--stitch-secondary-container)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" src={AV_JULIAN} />
                      </div>
                      <p className={s.curatorName}>Julian K.</p>
                    </div>
                    <span className={s.statusOn} />
                  </li>
                  <li className={s.curatorRow}>
                    <div className={s.curatorLeft}>
                      <div className={s.curatorAv} style={{ background: "var(--stitch-primary-container)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" src={AV_ARIA} />
                      </div>
                      <p className={s.curatorName}>Aria Montgomery</p>
                    </div>
                    <span className={s.statusOff} />
                  </li>
                </ul>
                <button type="button" className={s.findMore}>
                  Find more curators
                </button>
              </div>

              <div className={s.goPro}>
                <div className={s.goProDeco} aria-hidden />
                <div className={s.goProInner}>
                  <h4 className={s.goProH}>Go Pro.</h4>
                  <p className={s.goProP}>Unlock team analytics and advanced curation tools.</p>
                  <a className={s.goProLink} href="#">
                    Upgrade Identity
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <button type="button" className={s.fab} aria-hidden tabIndex={-1}>
        <span className="material-symbols-outlined">add</span>
      </button>

      <nav className={s.mobileNav} aria-label="Mobile primary">
        <button type="button" className={s.mNavBtn}>
          <span className="material-symbols-outlined">dashboard</span>
        </button>
        <button type="button" className={s.mNavBtn}>
          <span className="material-symbols-outlined">checklist</span>
        </button>
        <button type="button" className={s.mNavBtnActive}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            rss_feed
          </span>
        </button>
        <button type="button" className={s.mNavBtn}>
          <span className="material-symbols-outlined">settings</span>
        </button>
      </nav>
    </div>
  );
}
