# Lade Group, site institucional

Site da Lade Group ([ladegroup.com.br](https://ladegroup.com.br)). Apresenta os sistemas sob medida, a automação de atendimento e as melhorias para negócios de Joinville e região, com um portfólio de demonstrações navegáveis e o LaCar, sistema próprio em produção.

## Stack

- [Astro](https://astro.build) 7 com saída estática em `dist/`. As páginas do site não carregam JavaScript.
- CSS próprio, um arquivo por bloco de interface, com cores, raios e fontes em `src/styles/tokens.css`.
- Fontes servidas pelo próprio site via Fontsource: Montserrat nos títulos e Open Sans no corpo.
- Demonstrações do portfólio em HTML, CSS e JavaScript puro, em `public/demos/`.
- Testes com `node --test`, sem bibliotecas extras.
- Playwright como dependência de desenvolvimento, usado só para gerar imagens.

Não há variáveis de ambiente, segredos, formulários, cookies ou ferramentas de rastreamento. O contato é feito pelo WhatsApp.

## Requisitos

Node 22.12 ou superior (versão em `.nvmrc`).

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Site e demonstrações em `http://localhost:4321` |
| `npm run build` | Gera o site estático em `dist/` |
| `npm run preview` | Serve o `dist/` localmente |
| `npm test` | Testa as regras das demonstrações |
| `npm run previews` | Depois do build, recaptura as imagens dos cards do portfólio. `npm run previews -- lacar` recaptura só um exemplo |
| `npm run og` | Gera a imagem de compartilhamento em `public/og/lade-group.png` |

Depois de `npm run previews`, rode `npm run build` de novo para otimizar as novas imagens.

## Estrutura

```
src/
  pages/          uma página por arquivo (.astro) e o robots.txt
  layouts/        BaseLayout: head, cabeçalho e rodapé
  components/     peças reutilizadas (botão do WhatsApp, card de demonstração, faixa de contato)
  data/
    site.js       nome, domínio, telefone, mensagens do WhatsApp e menu
    demos/        cards do portfólio
    icons.js      ícones em SVG
  styles/         tokens, base, layout e um arquivo por bloco, reunidos em index.css
  assets/previews imagens dos cards, geradas por scripts/capture-previews.mjs
public/
  demos/          demonstrações do portfólio (ver docs/demos/README.md)
  og/             imagem de compartilhamento
  favicon.svg, logo.svg
scripts/          geração das imagens dos cards e da imagem de compartilhamento
tests/demos/      testes das regras de cada demonstração
docs/demos/       documentação técnica das demonstrações
```

## Páginas

| Endereço | Arquivo |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/servicos.html` | `src/pages/servicos.astro` |
| `/portfolio.html` | `src/pages/portfolio.astro` |
| `/sobre.html` | `src/pages/sobre.astro` |
| `/contato.html` | `src/pages/contato.astro` |
| `/privacidade.html` | `src/pages/privacidade.astro` |
| `/termos.html` | `src/pages/termos.astro` |
| `/404.html` | `src/pages/404.astro` |
| `/demos/...` | `public/demos/` |

O build usa `format: 'file'`, então cada página vira um arquivo `.html` e os links internos apontam para esses arquivos.

## Convenções

- Nenhum comentário no código publicado.
- Texto e dado que se repete fica em `src/data/`, não espalhado nas páginas.
- Links internos do site são absolutos (`/servicos.html`). Nas demonstrações são relativos, para funcionarem em qualquer subcaminho.
- Estilo só por classe e por token. Nada de estilo inline nas páginas do site.
- Acessibilidade WCAG 2.2 AA: link para pular ao conteúdo, foco visível, contraste mínimo, rótulos em todo controle, layout sem rolagem horizontal de 320 px a 1440 px e `prefers-reduced-motion` respeitado.

## WhatsApp

Número e mensagens ficam em `src/data/site.js`. `whatsappLinkFor(origem)` monta o link com a mensagem da página (`home` e `servicos` têm mensagem própria; as demais usam a padrão). Cada demonstração tem a sua mensagem no próprio HTML.

## SEO e compartilhamento

- `canonical`, título e descrição únicos por página, Open Graph e cartão grande para redes sociais com a imagem de `public/og/`.
- Sitemap gerado pelo `@astrojs/sitemap`, sem a 404.
- `robots.txt` gerado em `src/pages/robots.txt.js`, com `/demos/` bloqueado. As demonstrações e a 404 também levam `noindex`.

## Publicação

Qualquer hospedagem de arquivos estáticos serve: o comando de build é `npm run build` e a pasta publicada é `dist/`. Na Vercel o Astro é detectado sozinho e a `404.html` é usada automaticamente. Em servidor próprio, configure a página de erro para `/404.html`.

Antes de publicar:

1. `npm test`
2. `npm run build` sem erros
3. Conferir as páginas com `npm run preview`

## Demonstrações

A estrutura, as regras de negócio, os testes e as fontes de cada exemplo estão em [docs/demos/README.md](docs/demos/README.md).
