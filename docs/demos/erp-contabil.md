# Razão, ERP contábil

Tela de escritório contábil com árvore de clientes, grades de lançamentos, obrigações e documentos, painel de detalhes e barra de status.

Pasta: `public/demos/sistemas/erp-contabil/`. Testes: `tests/demos/erp-contabil.test.js`.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `money(valor)` | Formato brasileiro com duas casas |
| `totalOf(lançamentos)` | Soma do período |
| `openFindings(cliente, conferido)` | Apontamentos ainda não revisados, só depois da conferência |
| `pendingObligations(cliente)`, `deliveryProgress(cliente)` | Obrigações em aberto e percentual entregue |
| `sortRows(linhas, regra)`, `toggleSort(regra, chave)` | Ordenação sem alterar a lista original e troca de direção |
| `needsReview(documento, limite)` | Documento abaixo da confiança mínima pede revisão até ser aprovado |

## Interação

- Cabeçalhos ordenáveis com `aria-sort`. A primeira célula de cada linha é um botão, então a seleção funciona pelo teclado.
- Abas com setas, Home e End. Barra de progresso com `role="progressbar"`.
- "Conferir com IA" e "Classificar com IA" são simulações com dados fixos. Documentos de baixa confiança ficam marcados para revisão humana.
