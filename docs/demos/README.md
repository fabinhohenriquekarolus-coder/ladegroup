# Demonstrações do portfólio

Oito exemplos navegáveis (quatro sistemas e quatro sites) feitos em HTML, CSS e JavaScript puro, sem framework e sem dependências em tempo de execução. Todos usam marcas e dados fictícios, não fazem requisições externas e não guardam nada: o estado vive só na memória da página.

## Onde fica cada coisa

```
public/demos/
  comum/                 base compartilhada pelas oito demonstrações
    demo.css             reset, barra "Demonstração", selo e aviso
    toast.js             aviso acessível (role="status") e botões data-demo-action
    html.js              template html`` que escapa todo valor interpolado
    fonts/               Montserrat e Open Sans da barra da Lade
  sistemas/<exemplo>/    crm-imobiliario, erp-contabil, painel-de-gestao, agendamento
  sites/<exemplo>/       pizzaria, petshop, moda, autopecas
    index.html           estrutura e conteúdo
    styles.css           identidade visual do exemplo
    js/data.js           dados fictícios
    js/rules.js          regras de negócio em funções puras, sem DOM
    js/view.js           montagem de SVG (só no CRM)
    js/app.js            estado da tela e eventos
    fonts/               fontes do exemplo e suas licenças
tests/demos/             testes das regras de cada exemplo
scripts/capture-previews.mjs   gera as imagens dos cards do portfólio
src/assets/previews/     imagens geradas pelo script acima
```

O Astro copia `public/` sem processar, então cada pasta funciona como está. As URLs ficam em `/demos/sistemas/<exemplo>/` e `/demos/sites/<exemplo>/`.

## Convenções

- Nenhum comentário no código publicado.
- Caminhos relativos em tudo (`../../comum/demo.css`, `../../../portfolio.html`), para a pasta funcionar em qualquer subcaminho.
- `rules.js` não toca no DOM nem em estado global: recebe dados e devolve dados novos, sem alterar a entrada. É o que os testes cobrem.
- Todo HTML montado no JavaScript passa pelo template `html` de `comum/html.js`, que escapa cada valor interpolado. Texto digitado pela pessoa (nome, mensagem, CNPJ) nunca entra cru em `innerHTML`.
- Nos sites, o conteúdo (cardápio, catálogo, produtos) está no HTML e o JavaScript só lê `data-*` e cuida da interação. Nos sistemas, a interface é montada a partir de `data.js`.
- Cada exemplo tem paleta, fontes, caixas e tabelas próprias. A única peça visual compartilhada é a barra preta da Lade no topo.
- Raio de borda: até 8 px em cartões, até 6 px em botões e campos, círculo só em avatar e indicador.

## Acessibilidade (WCAG 2.2 AA)

- Link "Ir para a demonstração" no início, `lang="pt-BR"` e marcos `header`, `main` e `footer`.
- Foco visível em todo controle e contraste mínimo de 4,5:1 em texto e 3:1 em bordas de campo.
- Abas com `role="tablist"`, setas e Home/End. Gavetas e diálogos com `aria-modal`, `inert` no fundo, Esc para fechar e foco devolvido a quem abriu.
- Arrastar tem alternativa sem arrastar (no CRM, o seletor de etapa na ficha).
- Gráficos têm tabela equivalente para leitor de tela (painel) ou `aria-label` com o valor.
- `prefers-reduced-motion` desliga animações e a digitação simulada.
- Layout testado de 320 px a 1440 px, sem rolagem horizontal na página.

## Como rodar

```
npm install
npm run dev          site e demonstrações em http://localhost:4321
npm test             testes das regras (node --test, sem dependências)
npm run build
npm run previews     depois do build: recaptura as imagens dos cards
npm run build        de novo, para otimizar as novas imagens
```

`npm run previews` usa o Playwright (dependência de desenvolvimento) e o Chromium já instalado na máquina.

## Fontes

Todas são servidas pelo próprio site, só no subconjunto latino (cobre o português), e vêm do Fontsource. As licenças estão ao lado de cada arquivo, em `fonts/LICENSE-*.txt` (SIL Open Font License 1.1).

| Exemplo | Títulos | Corpo |
| --- | --- | --- |
| Barra da Lade | Montserrat | Open Sans |
| Cumeeira, CRM | Plus Jakarta Sans | Plus Jakarta Sans |
| Razão, ERP | IBM Plex Sans | IBM Plex Sans e IBM Plex Mono |
| Maré, painel | Inter | Inter |
| Compasso, agenda | Rubik | Rubik |
| Fornalha Vivo, pizzaria | Oswald | Source Sans 3 |
| Toca Mansa, pet shop | Poppins | Nunito Sans |
| Meia-Luz, moda | Cormorant Garamond | Manrope |
| Eixo Norte, autopeças | Roboto Condensed | Roboto |

## Documentação de cada exemplo

- [Cumeeira, CRM imobiliário](crm-imobiliario.md)
- [Razão, ERP contábil](erp-contabil.md)
- [Maré, painel de gestão](painel-de-gestao.md)
- [Compasso, agendamento](agendamento.md)
- [Fornalha Vivo, pizzaria](pizzaria.md)
- [Toca Mansa, pet shop](petshop.md)
- [Meia-Luz, loja de moda](moda.md)
- [Eixo Norte, autopeças B2B](autopecas.md)
