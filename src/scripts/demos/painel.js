import { periods, kpiLabels } from '../../data/demos/painel.js';

const buttons = document.querySelectorAll('[data-period]');
const kpiRoot = document.querySelector('#kpis');
const chartRoot = document.querySelector('#chart');
const chartTable = document.querySelector('#chart-table');
const topRoot = document.querySelector('#top');
const caption = document.querySelector('#period-caption');

const tops = [4000, 6000, 8000, 10000, 12000, 16000, 20000, 24000, 30000, 40000, 60000, 80000, 90000, 100000];

const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const int = (value) => value.toLocaleString('pt-BR');
const format = { money, int };

const delta = (value) => `<span class="app-badge ${value >= 0 ? 'is-ok' : 'is-bad'}">${value >= 0 ? '+' : '−'}${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%</span>`;

const renderKpis = (period) => {
  kpiRoot.innerHTML = kpiLabels
    .map(
      ([key, label, type]) => `<div class="app-card">
        <div class="app-kpi-label">${label}</div>
        <div class="app-kpi-value">${format[type](period.kpis[key])}</div>
        <div class="app-kpi-foot">${delta(period.deltas[key])} <span>vs. período anterior</span></div>
      </div>`,
    )
    .join('');
};

const renderChart = (period) => {
  const width = Math.max(300, Math.round(chartRoot.clientWidth));
  const height = 240;
  const pad = { top: 20, right: 12, bottom: 30, left: 52 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(...period.series.map(([, value]) => value));
  const top = tops.find((value) => value >= max * 1.05);
  const slot = innerW / period.series.length;
  const barW = Math.min(52, slot * 0.58);
  const grid = [0, 0.5, 1]
    .map((ratio) => {
      const y = pad.top + innerH - innerH * ratio;
      return `<line x1="${pad.left}" x2="${width - pad.right}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1"/>
        <text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" font-size="12" fill="var(--soft)">${int(Math.round((top * ratio) / 1000))} mil</text>`;
    })
    .join('');
  const bars = period.series
    .map(([label, value], index) => {
      const h = (value / top) * innerH;
      const x = pad.left + slot * index + (slot - barW) / 2;
      const y = pad.top + innerH - h;
      const highlight = value === max;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="${highlight ? 'var(--gold)' : 'var(--black)'}"/>
        <text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">${int(Math.round(value / 100) / 10)} mil</text>
        <text x="${x + barW / 2}" y="${height - 8}" text-anchor="middle" font-size="12" fill="var(--soft)">${label}</text>`;
    })
    .join('');
  chartRoot.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="chart-title">
      <title id="chart-title">Faturamento ${period.label.toLowerCase()}</title>${grid}${bars}</svg>`;
  chartTable.innerHTML = `<caption>Faturamento ${period.label.toLowerCase()}</caption>
    <tr><th>Intervalo</th><th>Faturamento</th></tr>${period.series.map(([label, value]) => `<tr><td>${label}</td><td>${money(value)}</td></tr>`).join('')}`;
};

const renderTop = (period) => {
  const max = period.top[0][1];
  topRoot.innerHTML = period.top
    .map(
      ([name, qty]) => `<li class="painel-top-row">
        <div class="painel-top-line"><span>${name}</span><strong>${int(qty)}</strong></div>
        <div class="painel-bar" aria-hidden="true"><span style="width:${(qty / max) * 100}%"></span></div>
      </li>`,
    )
    .join('');
};

let current = periods['7'];

const select = (key) => {
  const period = periods[key];
  current = period;
  buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.period === key)));
  caption.textContent = period.label;
  renderKpis(period);
  renderChart(period);
  renderTop(period);
};

buttons.forEach((button) => button.addEventListener('click', () => select(button.dataset.period)));

select('7');

let resizeTimer;
new ResizeObserver(() => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => renderChart(current), 120);
}).observe(chartRoot);
