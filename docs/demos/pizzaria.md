# Fornalha Vivo, pizzaria e delivery

Site institucional de uma pizzaria a lenha fictícia, com duas páginas: a home institucional e o cardápio com pedido e taxa por bairro.

Pasta: `public/demos/sites/pizzaria/`. Testes: `tests/demos/pizzaria.test.js`.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Hero, história da casa e etapas da massa de 48 horas, quatro pizzas em destaque, resumo da entrega com tabela de taxa e prazo por bairro, diferenciais, três avaliações, endereço e horário com mapa ilustrativo, dúvidas frequentes, contato e rodapé |
| `cardapio.html` | Cardápio por categoria, escolha de tamanho, pedido e taxa de entrega por bairro |

O cabeçalho e o rodapé são os mesmos nas duas páginas. A página atual fica marcada com `aria-current="page"`. Os links entre as páginas são relativos (`cardapio.html`, `index.html#entrega`).

O cardápio está no HTML: cada `article.dish` tem `data-id`, `data-name`, `data-media` e `data-grande` (preços em centavos). O JavaScript lê esses atributos. A página inicial carrega só `js/site.js` (menu em popover e avisos de demonstração); `js/app.js` roda apenas no cardápio.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `priceFor(prato, tamanho)` | Preço pelo tamanho, quando o prato tem grande |
| `lineKey`, `addDish`, `changeQty` | Linhas do pedido: mesma pizza em tamanhos diferentes vira linhas separadas, zero remove |
| `cartSummary(linhas, taxa)` | Subtotal, quantidade, total com taxa e se o pedido pode ser finalizado |

## Interação (cardápio)

- "Finalizar pedido" só libera com item e bairro escolhidos. Nada é enviado.
- A taxa e o prazo aparecem assim que o bairro é escolhido.
- Quantidade com botões de mais e menos, o foco fica no mesmo botão após a mudança.
- Botões de ligação, WhatsApp, mapa e orçamento mostram um aviso de demonstração (`data-demo-action`), sem abrir contatos reais.
