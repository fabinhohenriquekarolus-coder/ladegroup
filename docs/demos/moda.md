# Meia-Luz, ateliê de moda

Site institucional fictício de um ateliê de roupa autoral, com duas páginas: a home da marca e a coleção com cor e tamanho por peça, favoritos e sacola lateral com progresso do frete grátis.

Pasta: `public/demos/sites/moda/`. Testes: `tests/demos/moda.test.js`.

## Páginas

| Página | Conteúdo |
| --- | --- |
| `index.html` | Início, a marca (história e números), destaques da coleção atual, lookbook, como cada peça é feita (etapas e tecidos), entrega, troca e devolução, avaliações, loja física com endereço e horário, perguntas frequentes, contato e novidades por e-mail |
| `colecao.html` | Coleção Entretempo com 12 peças, filtro por categoria, ordenação, cor e tamanho por peça, favoritos, tabela de medidas, condições de compra e sacola |

Cabeçalho e rodapé são iguais nas duas páginas. A página atual fica marcada com `aria-current="page"`. Na home, o botão do cabeçalho leva à coleção; na coleção, ele abre a sacola.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `bagKey`, `addToBag`, `changeQty` | Mesma peça em cor ou tamanho diferente vira outra linha, zero remove |
| `bagSummary(linhas, limite)` | Total, quantidade, se ganhou frete grátis, quanto falta e progresso |
| `piecesLabel(n)` | "1 peça" ou "12 peças" |
| `sortPieces`, `shippingMessage` | Ordem da coleção, menor ou maior preço, e a frase do frete |

## Interação (`js/app.js`)

- A cor escolhida troca o tom da ilustração da peça (variável CSS `--g`).
- A sacola é um diálogo com `aria-modal`, fundo inerte, Esc e botão Fechar. O foco volta ao botão que a abriu.
- Sacola vazia mantém "Finalizar compra" desabilitado e mostra o valor mínimo do frete grátis.
- `js/site.js` cuida do menu no celular e carrega os avisos de demonstração dos botões fictícios (`data-demo-action`).
