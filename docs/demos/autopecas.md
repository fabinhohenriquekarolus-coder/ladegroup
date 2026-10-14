# Eixo Norte, autopeças B2B

Site de distribuidora fictícia para lojistas, com catálogo por código, estoque por item e cotação com desconto por volume.

Pasta: `public/demos/sites/autopecas/`. Testes: `tests/demos/autopecas.test.js`.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `matchesFilters(peça, filtros)` | Busca sem acento e sem diferença de maiúsculas, com categoria, linha e "só com estoque" |
| `discountRate`, `lineTotal` | Faixas de desconto por código (dados em `js/data.js`) |
| `clampQty(valor)` | Quantidade entre 1 e 999 |
| `addToQuote`, `changeQty`, `quoteSummary` | Itens da cotação, subtotal, desconto e total |
| `formatCnpj`, `isValidCnpj` | Máscara enquanto digita e validação pelos dígitos verificadores |

## Interação

- No celular a tabela vira cartões, com o nome de cada coluna antes do valor.
- CNPJ inválido mostra o erro ligado ao campo (`aria-describedby`, `aria-invalid`). Nenhum CNPJ é guardado ou enviado.
