# Compasso, agendamento e clientes

Agenda semanal de um estúdio fictício, com equipe, serviços de duração diferente, painel de detalhes e cadastro de clientes.

Pasta: `public/demos/sistemas/agendamento/`. Testes: `tests/demos/agendamento.test.js`.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `toMinutes`, `toTime` | Converte "09:30" em minutos e de volta |
| `endOf(atendimento, serviços)` | Fim pelo tempo do serviço |
| `findConflict(lista, candidato, serviços)` | Conflito só para o mesmo profissional no mesmo dia. Encostar no horário seguinte não conflita |
| `fitsBusinessHours(...)` | Se o serviço termina antes do fechamento |
| `assignLanes(lista, serviços)` | Distribui atendimentos sobrepostos em colunas, sem alterar a entrada |
| `nextFreeStart(...)` | Próximo horário livre em blocos de 30 minutos, ou `null` |
| `slotFromOffset(...)` | Converte a posição do clique na grade em horário |

## Interação

- Clique em espaço vazio ou "Novo agendamento" abre o formulário rápido, com aviso de conflito e de horário de fechamento.
- Confirmar, remarcar para o próximo horário livre e cancelar pelo painel. Filtro por profissional.
- Clientes com filtro por tipo e cadastro novo (nome escapado antes de entrar na tela).
