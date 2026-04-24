---
name: architecture-standards
description: Canonical engineering architecture and patterns for this repo (Clean Architecture, DDD, UI composition, styling). Must be read when generating or refining delivery tasks and when implementing features.
---

# Architecture standards (engineering)

## When to use this skill (mandatory)

- **`delivery-agent`:** before splitting epics/tasks and **while** writing `task.json` and acceptance criteria—each task must stay traceable to these rules (use `architecture_refs` per task where relevant).
- **`architecture-agent`:** when producing or updating per-feature **`architecture-brief.json`** (narrows this document to the feature; must not contradict it).
- **`engineering-manager-agent`:** when turning tasks into assignments—payloads to specialists must include the brief path and require compliance with this skill + brief.
- **Implementation specialists** (`frontend-agent`, `backend-agent`, …): before coding; deviations need an explicit decision recorded in the architecture brief or a new exploration/discovery cycle—no silent drift.
- **Testing / QA / CI:** also read **`.cursor/skills/testing-and-qa-standards/SKILL.md`** whenever tasks touch tests, coverage, containerized integration, or the **`quality-gate`**.

---

## 1. Baseline (decision-oriented, not hard-coded)

### Architectural decision policy ###
`.cursor/skills/architecture-standards/SKILL.md`  

**Purpose:** This skill defines the **global baseline and decision heuristics** for the repo, not an unconditional per-feature mandate. The **`architecture-agent`** should prefer consistency with existing repo patterns, but must still decide what is most appropriate, scalable, and sustainable for the feature at hand.

**Decision criteria:** prefer approaches that preserve clear boundaries, testability, maintainability, team comprehension, and alignment with the current codebase. Divergence from the baseline is allowed only when the **`architecture-brief.json`** records the choice and why the default would be a worse fit.

---

### Clean Architecture (preferred default) ###
`.cursor/skills/architecture-standards/SKILL.md`  

**Purpose:** Prefer inward dependency flow when the feature has meaningful business rules, replaceable adapters, or clear separation between domain/application and frameworks. This is the **default architectural preference**, not a blind requirement for every slice.

**Next.js (App Router):** when this pattern is chosen, keep **domain + application use cases** in pure modules (no `react` / `next/*` / ORM imports). Routes, server actions/handlers, and components stay at the edge and call the core through explicit boundaries. Prefer unit tests on the core.

**When to diverge:** very small UI-only flows, thin CRUD slices, or existing feature-local conventions may justify a lighter structure if the brief explains why a full ports/adapters split would add more ceremony than value.

---

### DDD (tactical, pragmatic toolbox) ###
`.cursor/skills/architecture-standards/SKILL.md`  

**Purpose:** Use tactical DDD concepts when they clarify the domain: ubiquitous language, aggregates where invariants exist, value objects for concepts without identity, and domain services only when the rule does not belong to one entity.

**When to apply:** use bounded contexts when the MVP spans more than one domain, and avoid one giant “global model” without need. Do **not** force aggregates/value objects where simple data structures are sufficient.

**Limits:** no event sourcing or microservices for the MVP unless exploration/discovery justified it.

---

### Creational — Singleton policy (repo invariant) ###
`.cursor/skills/architecture-standards/SKILL.md`  

**Purpose:** Avoid global **mutable** singletons (hurts testing, hides coupling). Prefer explicit injection (parameters/factories) or per-request instances on the server. **Rare exceptions:** immutable HTTP clients, stateless loggers—document in `architecture-brief.json` if used.

---

### Persistence — Prisma ORM + isolated database (mandatory baseline) ###
`.cursor/skills/architecture-standards/SKILL.md`  

**Purpose:** Application persistence must use **[Prisma](https://www.prisma.io/)** as the ORM. **`architecture-agent`** chooses a **Prisma-supported** database (e.g. PostgreSQL, MySQL, SQLite) per feature and records it in **`architecture-brief.json` → `persistence`**.

**Development:** the app **must** use a **dedicated database instance** (typically a **Docker Compose** service or another **isolated** local server). **Forbidden:** pointing local dev at shared production/staging databases or reusing another engineer’s live DB without an isolated schema/database name and documented connection.

**Testing:** integration and E2E jobs that touch persistence **must** use their **own** database service (or disposable schema) in the test compose stack; **never** the developer’s personal DB. Reset/migrate via Prisma (`migrate`, `db push`, or test harness) as defined in the brief / infra tasks.

**Legacy note:** existing slices using raw drivers (e.g. `better-sqlite3` without Prisma) are **technical debt**; new work and migrations should move to Prisma unless **`deviations_from_baseline`** documents a time-boxed exception and migration plan.

**Stable id:** `persistence-prisma-isolated-db`

---

## 2. Frontend architecture

### Atomic Design (preferred UI decomposition model) ###
`.cursor/skills/architecture-standards/SKILL.md`  

**Purpose:** Prefer structuring UI as **atoms → molecules → organisms** when building or evolving reusable interfaces. This remains the default frontend composition model because it supports incremental reuse and clearer ownership of visual responsibility.

**Suggested folders:** `components/ui/atoms`, `.../molecules`, `.../organisms` (adapt to existing layout; do not invent parallel trees without reason).

**When to diverge:** if the existing product already uses another coherent component taxonomy, prefer extending that taxonomy instead of creating a competing tree. Record the choice in the brief when it departs materially from Atomic terminology.

---

### Styling strategy (decision required, repo-aware) ###
`.cursor/skills/architecture-standards/SKILL.md`  

**Purpose:** Styling technology is a **feature-level architectural decision** guided by repo consistency, theming needs, SSR/hydration requirements, type safety, and long-term maintainability.

**If styled-components is chosen:** co-locate styles with components; avoid untyped dynamic styled factories; prefer a typed theme (`DefaultTheme`) and centralized tokens (color, spacing). Follow SSR/hydration guidance for the installed library version with Next (registry/provider if required).

**If another strategy is chosen:** the brief must state the technology, why it is preferable for the slice, and how tokens/theming/reuse stay coherent with the rest of the product.

---

## 3. Delivery task generation rules

- Every task in the delivery JSON must include **`architecture_refs`**: array of stable ids from this skill that match the **chosen** architectural direction for that slice, e.g. `["clean-architecture", "atomic-design"]`, whenever the task touches affected code.
- Do **not** mix pure domain work with UI in the same task; split by `task_slug` / sector per `production-workflow`.
- **Granularity:** tasks must be **small and single-purpose**. **Never** one **`frontend-agent`** task for **multiple** Stitch screens or **multiple** top-level routes; use **one `task_slug` per screen/route** (shared shell/tokens as separate tasks). See **`.cursor/agents/delivery.md` → Frontend / Stitch granularity**.
- Persistence-facing tasks must reference **`persistence-prisma-isolated-db`** when they touch the DB layer.
- Acceptance criteria must be checkable against these rules (examples: “no `react` imports under `domain/`”, “component classified as molecule in Atomic tree”).

### Stable ids (use in `architecture_refs`)

- `clean-architecture`
- `ddd-tactical`
- `singleton-policy`
- `atomic-design`
- `styled-components`
- `qa-validation` (use on **`quality-gate`** / QA-only tasks)
- `unit-tests-full-coverage` — see **`.cursor/skills/testing-and-qa-standards/SKILL.md`**
- `integration-tests-full-coverage` — same
- `integration-tests-isolated-containers` — same
- `qa-manual-automated-e2e-chromium` — same
- `persistence-prisma-isolated-db` — Prisma ORM + isolated DB for dev and test (see §Persistence)

---

## 4. Evolving this document

Global baseline changes (e.g. changing the preferred styling stack or UI composition model) are proposed by **`architecture-agent`** as an edit to this `SKILL.md` plus a recorded decision in `architecture-brief.json`; human approval is implied when the change is accepted in review.

---

## 5. Summary (“who does what”)

| Layer | Artifact | One-line purpose |
|--------|-----------|------------------|
| Policy | This skill | Cross-cutting standards and traceable ids for tasks. |
| Per feature | `architecture-agent` + `architecture-brief.json` | Narrows architecture for the feature without breaking the skill. |
| Backlog | `delivery-agent` | Creates tasks and `task.json` with `architecture_refs` + brief alignment. |
| Execution | `engineering-manager-agent` + specialists | Ensures every assignee receives brief path + this skill as mandatory input. |
| Post-QA governance | `improvement-agent` → `orchestrator-agent` Step 11 | Records improvement plans under `projects/<project_slug>/tasks/<feature_slug>/improvements/`; orchestrator may apply allowlisted edits to this skill or other `.cursor/**` assets—**not** product code. |
