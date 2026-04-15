# UI normalizado — `mvp-primary-dashboard`

**Fonte:** `design_package.json` (surface_id, stitch), `ui-exploration.md` (layout attempt 1), `architecture-brief.json` (ferramenta interna, um surface MVP).  
**Sistema:** `design_system.json` (tokens e tabela de rastreabilidade).

## 1. Grade e densidade

- **Base:** múltiplos de **8px**; passo auxiliar **4px** só para pares ícone+texto (`space-1`).
- **Densidade:** `balanced` — cartões com `space-4` interno, regiões com `space-5`/`space-6`.

## 2. Regiões do canvas (Dashboard)

### Faixa superior (app header) ###

`design_system.json` → componente `shell-app-header`

**Propósito:** Contexto do produto, ações globais e eventual busca; altura mínima 64px, `padding-inline` `space-6`, fundo `bg-elevated`, borda inferior `border-subtle`.

---

### Coluna lateral (navegação secundária) ###

`design_system.json` → componente `nav-sidebar`

**Propósito:** Largura fixa normalizada **264px** (32×8 + 24×1 alinhado à grade), `padding` `space-4`, itens com `gap` `space-2`, tipografia `type-label`.

---

### Coluna principal ###

`design_system.json` → componente `surface-main-column`

**Propósito:** Lista/grid de tarefas e painéis de apoio; `padding` `space-6`, `section_gap` `space-5`, fundo `bg-app`, landmark `main`.

---

### Lista de tarefas ###

`design_system.json` → componente `card-task-row`

**Propósito:** Cada linha/cartão com `padding` `space-4`, `gap` `space-3`, `radius-md`, título até 2 linhas (`type-body`), meta `type-caption` + `fg-muted`.

---

### CTA primária ###

`design_system.json` → componente `button-primary`

**Propósito:** Ação “Nova tarefa” (ou equivalente); variantes `sm`/`md`, estados default/hover/focus/disabled/loading mapeados a `accent-primary` / `accent-primary-hover` e `shadow-focus-ring`.

---

### Filtros / chips ###

`design_system.json` → componente `chip-filter`

**Propósito:** Filtros em `radius-pill`, `padding_x` `space-3`, `padding_y` `space-1`, tom neutro `bg-subtle` vs ativo `accent-primary`.

---

### Indicadores de status ###

`design_system.json` → componente `badge-status`

**Propósito:** Tons `semantic-success` | `semantic-warning` | `semantic-error` com rótulo textual obrigatório (não depender só da cor).

## 3. Tipografia na tela (≤4 tamanhos)

| Papel      | Token        | Uso na superfície        |
|-----------|--------------|---------------------------|
| Título    | `type-title` | Título da página / seções principais |
| Corpo     | `type-body`  | Linhas principais da lista |
| Rótulo    | `type-label` | Cabeçalhos de coluna, filtros |
| Legenda   | `type-caption` | Metadados, datas, contadores |

`type-display` fica reservado a no máximo um título de shell se o header exigir hierarquia extra.

## 4. Elevação

- Preferir **borda** `border-subtle` em tema escuro.
- `shadow-sm` apenas para dropdowns/popovers; anel de foco `shadow-focus-ring`.

## 5. Rastreio ao baseline Stitch

- **Projeto / tela:** `stitch.project_id` `3675777318594458616`, `screen_ids[0]` `11611814ea7a4a2881d76c0c95fd3066`, nome **Dashboard** (`ui-exploration.md`).
- **Cores/sombras:** provisórias até export ou aprovação de baseline; ver `design_system.json` → `traceability_notes` e `blockers` em `design_package.json`.

## 6. Resumo por "quem faz o quê"

| Camada        | Artefato              | Propósito em uma frase |
|---------------|------------------------|-------------------------|
| Pacote design | `design_package.json` | Aponta surface, Stitch e status do fluxo. |
| Sistema       | `design_system.json`  | Tokens + componentes canônicos com rastreabilidade. |
| Narrativa UI  | `ui-normalized.md`    | Descreve o layout só com tokens nomeados. |
