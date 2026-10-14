# Meia-Luz, loja de moda

Loja fictícia com coleção filtrável, cor e tamanho por peça, favoritos e sacola lateral com progresso do frete grátis.

Pasta: `public/demos/sites/moda/`. Testes: `tests/demos/moda.test.js`.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `bagKey`, `addToBag`, `changeQty` | Mesma peça em cor ou tamanho diferente vira outra linha, zero remove |
| `bagSummary(linhas, limite)` | Total, quantidade, se ganhou frete grátis, quanto falta e progresso |
| `piecesLabel(n)` | "1 peça" ou "12 peças" |

## Interação

- A cor escolhida troca o tom da ilustração da peça (variável CSS `--g`).
- A sacola é um diálogo com `aria-modal`, fundo inerte, Esc e botão Fechar. O foco volta ao botão Sacola.
