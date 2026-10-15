import { mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { site } from '../src/data/site.js';

const root = new URL('../', import.meta.url);
const output = fileURLToPath(new URL(`public${site.ogImage}`, root));
const font = async (path) => (await readFile(new URL(path, root))).toString('base64');

const montserrat = await font('node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2');
const openSans = await font('node_modules/@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2');

const hex = (size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 56 56" aria-hidden="true"><polygon points="54,28 41,50.5 15,50.5 2,28 15,5.5 41,5.5" fill="#FFFFFF"/><polygon points="48,28 38,45.3 18,45.3 8,28 18,10.7 38,10.7" fill="#0D0D0D"/><polygon points="41,28 34.5,39.3 21.5,39.3 15,28 21.5,16.7 34.5,16.7" fill="#C9A227"/></svg>`;

const page = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<style>
@font-face { font-family: 'Montserrat'; font-weight: 100 900; src: url(data:font/woff2;base64,${montserrat}) format('woff2'); }
@font-face { font-family: 'Open Sans'; font-weight: 300 800; src: url(data:font/woff2;base64,${openSans}) format('woff2'); }
* { box-sizing: border-box; margin: 0; }
body {
  width: 1200px;
  height: 630px;
  overflow: hidden;
  background: radial-gradient(620px 420px at 92% 8%, rgba(201, 162, 39, 0.2), transparent 65%), #0D0D0D;
  color: #FFFFFF;
  font-family: 'Open Sans', sans-serif;
}
.frame { position: relative; display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 64px 80px 60px; }
.brand { display: flex; align-items: center; gap: 16px; font: 700 26px/1 'Montserrat', sans-serif; letter-spacing: 0.04em; }
h1 { max-width: 720px; font: 700 54px/1.1 'Montserrat', sans-serif; letter-spacing: -0.02em; }
p { max-width: 640px; margin-top: 20px; color: rgba(255, 255, 255, 0.74); font-size: 24px; line-height: 1.45; }
.foot { display: flex; align-items: center; gap: 28px; font-size: 22px; }
.foot b { color: #C9A227; font: 700 23px/1 'Montserrat', sans-serif; letter-spacing: 0.02em; }
.foot span { color: rgba(255, 255, 255, 0.62); }
.art { position: absolute; right: -80px; top: 125px; opacity: 0.9; }
</style>
</head>
<body>
<div class="frame">
  <div class="brand">${hex(52)}<span>${site.brand}</span></div>
  <div>
    <h1>Sistemas feitos sob medida para o seu negócio funcionar melhor.</h1>
    <p>Bot de atendimento no WhatsApp, painéis de gestão e sistemas sob medida.</p>
  </div>
  <div class="foot"><b>${new URL(site.url).host}</b><span>Joinville e região, SC</span></div>
  <div class="art">${hex(380)}</div>
</div>
</body>
</html>`;

await mkdir(dirname(output), { recursive: true });
const browser = await chromium.launch();

try {
  const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const tab = await context.newPage();
  await tab.setContent(page, { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: output, type: 'png' });
  console.log(`gerado: public${site.ogImage}`);
} finally {
  await browser.close();
}
