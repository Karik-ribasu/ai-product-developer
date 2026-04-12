---
name: production-workflow
description: Enforces a strict orchestrator pipeline (exploration → discovery → architecture → delivery → engineering manager executes specialists+QA → improvement-agent → orchestrator applies governance edits). Use when acting as orchestrator, coordinating multi-agent delivery, or when the user requires validated handoffs and delegation-only execution.
---

# Production Workflow (Orchestrator)

## Core rule (critical)

The orchestrator **must not** perform domain-specific work: no **product** code, no product/architecture decisions, no “fixing” another agent’s output by rewriting it. It **routes**, **validates I/O**, and **enforces order**.

**Exception (mandatory closing phase):** after **`improvement-agent`** writes a registered plan, the orchestrator **may apply file edits** **only** as specified in [Step 11 — Apply improvement plan](#step-11--apply-improvement-plan-orchestrator) and **only** under the [Orchestrator apply allowlist](#orchestrator-apply-allowlist-improvement-step). All other editing by the orchestrator remains forbidden.

### Multi-agent execution (mandatory)

- **No monolithic implementation:** a single specialized agent must not be given the entire product or an end-to-end slice that spans multiple engineering disciplines “for speed.” Work is split so each assignment maps to **one** accountable specialist and **one** `sector` (see [Sector vocabulary](#sector-vocabulary-english)).
- **No bypass:** product-changing work (code, migrations, CI, infra scripts that ship behavior) is done **only** when the **engineering manager** invokes the **assigned** specialist—never by the orchestrator, never by ad-hoc “just implement it” in a generic or catch-all agent, and never by collapsing multiple sectors into one specialist without an explicit EM split (each piece still gets its own `agent` + `sector`).
- **Handoff shape:** every delegation from the engineering manager to a specialist states **`agent`** and **`sector`** (English) exactly as in the validated engineering manager output, plus the **`task_slug`** (and path to `task.json`) for the task registry.

### Orchestrator invocation boundary (mandatory)

The orchestrator **may invoke only**: `exploration-agent`, `discovery-agent`, `architecture-agent`, `delivery-agent`, `engineering-manager-agent`, **`improvement-agent`**.

The orchestrator **must not invoke** (no `Task` / no handoff as “orchestrator → …”): `frontend-agent`, `backend-agent`, `infra-engineer`, `data-engineer`, `blockchain-developer`, **`qa-agent`**, or any other implementation/validation specialist. Those are **only** invoked by **`engineering-manager-agent`**, which also owns sequencing through QA and fix loops.

**`improvement-agent` ordering:** invoke **`improvement-agent` exactly once** as the **last** `Task` delegation in a full `build` run **after** EM reports QA **`pass`**. Do **not** invoke `improvement-agent` before EM/QA completion. Do **not** delegate any other agent after `improvement-agent` in the same orchestrator run (next is Step 11 apply, then final output).

---

## High-level pipeline

User input → **Exploration** → Discovery → **Architecture** → Delivery → **Engineering Manager** (plans **and** delegates to all specialists **including QA**) → consolidated engineering report → Orchestrator validation → **`improvement-agent` (last delegated agent)** → **Orchestrator applies governance edits from registered plan** → Final output

---

## Step 1 — Receive input

- Capture the user request verbatim enough to replay intent.
- Normalize into one clear **problem statement** (no solution design).

---

## Step 2 — Invoke Exploration

**Target:** `exploration-agent`  
**Input:** normalized problem statement + constraints and unknowns from the user.  
**Expected output:** per `.cursor/agents/exploration-agent.md` — all items under **Output Requirements** (Objective, Options Identified, Comparison, Recommendation optional, Key Insights, Risks & Unknowns).  
**Validation:**

- If any required section is missing → **retry** exploration with a gap list (orchestrator does not author exploration content).
- Exploration is **never optional** in this workflow.

---

## Step 3 — Invoke Discovery

**Target:** `discovery-agent`  
**Input:** normalized problem statement + constraints + **validated exploration output**.  
**Expected output (contract):** see [Discovery output](#discovery-output).  
**Validation:**

- If `decision` is not `build` (and not explicitly allowed to continue per team policy) → **STOP**; return discovery outcome to the user.
- If required fields are missing → **retry** discovery with a gap list (do not fill gaps yourself).

---

## Step 4 — Invoke Architecture

**Target:** `architecture-agent`  
**Input:** validated discovery output + exploration context + any technical constraints from the user.  
**Expected output:** per `.cursor/agents/architecture-agent.md` — **`tasks/<feature_slug>/architecture-brief.json`** (schema v1) + short summary in prose.  
**Gate:**

- **Skip** this step when `decision` is not **`build`** (e.g. `kill` → pipeline stops earlier; `iterate` only if the orchestrator explicitly continues to delivery for a scoped iteration **without** a new brief—otherwise run architecture again).

**Validation:**

- `feature_slug` in the brief is `kebab-case` ASCII and matches what **delivery** will use for `tasks/<feature_slug>/`.
- Brief aligns with `.cursor/skills/architecture-standards/SKILL.md` (no contradictions).
- If the brief is missing required fields → **retry** `architecture-agent` with a gap list (orchestrator does not author the brief).

---

## Step 5 — Invoke Delivery

**Target:** `delivery-agent`  
**Input:** validated discovery output + exploration context + **read** `.cursor/skills/architecture-standards/SKILL.md` + **`tasks/<feature_slug>/architecture-brief.json`** from Step 4 (when `decision` was `build`).  
**Expected output (contract):** see [Delivery output](#delivery-output).  
**Validation:**

- Tasks must be actionable and traceable to `mvp_scope`.
- Each task should have testable **acceptance** criteria and non-empty **`architecture_refs`** (see architecture-standards skill) whenever the task touches implementation surfaces.
- **`feature_slug`** in delivery JSON must **equal** `feature_slug` in `architecture-brief.json` (when Step 4 ran).
- **Registry:** for every item in `tasks[]`, a matching `tasks/<feature_slug>/<task_slug>/task.json` must exist on disk and match the [Task registry](#task-registry-on-disk) schema.
- If unclear → send back to delivery with concrete refinement questions (do not author tasks yourself).

---

## Step 6 — Invoke Engineering Manager

**Target:** `engineering-manager-agent`  
**Input:** validated delivery output **and** confirmation that every delivery task is registered under `tasks/<feature_slug>/<task_slug>/task.json` (paths/slugs must match the delivery JSON contract) **and** path to **`tasks/<feature_slug>/architecture-brief.json`**.  
**Expected output (contract):** see [Engineering manager output](#engineering-manager-output), plus an **engineering execution report** when the manager’s cycle finishes (artifacts summary, per-task status, QA outcome).  
**Validation:**

- Every task has exactly one accountable **owner agent** and exactly one **`sector`** (each row references an existing **`task_slug`**).
- Assignments must not bundle multiple sectors; if work crosses sectors, **delivery/engineering manager** must split into separate assignments (each with its own `agent` + `sector`) before implementation.
- `execution_order` respects dependencies; parallel work is explicit; **`qa-agent`** appears in the plan where validation is required (typically after implementation tasks), using `quality-engineering`.

**Iterate note (quality gate proportionality):** When Discovery returns **`decision: iterate`** with a small delta, **delivery** (with EM alignment) may narrow **`quality-gate`** acceptance in the matching **`task.json`** to the **commands and surfaces touched** by that delta (for example lint/tests plus a documented smoke path) as long as the written acceptance reflects that scope. For cross-cutting risk, keep the broader gate. This clarifies proportionality; it does **not** waive the requirement for a QA **`pass`** before **`improvement-agent`**.

---

## Step 7 — Engineering execution (engineering manager only)

**Target:** `engineering-manager-agent` (same invocation as Step 6 continues the **execution** phase—conceptually “plan then run,” still owned by EM).

For each assignment in `execution_order`:

**Delegates to:** the assigned specialist only (`frontend-agent`, `backend-agent`, `infra-engineer`, `data-engineer`, `blockchain-developer`, **`qa-agent`**, …).  
**Input:** task title/description + acceptance + **`task_slug`** + path to `tasks/.../task.json` + **`agent` + `sector`** + path to **`tasks/<feature_slug>/architecture-brief.json`** + pointer to **`.cursor/skills/architecture-standards/SKILL.md`** + exploration/discovery context as needed (do not invent scope).  
**Rules (for EM, not orchestrator):**

- Do not edit task scope to “improve” it; bounce back to delivery if wrong.
- Parallelize only when the plan says dependencies allow it.
- **Invoke** only the agent named in the assignment; payload must include **`sector`** and **`task_slug`**.
- Update **`task.json`** when ownership is set (`assigned_agent`, `sector`, `status`).

**Orchestrator rule:** the orchestrator **does not** perform Step 7 delegations; it waits for the engineering manager’s consolidated report.

---

## Step 8 — Collect results (orchestrator)

- Receive the **engineering execution report** from `engineering-manager-agent` (artifacts, commands, per-`task_slug` outcomes, QA `validation_status` + `issues`).
- Cross-check **task registry** folders and `task.json` **status** / ownership fields vs assignments.
- Check for **missing** deliverables vs delivery acceptance criteria.

---

## Step 9 — QA gate (orchestrator validation only)

- Do **not** invoke `qa-agent` from the orchestrator. Confirm the EM report includes QA results: **`validation_status`**: `pass` | `fail`, **`issues`**: structured list.
- If **fail** → return control to **`engineering-manager-agent`** with the QA `issues` and affected `task_slug` list; EM re-invokes the responsible specialists, then **`qa-agent`** again. Repeat until pass or explicit user stop.

---

## Step 10 — Invoke improvement-agent (orchestrator)

**When:** only on **`decision: build`** paths where Step 9 confirms QA **`pass`** in the EM-furnished report.

**Target:** `improvement-agent` (see `.cursor/agents/improvement-agent.md`).

**Input:** `feature_slug`; paths to `tasks/<feature_slug>/architecture-brief.json`; EM **`engineering_execution_report`** (and pointers to `task.json` files as needed); short validated summary of discovery/delivery if available.

**Expected output:**

- All **Output Requirements** in `improvement-agent.md` (reply + **mandatory** on-disk plan + **append-only** `history.jsonl`).

**Validation:**

- Plan file exists under `tasks/<feature_slug>/improvements/plans/` and matches [Improvement plan (on-disk)](#improvement-plan-on-disk).
- `history.jsonl` received a new line with matching `plan_path`.
- Every `orchestrator_apply: true` item lists only paths under the [Orchestrator apply allowlist](#orchestrator-apply-allowlist-improvement-step).

**If invalid** → retry `improvement-agent` with a gap list (orchestrator does not author the plan).

**Ordering rule:** this is the **last** `Task` the orchestrator invokes in the run (`improvement-agent` is **never** followed by another delegated agent).

---

## Step 11 — Apply improvement plan (orchestrator)

**When:** immediately after a **valid** Step 10 plan exists on disk.

The orchestrator **applies** file changes **only** by executing edits that are:

1. Listed in the latest valid plan under `improvement_opportunities[]` with `"orchestrator_apply": true`, and  
2. Whose every `target_paths` entry is under the **allowlist** below, and  
3. Consistent with `proposed_change` (no scope expansion).

**Orchestrator apply allowlist (improvement step)**

- `.cursor/rules/**`
- `.cursor/agents/**`
- `.cursor/skills/**`
- `tasks/_template/**` (templates only)

**Forbidden targets for orchestrator apply:** `app/`, `src/`, product tests, per-feature `tasks/<feature_slug>/<task_slug>/task.json` (registry), `architecture-brief.json`, `package.json` / lockfiles, infra that ships app behavior, and any path not explicitly allowed above.

If the plan requests disallowed targets, **skip** those items, record them in the Step 12 summary as **skipped (out of allowlist)**, and do not patch.

---

## Step 12 — Final output

Only after Step 11 completes (or Step 10 skipped per policy below):

- Summary of what shipped (by `task_slug` / `agent` / `sector`), mapped to `success_metrics`.
- Confirmation against acceptance criteria and registry paths.
- **Improvement:** path to the plan file + `history.jsonl`; list of files the orchestrator changed in Step 11 (or `none`).
- If Step 10 **skipped** (e.g. pipeline stopped before QA pass, or `decision` ≠ `build`): state **why** `improvement-agent` was not run.

---

## Delegation protocol (mandatory)

Each handoff states:

1. **Invoke:** `<agent-name>`
2. **Input:** payload (JSON or structured markdown matching contracts below)
3. **Expected:** bullet list of required fields/artifacts

Example:

```text
Invoke: exploration-agent

Input:
{ "problem_statement": "...", "constraints": ["..."] }

Expected:
- Objective, Options Identified, Comparison, Key Insights, Risks & Unknowns (per exploration-agent.md)
```

Example (engineering manager → specialist — **orchestrator does not send this**):

```text
Invoke: frontend-agent

Input:
{
  "task_slug": "03-todo-ui",
  "task_path": "tasks/local-todo-app/03-todo-ui/task.json",
  "task": "Build todo list UI shell and client mutations",
  "agent": "frontend-agent",
  "sector": "frontend-engineering",
  "acceptance": ["..."]
}

Expected:
- Assignee updates `task.json` status; files touched only within frontend scope; meets acceptance criteria
```

Example (orchestrator → architecture):

```text
Invoke: architecture-agent

Input:
{ "discovery": { "...": "validated contract" }, "exploration_summary": "...", "user_constraints": ["..."] }

Expected:
- tasks/<feature_slug>/architecture-brief.json (schema v1) + prose summary; aligns with architecture-standards skill
```

---

## Data contracts

### Discovery output

```json
{
  "decision": "build | iterate | kill",
  "problem": "string",
  "mvp_scope": ["string"],
  "success_metrics": ["string"]
}
```

### Delivery output

```json
{
  "feature_slug": "string",
  "epics": [],
  "tasks": [
    {
      "task_slug": "string",
      "title": "string",
      "description": "string",
      "acceptance": ["string"],
      "depends_on": ["string"],
      "architecture_refs": ["string"]
    }
  ]
}
```

`feature_slug` and each `task_slug` must match the on-disk paths under `tasks/`. `depends_on` lists other **`task_slug`** values in the same feature (omit or `[]` if none). **`architecture_refs`** must list stable ids from `.cursor/skills/architecture-standards/SKILL.md` for any task that changes implementation; use `[]` only for purely procedural/docs tasks if explicitly justified. Include a final **`quality-gate`** (or equivalent) **`task_slug`** for QA validation so it is registered and assignable like other work.

### Engineering manager output

```json
{
  "assignments": [
    {
      "task_slug": "string",
      "task": "string",
      "agent": "string",
      "sector": "string"
    }
  ],
  "execution_order": ["string"],
  "engineering_execution_report": {
    "feature_slug": "string",
    "validation_status": "pass | fail",
    "issues": [],
    "per_task": [{ "task_slug": "string", "outcome": "string", "notes": "string" }],
    "artifacts": { "paths": [], "commands": [] }
  }
}
```

`execution_order` is an ordered list of **`task_slug`** values (including the QA **`task_slug`** when QA is in scope). `engineering_execution_report` is required when the engineering cycle is reported back to the orchestrator; **`issues`** follows the QA agent’s structured format.

Field names are stable; empty arrays/objects are allowed only when explicitly justified by upstream agents.

### Improvement plan (on-disk)

**Root:** `tasks/<feature_slug>/improvements/`

- **Plans:** `tasks/<feature_slug>/improvements/plans/<ISO8601_Z>_<slug>_plan.json` — schema **`kind`: `improvement-plan`**, version and fields per `.cursor/agents/improvement-agent.md`.
- **History:** append-only **`tasks/<feature_slug>/improvements/history.jsonl`** — each line is one JSON object with `kind`: `improvement-history-entry` (see `improvement-agent.md`).

**Who writes what**

- **`improvement-agent`:** creates the `improvements/` tree, writes each **plan** file, and **appends** one line to **`history.jsonl`**. Does not edit product source or per-task `task.json` registry entries.
- **`orchestrator-agent` (Step 11 only):** may edit files **only** under the [Orchestrator apply allowlist](#orchestrator-apply-allowlist-improvement-step) and **only** as directed by a validated plan’s `orchestrator_apply: true` items.

### Task registry (on-disk)

**Root:** repository-relative `tasks/<feature_slug>/<task_slug>/` (one directory per delivery task).

**File:** `task.json` — UTF-8, single object, **no** comments. **Schema (version 1):**

| Field | Type | Required | Notes |
|--------|------|----------|--------|
| `schema_version` | `1` | yes | Bump only if the contract changes |
| `feature_slug` | string | yes | Matches parent folder |
| `task_slug` | string | yes | Matches leaf folder |
| `title` | string | yes | Short title |
| `description` | string | yes | One short paragraph |
| `acceptance` | string[] | yes | Testable criteria |
| `depends_on` | string[] | yes | Other `task_slug` in same feature; use `[]` if none |
| `status` | string | yes | `planned` \| `assigned` \| `in_progress` \| `blocked` \| `done` \| `failed_qa` |
| `assigned_agent` | string \| null | yes | Agent id after EM assigns; `null` until then |
| `sector` | string \| null | yes | English sector after EM assigns; `null` until then |
| `updated_at` | string | yes | ISO-8601 UTC timestamp of last registry write |

**Who writes what**

- **`delivery-agent`:** creates the directory and initial `task.json` (`status`: `planned`, `assigned_agent` / `sector`: `null`, `schema_version`: `1`, `updated_at` set).
- **`engineering-manager-agent`:** sets `assigned_agent`, `sector`, `status` → `assigned` when dispatching; may set `blocked` with notes in `description` only if policy allows (prefer a new chat turn to delivery for scope change).
- **Assignee specialist (one task at a time):** sets `status` to `in_progress` when starting, `done` when complete, or `failed_qa` / `blocked` when appropriate; refreshes `updated_at`.
- **`qa-agent`:** may set `failed_qa` or leave `done` unchanged after verification; updates `updated_at`; records details in the EM **engineering_execution_report** / QA output, not only in JSON, if space is tight.

Keep extra fields out of `task.json` for now—**only** the table above.

### Sector vocabulary (English)

Use these **canonical** `sector` values (extend only if discovery/delivery documents the new discipline and matching agent):

| `sector` | Typical `agent` |
|----------|-----------------|
| `frontend-engineering` | `frontend-agent` |
| `backend-engineering` | `backend-agent` |
| `data-engineering` | `data-engineer` |
| `infrastructure-engineering` | `infra-engineer` |
| `blockchain-engineering` | `blockchain-developer` |
| `quality-engineering` | `qa-agent` |

`qa-agent` is invoked **only by `engineering-manager-agent`**, in execution order, for the registered QA **`task_slug`** (e.g. `quality-gate`). Implementation tasks use the other sectors. **`sector` must be English** even when user-facing text is another language.

---

## Failure handling

- Invalid or incomplete agent output → **same agent retry** with a validation checklist (orchestrator does not patch that agent’s JSON/content **except** Step 11 governance applies from **`improvement-agent`** plans).
- Invalid `architecture-brief.json` → **retry** `architecture-agent` (orchestrator does not patch the brief).
- QA fail reported by EM → **engineering-manager-agent** re-plans re-invokes (orchestrator does not call `qa-agent` or implementers directly).
- Ambiguity → **ask the user**; no silent assumptions.

---

## Anti-patterns (forbidden)

- Writing or editing **product / application** code as the orchestrator (allowed governance edits are **only** Step 11 + allowlist).
- Applying improvement items **outside** the registered plan or **outside** the Step 11 allowlist.
- Creating or rewriting delivery tasks manually.
- Skipping **Exploration**, Discovery, **Architecture (when `decision: build`)**, Delivery, EM, or QA.
- On **`decision: build`** with QA **`pass`**: skipping **`improvement-agent`**, delegating **any agent after** `improvement-agent`, or skipping **Step 11** when the plan contains valid `orchestrator_apply: true` items inside the allowlist.
- Collapsing steps “to save time”.
- Making product decisions that belong to Discovery/Delivery or implementation agents.
- **Single-agent full build:** one specialist implements the whole feature or stack alone when the work clearly spans multiple sectors.
- **Missing `sector` or wrong language** on assignments or delegations.
- **Bypassing specialists:** any repo or product change not executed under an explicit `agent` + `sector` assignment from the engineering manager (with the pipeline above).
- **Orchestrator calling engineering or QA agents:** violates invocation boundary; only `engineering-manager-agent` may call those specialists.
- **Missing task registry:** delivery did not create `tasks/<feature_slug>/<task_slug>/task.json` for each task (including QA gate slug).
- **Missing architecture traceability:** delivery tasks lack **`architecture_refs`** where they touch implementation, or `feature_slug` disagrees with `architecture-brief.json`.

---

## Operating style

Procedural, deterministic handoffs; strict validation; explicit delegation. Creativity belongs in specialized agents, not in routing.

---

## Additional resources

- For agent persona details, read the matching file under `.cursor/agents/` (for example `exploration-agent.md`, `discovery.md`, `architecture-agent.md`, `delivery.md`, `engineering-manager.md`, `qa-agent.md`, **`improvement-agent.md`**).
- For **coverage, containerized integration tests, and QA Chromium E2E policy**, read **`.cursor/skills/testing-and-qa-standards/SKILL.md`** (see also `.cursor/rules/mandatory-testing-and-qa-standards.mdc`).
