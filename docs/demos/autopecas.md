# Eixo Norte, autopeças B2B

Site institucional de uma distribuidora fictícia que vende para oficinas e lojas, com catálogo por código, estoque por item e cotação com desconto por volume.

Pasta: `public/demos/sites/autopecas/`. Testes: `tests/demos/autopecas.test.js`.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Início com desenho técnico de um disco de freio, condições para lojistas, empresa e centro de distribuição, linhas de produtos, como funciona o cadastro, diferenciais, cobertura de entrega, depoimentos, endereço e horários, perguntas frequentes e contato comercial |
| `catalogo.html` | Catálogo com busca, categorias, linha, "só com estoque", quantidades, cotação com desconto por volume e CNPJ |

As duas páginas usam o mesmo cabeçalho e o mesmo rodapé. O link da página atual leva `aria-current="page"`. Abaixo de 900 px a busca do topo some e a navegação vira um menu (`js/site.js`, com `aria-expanded` e Esc para fechar).

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `matchesFilters(peça, filtros)` | Busca sem acento e sem diferença de maiúsculas, com categoria, linha e "só com estoque" |
| `discountRate`, `lineTotal` | Faixas de desconto por código (dados em `js/data.js`) |
| `clampQty(valor)` | Quantidade entre 1 e 999 |
| `addToQuote`, `changeQty`, `quoteSummary` | Itens da cotação, subtotal, desconto e total |
| `formatCnpj`, `isValidCnpj` | Máscara enquanto digita e validação pelos dígitos verificadores |
| `filtersFromQuery(endereço, categorias)` | Lê `?q=` e `?categoria=` para abrir o catálogo já filtrado |

## Interação

- A busca do topo em `index.html` abre `catalogo.html?q=...`. No catálogo, a mesma busca filtra a tabela sem recarregar e leva o foco ao título.
- Os cartões de linhas de produtos abrem o catálogo na categoria (`catalogo.html?categoria=freios#catalogo`).
- No celular a tabela vira cartões, com o nome de cada coluna antes do valor.
- CNPJ inválido mostra o erro ligado ao campo (`aria-describedby`, `aria-invalid`). Nenhum CNPJ é guardado ou enviado.
- Botões de contato ("Falar com o comercial", "Ligar", "Como chegar", "Solicitar cadastro") só mostram um aviso (`data-demo-action`).
