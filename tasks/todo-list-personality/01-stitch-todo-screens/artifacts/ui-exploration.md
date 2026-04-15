# Estação FM TODO — exploração Stitch (SoT)

## Direção de arte (fixada)

Tema escolhido: **estúdio de fita cassete / rádio retro** (“Analog Tape Studio” / *Analog Archivist* no export do Stitch).

- **Paleta:** creme `#fff8ef`, laranja fita `#ff6b35` / primário queimado, teal rádio `#00696b`, texto carvão.
- **Tipografia:** Space Grotesk (display / rótulos estilo etiqueta) + Work Sans (corpo).
- **Metáforas:** deck de fita, dial, equalizador discreto, chips como etiquetas Dymo, botão de gravar.
- **Voz:** microcopy em **português** (títulos, empty state, CTAs).

## Telas exportadas (ordem = `stitch.screen_ids`)

1. **Dashboard principal (canônico)** — split: coluna “equipamento” + lista densa com estados, chips Todas/Hoje/Pendentes/Feitas, bloco Hoje, contador, input “Nova tarefa…” + “Gravar na fita”.
2. **Empty state** — “Sua mesa está em silêncio”, ilustração de fita vazia, CTA “Começar mix do dia”.
3. **Arquivo B-side** — coluna central ~720px, tarefas concluídas com timestamps “gravado…”, navegação “Voltar ao ar ao vivo”.
4. **Mobile** — chips horizontais, “LADO A - HOJE”, lista compacta, barra inferior com gravar.

## Stitch

- **Projeto:** `projects/15292424477056339521` (ID numérico `15292424477056339521`)
- **Reabrir no Stitch:** listar projetos com título **Todo List Personality** na conta MCP conectada.

## Nota de convivência com `design/stitch/meta.json`

Este batch atualizou `meta.json` apenas para `feature_slug: todo-list-personality`. Outros slices que apontavam o mesmo ficheiro para outro `project_id` devem alinhar via EM (meta duplicado por feature, ou restauração de índice).
