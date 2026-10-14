# LaCar, atendimento e gestão para lava-rápido

Página de apresentação do LaCar, sistema da Lade Group em produção, com um trecho do painel que dá para usar. A identidade segue o sistema real: Geist, verde-petróleo `#073b3a`, água `#118a86`, dourado `#d9a441`, cartões com 14 px de raio e controles com 8 px. Os nomes, horários e valores são fictícios.

Pasta: `public/demos/lacar/`. Testes: `tests/demos/lacar.test.js`.

## Seções

- Topo com conversa de exemplo no WhatsApp.
- Modos do atendente (Bot, Copiloto e Só eu) em abas, cada um com a sua conversa.
- Painel com Agenda (dia e semana), Clientes (busca e acompanhamento), Fluxo de caixa (7 dias, 30 dias e mês) e Serviços (preço por porte).
- Ladinho, o consultor financeiro, respondendo perguntas a partir dos mesmos números do painel.
- Automações, como começa, perguntas frequentes e contato.

## Dados (`js/data.js`)

A data de hoje é fixa (`2026-10-14`) para a demonstração não mudar com o relógio. O caixa de 12, 13 e 14 de outubro é a soma dos atendimentos concluídos na agenda, e o total do mês bate com o resumo por serviço e por horário que o Ladinho usa. Os testes conferem essas somas.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `addDays`, `daysBetween`, `weekday` | Datas ISO em UTC, sem depender do fuso de quem abre a página |
| `priceFor(serviço, porte)` | Preço do porte, ou `null` quando o serviço não é oferecido |
| `assignLanes(lista, serviços)` | Distribui os atendimentos em boxes, ignorando cancelados |
| `daySummary(lista)` | Texto de resumo do dia da agenda |
| `filterClients(lista, filtro, hoje)` | Busca sem acento e filtro de quem não volta há mais de 30 dias |
| `periodRange(período, hoje)` | Intervalo de 7 dias, 30 dias ou do mês |
| `cashSummary`, `dailySeries`, `peakDay` | Totais, série por dia e maior dia do período |
| `recentMovements`, `groupByDate` | Últimas entradas e saídas agrupadas por dia |
| `ladinhoAnswer(pergunta, dados)` | Resposta do Ladinho calculada a partir dos dados |

## Interação

- Abas com setas, Home e End nos modos do atendente e nas seções do painel.
- Agenda por dia com setas para o dia anterior e o seguinte, e por semana com os atendimentos posicionados pelo horário. Clicar no dia da semana abre a agenda daquele dia.
- Botões que gravariam algo (novo agendamento, desligar serviço, enviar sugestão) só mostram um aviso.
- O Ladinho mostra "escrevendo" por um instante, exceto com `prefers-reduced-motion`.
