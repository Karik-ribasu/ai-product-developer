---
name: testing-and-qa-standards
description: Mandatory unit and integration coverage, container-only integration execution, and QA automated-manual E2E with Chromium. Read for delivery, architecture, infra, QA, and EM payloads.
---

# Testing and QA standards (mandatory)

## When to use (mandatory)

- **`delivery-agent`**, **`architecture-agent`:** when tasks touch tests, CI, coverage, or quality gate; add **`architecture_refs`** ids from this file and acceptance criteria that reference this skill.
- **`engineering-manager-agent`:** attach this skill path to **`infra-engineer`**, **`backend-agent`**, **`frontend-agent`**, and **`qa-agent`** assignments when tests or QA gates are in scope.
- **`infra-engineer`:** CI, compose/Kubernetes jobs, coverage enforcement, **integration-test-only** container orchestration.
- **`qa-agent`:** validation, coverage verification where assigned, **automated-manual E2E** (Chromium) per §4, **visual evidence** per §4.1 when design acceptance is in scope, and **Stitch pixel baseline parity** per §4.2 whenever Stitch SoT applies ( **`stitch.source_of_truth`: `true`** or shipped **`design/stitch/screens/*.png`** for the feature).

---

## 1. Coverage — unit tests (mandatory)

- **100% coverage is required** for the **unit test scope** as defined in the repo’s coverage config (or, until configured, all non-generated TypeScript/JavaScript under `src/` that is eligible for unit testing—**exclude** only what the config explicitly excludes, e.g. `*.d.ts`, entry manifests, with documented rationale in the architecture brief or `quality-gate` acceptance).
- Coverage metric: **line coverage at 100%** minimum (project may add branch/function thresholds; they must not **lower** the 100% line bar for the declared scope).
- **CI must fail** if unit coverage falls below 100% for that scope.
- Unit tests run on the **default CI runner** (no Docker requirement unless the team chooses parity); they **must not** depend on real networked services—use fakes/in-memory doubles.

**Stable id:** `unit-tests-full-coverage`

---

## 2. Coverage — integration tests (mandatory)

- **100% coverage is required** for the **integration test scope** (modules that integration tests are responsible for exercising—**declare** the glob or package list in the architecture brief or `task.json` acceptance so the bar is auditable).
- **Integration test jobs must execute only inside isolated containers** (see §3). The same 100% rule applies to coverage collected from that job.
- **CI must fail** if integration coverage falls below 100% for the declared integration scope.

**Stable id:** `integration-tests-full-coverage`

---

## 3. Integration tests — containers only (mandatory)

- **Never** run integration tests that need process/network isolation (DB, cache, queues, message brokers, etc.) directly on the bare CI VM **without** containers, unless exploration/discovery documents an approved exception (rare).
- Use **one container (or one service) per concern**: e.g. one **PostgreSQL** container, one **Redis** container, one **queue** worker image, etc. Composition is **flexible** by feature, but **each auxiliary runtime must map to a single logical role** (one job = one reason to exist).
- The **application under test** and **test runner** may each run in their own container(s); keep blast radius small and logs attributable per service.
- **Prisma / DB:** integration and E2E stacks must expose a **`DATABASE_URL`** (or equivalent) that points **only** to the **test-scoped** database service for that job—never a developer workstation default or shared prod-like instance (see **`.cursor/skills/architecture-standards/SKILL.md`** — persistence baseline).
- **`infra-engineer`** owns compose/K8s manifests, CI job wiring, healthchecks, and teardown; implementation agents own test code that **consumes** those services by documented hostnames/ports.
- **Agent-local Docker (orchestrated runs):** Any specialist who starts compose/containers **during a delegated turn** (local verification, one-off E2E, etc.) **must** stop and remove them before that turn ends—**no exceptions**—per **`.cursor/skills/production-workflow/SKILL.md`** (*Container lifecycle during pipeline runs*). CI platform teardown (job end, workflow `docker compose down`, etc.) satisfies the same intent for **that** job.

**Stable id:** `integration-tests-isolated-containers`

---

## 4. QA — automated-manual E2E with Chromium (mandatory for `quality-gate` when UI exists)

This is **not** a substitute for unit/integration coverage; it is an **additional** gate.

- **`qa-agent`** must run (or extend) an **automated-manual** suite: the **application runs in an isolated container** (or isolated compose stack), and **Chromium** drives the UI to simulate **real user behavior** across **all shipped features of the MVP/slice**, **every** time this gate runs for that scope.
- **All features** means every user-visible capability in scope for the release (CRUD, navigation, error states called out in acceptance, etc.)—**no sampling** unless discovery explicitly documents a reduced gate and delivery updates `quality-gate` acceptance.
- **Failures to collect and report (structured, for EM handoff):**
  - **Browser console** errors and warnings attributable to the app (filter noise per QA judgment; document filters in the report).
  - **Network** failures (4xx/5xx, failed fetch/WebSocket) relevant to app APIs.
- Use the same **pass / fail + `issues` list** contract as the rest of `qa-agent` output; attach logs/screenshots paths if the pipeline supports artifacts.

**Stable id:** `qa-manual-automated-e2e-chromium`

---

## 4.1 QA — visual evidence for design acceptance (when required)

When **`task.json` acceptance** or **`artifacts/design_package.json`** sets **`acceptance.requires_design_visual_acceptance`: `true`** for a surface:

- **`qa-agent`** must produce **`artifacts/qa_visual_evidence.json`** and companion captures under **`artifacts/visual/`**, following **`.cursor/skills/design/design_visual_acceptance.skill.md`**.
- **Subjective** “brand feel” / discretionary **design judgment** vs Stitch remains **design-owned** when **`design_visual_acceptance`** runs; QA supplies **reproducible captures** + metadata (`build`, `environment`, `viewport`, `route`, `state`).
- If captures cannot be produced, document blocking reasons in **`qa_visual_evidence.json`** via **`errors`** (string array) and still report to EM.

**Stable id:** `qa-visual-evidence-for-design`

---

## 4.2 QA — Stitch fidelity: **app screenshots vs `design/stitch/screens` (mandatory for SoT)**

When **`artifacts/design_package.json`** has **`stitch.source_of_truth`: `true`** OR the feature ships baseline PNGs under **`projects/<project_slug>/design/stitch/screens/`** for implemented routes, **`acceptance.requires_stitch_fidelity_qa`** MUST be **`true`**. **`ui-generator-agent`** and **`delivery-agent`** must not set it to **`false`** except when **`architecture-brief.json`** records an explicit waiver for SoT (rare; requires human-visible justification).

**Non-negotiable comparison:** for **every** shipped screen listed in **`stitch.screens[]`** (or in **`meta.json` → `screens[]`** if the package is absent but SoT exports exist), **`qa-agent`** must:

1. Capture the **running application** in Chromium at the **same viewport width × height** documented for that screen in **`ui_spec.json`** (or, if absent, the dimensions recorded in **`stitch_fidelity_report.json` → `viewports[]`** with architecture/EM approval).
2. Compare that capture to the **canonical Stitch raster** at **`design/stitch/screens/<screen_id>.png`** (path from **`stitch.screens[].image`**).
3. Store **both** images under **`artifacts/visual/`** (e.g. `app-<screen_id>.png` beside `stitch-ref-<screen_id>.png` copied or linked from the design tree for audit).
4. Run an **automated** diff (e.g. Playwright screenshot assertion with Stitch PNG as baseline, `pixelmatch`, or equivalent) and record **`diff_ratio`** (or pass/fail + tool output) per screen.

**Pass rule (default — no divergence):** overall **`status`: `pass`** only if **every** compared screen has **`per_screen[].pass`: `true`** with **`diff_ratio`: `0`** (or tool-equivalent **no differing pixels**). **Any** non-zero diff ⇒ **`fail`** unless **`architecture-brief.json`** defines an explicit numeric waiver in **`stitch_qa_pixel_diff`** (e.g. max ratio per screen for font rasterization) **and** QA documents which screens used that waiver.

**Additional checks (still mandatory):** region / section order / primary affordances must match **`ui_spec.json`**; list violations in **`mismatches[]`** even when pixel diff is zero.

**Artifact:** **`artifacts/stitch_fidelity_report.json`** must include at least: **`status`**, **`compared_baseline`** ( **`meta.json`** path), **`per_screen[]`** ( **`id`**, **`stitch_png_path`**, **`app_screenshot_path`**, **`viewport`**, **`comparison_tool`**, **`diff_ratio`**, **`pass`**, **`mismatches[]`** ), and summary **`viewports[]`**.

**Stable id:** `qa-stitch-fidelity`

### Stitch fidelity vs design visual acceptance (combinations)

Use **`artifacts/design_package.json` → `acceptance`** to decide which QA artifact classes are mandatory:

| `requires_stitch_fidelity_qa` | `requires_design_visual_acceptance` | QA must produce |
|------------------------------|-------------------------------------|-----------------|
| `true` | `false` or absent | §4.2 **full** (PNG vs app + `stitch_fidelity_report.json` + **`artifacts/visual/**`** captures). |
| `true` | `true` | §4.2 **and** §4.1 (design visual acceptance flow per **`.cursor/skills/design/design_visual_acceptance.skill.md`**). |
| `false` or absent | `true` | §4.1 only; §4.2 applies anyway if **`stitch.source_of_truth`** is **`true`** (SoT cannot skip §4.2). |
| `false` or absent | `false` or absent | §4.2 **still mandatory** if **`stitch.source_of_truth`: `true`** or SoT PNGs exist for shipped UI; otherwise neither §4.1 nor §4.2 unless **`task.json`** names them. |

Cross-links: **`.cursor/skills/design/design_visual_acceptance.skill.md`** (subjective sign-off when enabled), **`.cursor/skills/design/stitch_workflow.skill.md`** (SoT and default expectation for §4.2 when SoT is on).

---

## 4.3 E2E vs integration — empty states, errors, and recovery

- **Integration scope** (stable id: `integration-tests-full-coverage`) owns **contracts**: HTTP/Server Action surfaces, status codes, and error mapping into application-layer errors—**without** requiring that every user-visible string or affordance be asserted here.
- **E2E scope** (stable id: `qa-manual-automated-e2e-chromium`) owns **every user-visible outcome named in acceptance** for the slice: empty-list states, user-readable error surfaces, and retry/recovery affordances when the brief or **`quality-gate`** calls for them.
- **Duplication is allowed, not substitutable:** missing E2E proof of a brief-mandated visible state remains a **QA finding** even when integration lines for server-side failure handling are fully covered—unless discovery/delivery **explicitly** documents a reduced gate and updates **`quality-gate`** acceptance accordingly.

---

## 5. `architecture_refs` (use in `task.json` / delivery JSON)

| Stable id | Meaning |
|-----------|---------|
| `unit-tests-full-coverage` | §1 — unit suite + 100% coverage enforced in CI |
| `integration-tests-full-coverage` | §2 — integration suite + 100% coverage |
| `integration-tests-isolated-containers` | §3 — integration runs only in multi-service containers |
| `qa-manual-automated-e2e-chromium` | §4 — QA Chromium E2E over full feature set |
| `qa-visual-evidence-for-design` | §4.1 — reproducible screenshots + `qa_visual_evidence.json` for design visual acceptance |
| `qa-stitch-fidelity` | §4.2 — `stitch_fidelity_report.json` + **app vs `design/stitch/screens` PNG** comparison + `ui_spec` alignment (mandatory for SoT) |
| `qa-validation` | Alias compatible with `architecture-standards` for **`quality-gate`** rows |

---

## 6. Practical note (non-negotiable vs. feasibility)

If 100% is **technically blocked** for a path (e.g. generated code), the **`architecture-agent`** must record the **exception list** in **`architecture-brief.json`** and **`delivery-agent`** must mirror it in **`quality-gate`** acceptance; otherwise the default remains **full 100%** for the declared scopes.
