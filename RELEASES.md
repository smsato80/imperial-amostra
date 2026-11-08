# RELEASES — Publicações e pontos de restauração

Site: https://smsato80.github.io/imperial-amostra/site.html
Repositório: smsato80/imperial-amostra (branch `main` = produção do GitHub Pages)

Regra permanente (Minoru, 08/11/2026): antes de cada publicação, criar tag de restauração `imperial-backup-AAAA-MM-DD-vN` apontando para o commit que está em produção, sem sobrescrever tags existentes. Restauração preferencial por reversão auditável (revert), sem force push.

| Data | Commit publicado | Versão anterior | Tag de restauração | Descrição |
|---|---|---|---|---|
| 2026-11-08 | 61d5c3e (+ docs) | 47867ac | imperial-backup-2026-11-08-v2 → 47867ac | Refinamento premium: compactação, lightbox, formulários em colunas/etapas e rodapé composto. Detalhes no CHANGELOG.md. |
| 2026-11-08 | a8a6b07 (+ docs) | 1dcde12 | imperial-backup-2026-11-08-v1 → 1dcde12 | Correção complementar: licença do Rodrigo, imagens de serviços clicáveis, formulários dinâmicos por serviço. Detalhes no CHANGELOG.md. |
| 2026-11-08 | 1dcde12 | 7496ec6 | (anterior ao sistema de tags) | Revisão consolidada da Entrega (ZIP do Minoru): HTMLs corrigidos + 2 imagens do hero. Rollback registrado na época: commit 03ba3e3 (contexto) / ponto imediato 7496ec6. |
| 2026-11-07 | 7496ec6 | — | — | Fotos de categorias definitivas aprovadas. |

## Como restaurar
- "Voltar para a versão anterior": reverter o commit da última publicação na `main` (git revert), publicar e confirmar no ar.
- Versão específica: usar o commit ou a tag indicada nesta tabela.
