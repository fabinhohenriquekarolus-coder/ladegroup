# Fornalha Vivo, pizzaria e delivery

Site de pizzaria fictícia com cardápio por categoria, tamanho média ou grande, pedido e taxa por bairro.

Pasta: `public/demos/sites/pizzaria/`. Testes: `tests/demos/pizzaria.test.js`.

O cardápio está no HTML: cada `article.dish` tem `data-id`, `data-name`, `data-media` e `data-grande` (preços em centavos). O JavaScript lê esses atributos.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `priceFor(prato, tamanho)` | Preço pelo tamanho, quando o prato tem grande |
| `lineKey`, `addDish`, `changeQty` | Linhas do pedido: mesma pizza em tamanhos diferentes vira linhas separadas, zero remove |
| `cartSummary(linhas, taxa)` | Subtotal, quantidade, total com taxa e se o pedido pode ser finalizado |

## Interação

- "Finalizar pedido" só libera com item e bairro escolhidos. Nada é enviado.
- Quantidade com botões de mais e menos, o foco fica no mesmo botão após a mudança.
