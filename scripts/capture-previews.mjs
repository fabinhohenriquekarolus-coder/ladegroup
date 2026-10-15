import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const output = fileURLToPath(new URL('../src/assets/previews/', import.meta.url));

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

const resolveFile = async (url) => {
  const path = normalize(decodeURIComponent(new URL(url, 'http://local').pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(root, path);
  const info = await stat(file).catch(() => null);
  if (info?.isDirectory()) file = join(file, 'index.html');
  return file;
};

const server = createServer(async (request, response) => {
  try {
    const file = await resolveFile(request.url);
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end();
  }
});

const hideChrome = '.demo-bar, .demo-badge, .demo-toast, .demo-skip { display: none !important; }';

const demos = [
  {
    slug: 'lacar',
    path: 'demos/lacar/',
    use: async (page) => {
      await page.evaluate(() => document.querySelector('#painel .lc-app').scrollIntoView());
      await page.click('#aba-caixa');
    },
  },
  {
    slug: 'barbearia',
    path: 'demos/sistemas/barbearia/',
    use: async (page) => {
      await page.click('#aba-clube');
    },
  },
  {
    slug: 'crm-imobiliario',
    path: 'demos/sistemas/crm-imobiliario/',
    use: async (page) => {
      await page.click('[data-open]');
      await page.click('[data-ai]');
    },
  },
  {
    slug: 'erp-contabil',
    path: 'demos/sistemas/erp-contabil/',
    use: async (page) => {
      await page.click('[data-check]');
      await page.waitForSelector('.is-flag [data-open]');
      await page.click('.is-flag [data-open]');
    },
  },
  {
    slug: 'painel-de-gestao',
    path: 'demos/sistemas/painel-de-gestao/',
    use: async (page) => {
      await page.click('[data-period="30"]');
      await page.click('#simulate');
    },
  },
  {
    slug: 'agendamento',
    path: 'demos/sistemas/agendamento/',
    use: async (page) => {
      await page.click('[data-appt="a11"]');
    },
  },
  {
    slug: 'pizzaria',
    path: 'demos/sites/pizzaria/',
    use: async (page) => {
      await page.click('[data-id="margherita"] [data-add]');
      await page.click('[data-size="grande"]');
      await page.click('[data-id="calabresa"] [data-add]');
      await page.selectOption('#bairro', 'serena');
      await page.evaluate(() => document.querySelector('#cardapio').scrollIntoView());
    },
  },
  {
    slug: 'petshop',
    path: 'demos/sites/petshop/',
    use: async (page) => {
      await page.click('#calc .tm-option:nth-child(2)');
      await page.click('#calc .tm-check:nth-child(1)');
      await page.evaluate(() => document.querySelector('#precos').scrollIntoView());
    },
  },
  {
    slug: 'moda',
    path: 'demos/sites/moda/',
    use: async (page) => {
      await page.evaluate(() => document.querySelector('#colecao').scrollIntoView());
      await page.click('[data-id="aurora"] [data-add]');
    },
  },
  {
    slug: 'autopecas',
    path: 'demos/sites/autopecas/',
    use: async (page) => {
      await page.fill('[data-code="EN-1042"] .qty', '12');
      await page.click('[data-code="EN-1042"] [data-add]');
      await page.click('[data-code="EN-5120"] [data-add]');
      await page.evaluate(() => document.querySelector('#catalogo').scrollIntoView());
    },
  },
];

await mkdir(output, { recursive: true });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch();

try {
  const only = process.argv.slice(2);
  for (const demo of only.length ? demos.filter((item) => only.includes(item.slug)) : demos) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(base + demo.path, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: hideChrome });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(output, `${demo.slug}-inicio.jpg`), type: 'jpeg', quality: 82 });
    await demo.use(page);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(output, `${demo.slug}-uso.jpg`), type: 'jpeg', quality: 82 });
    await context.close();
    console.log(`capturado: ${demo.slug}`);
  }
} finally {
  await browser.close();
  server.close();
}
