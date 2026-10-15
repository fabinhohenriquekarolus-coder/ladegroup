# Régua, gestão para barbearia

Sistema de uma barbearia fictícia com agenda por cadeira, fila de encaixe, clube de assinantes e caixa com comissões. Paleta vinho, latão e creme, com a fonte Archivo em largura condensada nos títulos.

Pasta: `public/demos/sistemas/barbearia/`. Testes: `tests/demos/barbearia.test.js`.

A data (`2026-10-14`) e a hora (`15:10`) são fixas em `js/data.js`, para a tela não mudar com o relógio. O caixa do dia soma só atendimentos já concluídos nesse horário.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `statusAt(atendimento, serviços, agora)` | Concluído, na cadeira ou agendado, pela hora atual |
| `busyIntervals(barbeiro, atendimentos, serviços)` | Atendimentos e pausa do barbeiro como intervalos ocupados |
| `nextSlot(ocupados, minutos, desde, fechamento)` | Primeiro intervalo livre que cabe o serviço, em blocos de 5 minutos |
| `planQueue(contexto)` | Para cada pessoa da fila, a cadeira e o horário mais cedo, reservando o horário para a pessoa seguinte |
| `fitWalkIn(plano, id)` | Transforma quem está na fila em atendimento marcado |
| `earliestSlot(contexto, minutos)` | Próximo horário livre do dia, em qualquer cadeira |
| `dayTotals`, `cashSummary` | Serviço, clube, produtos e comissão por barbeiro, e o total do dia |
| `paymentsBreakdown` | Pix, cartão e dinheiro. O que é do clube não entra |
| `subscriptionStatus`, `filterSubscribers` | Em dia, vencendo (até 5 dias) ou atrasado, ordenado do mais urgente |
| `renewSubscriber` | Registrar pagamento renova por 30 dias e zera os usos do mês |

Comissão: percentual do serviço por barbeiro, 10% sobre produtos e valor fixo por atendimento do clube.

## Interação

- Abas Hoje, Clube e Caixa e comissões, com setas, Home e End.
- Encaixar leva a pessoa da fila para a agenda no horário calculado. A fila e os indicadores se atualizam e o foco volta ao título da fila.
- Novo encaixe valida o nome (mensagem ligada ao campo) e limita a fila a 8 pessoas.
- Registrar pagamento no clube atualiza a situação, a receita e os atrasados.
- Botões que gravariam algo de verdade só mostram um aviso.
