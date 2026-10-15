# Eixo Norte, autopeças B2B

Site institucional de uma distribuidora fictícia para oficinas e lojas, com duas páginas: a home da empresa e o catálogo com cotação por volume.

Pasta: `public/demos/sites/autopecas/`. Testes: `tests/demos/autopecas.test.js`.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Cabeçalho com busca, hero com desenho técnico em SVG, condições para lojistas, empresa, linhas de produtos, como funciona o cadastro, diferenciais, cobertura de entrega, depoimentos, endereço e horários, perguntas frequentes, contato e rodapé |
| `catalogo.html` | Consulta de peças com busca, categoria, linha e "só com estoque", cotação com desconto por volume e formulário de CNPJ |

O menu marca a página atual com `aria-current="page"`. A busca do cabeçalho da home abre `catalogo.html?q=termo`, e os links das linhas abrem `catalogo.html?categoria=freios`.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `matchesFilters(peça, filtros)` | Busca sem acento e sem diferença de maiúsculas, com categoria, linha e "só com estoque" |
| `discountRate`, `lineTotal` | Faixas de desconto por código (dados em `js/data.js`): 5% a partir de 10 unidades e 8% a partir de 50 |
| `clampQty(valor)` | Quantidade entre 1 e 999 |
| `addToQuote`, `changeQty`, `quoteSummary` | Itens da cotação, subtotal, desconto e total |
| `formatCnpj`, `isValidCnpj` | Máscara enquanto digita e validação pelos dígitos verificadores |
| `filtersFromQuery(query, categorias)` | Lê `q` e `categoria` do endereço da página do catálogo, com termo limitado a 60 caracteres |

## Interação

- No catálogo, o botão Cotar leva a quantidade do código para a cotação, e os botões de mais e menos ajustam as unidades. Zerar remove o item.
- Itens sob encomenda entram na cotação com aviso de prazo.
- CNPJ inválido mostra o erro ligado ao campo (`aria-describedby`, `aria-invalid`). Nenhum CNPJ é guardado ou enviado.
- No celular a tabela do catálogo e a tabela de prazos viram cartões, com o nome de cada coluna antes do valor.
- Botões de ligar, cadastro e como chegar usam `data-demo-action` e só mostram um aviso.

## Visual

Aço escuro, laranja de segurança e faixa de alerta, com Roboto Condensed nos títulos e Roboto no texto (fontes em `fonts/`, com licenças). Sem imagens externas: o desenho do disco de freio, o centro de distribuição, o mapa de rotas e o mapa do endereço são SVG inline.
