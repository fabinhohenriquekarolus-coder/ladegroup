# Maré, painel de gestão

Painel de uma loja fictícia: faturamento por 7, 30 ou 90 dias, canais de venda, mapa de calor por dia e horário, metas do mês, mais vendidos e pedidos recentes.

Pasta: `public/demos/sistemas/painel-de-gestao/`. Testes: `tests/demos/painel-de-gestao.test.js`.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `chartPoints(valores, largura, altura, margens)` | Converte a série em pontos dentro da área útil do gráfico |
| `smoothPath(pontos)` | Curva suave (Catmull-Rom) para o caminho do SVG |
| `nearestIndex(proporção, quantidade)` | Ponto mais próximo do ponteiro, dentro dos limites |
| `donutSegments(fatias, raio)` | Traço e deslocamento de cada fatia da rosca |
| `goalProgress(meta, extra)` | Percentual da meta somando os pedidos simulados |
| `addIncoming(estado, pedidos)` | Novo estado com o pedido simulado no topo, sem alterar o anterior |

As séries de `js/data.js` são fixas e somam exatamente o total de cada período (coberto por teste).

## Interação

- O gráfico tem uma tabela equivalente oculta para leitor de tela e se redesenha ao mudar o tamanho da tela.
- Cada célula do mapa de calor é um botão com rótulo completo. O valor aparece ao passar o mouse ou focar.
