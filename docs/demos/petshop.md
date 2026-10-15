# Toca Mansa, pet shop

Site institucional fictício de um pet shop, com duas páginas: a home da marca e o agendamento do banho.

Pasta: `public/demos/sites/petshop/`. Testes: `tests/demos/petshop.test.js`.

## Páginas

| Página | Conteúdo |
| --- | --- |
| `index.html` | Hero, sobre a loja, serviços com tabela de preços, equipe (Marina, Rafael e Júlia, avatares com iniciais), como cuidamos e passo a passo do banho, depoimentos, endereço e horário, perguntas frequentes e contatos |
| `agendar.html` | Passo 1, estimativa do banho por porte e adicionais. Passo 2, formulário de dia e horário com resumo de confirmação |

Cabeçalho e rodapé são iguais nas duas páginas, com a página atual marcada por `aria-current="page"`. Os links entre as páginas são relativos. Botões de ligar, WhatsApp e mapa usam `data-demo-action` e só mostram um aviso.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `estimate(porte, adicionais)` | Soma preço e tempo |
| `formatDuration(minutos)` | "1 h 35 min" |
| `takenHours`, `isAvailable` | Horários ocupados por dia (dados em `js/data.js`) |
| `missingFields(dados)` | O que falta preencher, na ordem do formulário |
| `listInPortuguese(lista)` | "a, b e c" |
| `bookingSummary`, `hoursHint` | Texto do resumo e da dica de horários livres |

## Interação

- Porte e adicionais em `radio` e `checkbox` nativos, escondidos com `opacity: 0` e clicados pelo rótulo. O foco aparece no cartão do porte e na caixa do adicional.
- Cada horário mostra "livre" ou "ocupado" depois que um dia é escolhido. Horário ocupado fica desabilitado.
- Erros em `role="alert"` e foco no primeiro campo vazio. O botão "Agendar com esse serviço" leva o serviço do formulário para "Banho e tosa".
- Nada é enviado: a confirmação aparece só na página.
