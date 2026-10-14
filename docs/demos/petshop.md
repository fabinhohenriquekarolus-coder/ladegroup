# Toca Mansa, pet shop

Site de pet shop fictício com serviços, estimativa de preço do banho e agendamento.

Pasta: `public/demos/sites/petshop/`. Testes: `tests/demos/petshop.test.js`.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `estimate(porte, adicionais)` | Soma preço e tempo |
| `formatDuration(minutos)` | "1 h 35 min" |
| `takenHours`, `isAvailable` | Horários ocupados por dia (dados em `js/data.js`) |
| `missingFields(dados)` | O que falta preencher, na ordem do formulário |
| `listInPortuguese(lista)` | "a, b e c" |

## Interação

- Porte e adicionais em `radio` e `checkbox` nativos, com aparência própria e foco visível.
- Horário ocupado fica desabilitado e o leitor de tela ouve "ocupado". Erros em `role="alert"` e foco no primeiro campo vazio.
