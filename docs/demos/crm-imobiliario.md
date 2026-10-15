# Morada, CRM imobiliário

Funil de vendas de uma imobiliária fictícia. Mostra cartões por etapa, ficha do contato em gaveta lateral, imóveis compatíveis, conversa e um assistente de IA simulado.

Pasta: `public/demos/sistemas/crm-imobiliario/`. Testes: `tests/demos/crm-imobiliario.test.js`.

## Regras (`js/rules.js`)

| Função | O que faz |
| --- | --- |
| `shortMoney(valor)` | Formata em "R$ 480 mil" ou "R$ 3,2 mi" |
| `closingChance(contato)` | Chance de fechar pela etapa e pelo nível de interesse, com teto de 100 |
| `funnelStats(contatos)` | Ativos, valor em negociação e conversão do funil |
| `stageTotal(contatos, etapa)` | Soma do orçamento por etapa |
| `nextStep`, `suggestedMessage`, `leadSummary` | Textos do assistente simulado, montados a partir dos dados do contato |
| `autoReply(contato)` | Resposta simulada do cliente na conversa |
| `moveToStage(contato, etapa, nome)` | Devolve um contato novo na etapa e registra na linha do tempo |

`js/view.js` monta os SVG da fachada do imóvel, do nível de interesse, do medidor de chance e do anel de compatibilidade.

## Interação

- Arrastar cartões entre etapas, ou abrir a ficha e trocar a etapa pelo seletor (alternativa sem arrastar).
- Abas da ficha com setas, Home e End. Fundo inerte enquanto a gaveta está aberta, Esc fecha e o foco volta ao cartão.
- O assistente é uma simulação: o texto vem de regras fixas, não de um modelo de IA.
