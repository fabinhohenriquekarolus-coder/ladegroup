import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { periods, channels, products, bands, heat, goals, feed, incoming } from './data.js';
import { money, moneyCents, integer, smoothPath, chartPoints, nearestIndex, donutSegments, goalProgress, addIncoming } from './rules.js';

const $ = (selector) => document.querySelector(selector);
const periodButtons = document.querySelectorAll('[data-period]');

let state = { period: '7', extra: { revenue: 0, orders: 0 }, feed: [...feed], incomingIndex: 0 };

const renderHero = () => {
  const period = periods[state.period];
  $('#hero-total').textContent = money(period.total + state.extra.revenue);
  $('#hero-label').textContent = `Faturamento, ${period.label}`;
  $('#hero-delta').textContent = `+${period.delta.toLocaleString('pt-BR')}% sobre o período anterior`;
  $('#hero-orders').textContent = integer(period.orders + state.extra.orders);
  $('#hero-ticket').textContent = money(period.ticket);
  $('#hero-customers').textContent = integer(period.customers);
  drawChart();
};

const drawChart = () => {
  const period = periods[state.period];
  const root = $('#chart');
  const width = Math.max(300, Math.round(root.clientWidth));
  const height = 250;
  const pad = { top: 24, right: 14, bottom: 26, left: 14 };
  const values = period.values;
  const points = chartPoints(values, width, height, pad);
  const line = smoothPath(points);
  const last = points[points.length - 1][0];
  const area = `${line}L${last},${height - pad.bottom}L${points[0][0]},${height - pad.bottom}Z`;
  const tickIndexes = [0, Math.floor((values.length - 1) / 2), values.length - 1];
  const anchor = (index) => (index === 0 ? 'start' : index === values.length - 1 ? 'end' : 'middle');
  root.innerHTML = html`<svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
      <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5c7a" stop-opacity=".55"/><stop offset="1" stop-color="#ff5c7a" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#fill)"/><path d="${line}" fill="none" stroke="#ff8aa0" stroke-width="3" stroke-linecap="round"/>
      <line id="guide" y1="${pad.top}" y2="${height - pad.bottom}" stroke="#fff" stroke-opacity=".5" stroke-dasharray="3 4" opacity="0"/>
      <circle id="dot" r="6" fill="#fff" stroke="#ff5c7a" stroke-width="3" opacity="0"/>
      ${tickIndexes.map((index) => html`<text x="${points[index][0]}" y="${height - 6}" text-anchor="${anchor(index)}" class="axis">${period.labels[index]}</text>`)}</svg>
    <div class="tip" id="tip" hidden></div>
    <table class="sr-only"><caption>Faturamento, ${period.label}</caption><thead><tr><th scope="col">Intervalo</th><th scope="col">Faturamento</th></tr></thead>
      <tbody>${values.map((value, index) => html`<tr><th scope="row">${period.labels[index]}</th><td>${money(value)}</td></tr>`)}</tbody></table>`;
  const svg = root.querySelector('svg');
  const tip = root.querySelector('#tip');
  const guide = root.querySelector('#guide');
  const dot = root.querySelector('#dot');
  svg.addEventListener('pointermove', (event) => {
    const box = svg.getBoundingClientRect();
    const index = nearestIndex((event.clientX - box.left) / box.width, values.length);
    const [px, py] = points[index];
    guide.setAttribute('x1', px);
    guide.setAttribute('x2', px);
    guide.setAttribute('opacity', '1');
    dot.setAttribute('cx', px);
    dot.setAttribute('cy', py);
    dot.setAttribute('opacity', '1');
    tip.hidden = false;
    tip.innerHTML = html`<span>${period.labels[index]}</span><strong>${money(values[index])}</strong>`;
    tip.style.left = `${Math.min(Math.max(px, 60), width - 60)}px`;
    tip.style.top = `${py - 12}px`;
  });
  svg.addEventListener('pointerleave', () => {
    guide.setAttribute('opacity', '0');
    dot.setAttribute('opacity', '0');
    tip.hidden = true;
  });
};

const renderChannels = () => {
  const period = periods[state.period];
  const segments = donutSegments(period.channels, 62);
  $('#donut').innerHTML = html`<svg viewBox="0 0 180 180" role="img" aria-label="Pedidos por canal de venda">${segments.map(
    (segment, index) =>
      html`<circle class="arc" data-arc="${index}" cx="90" cy="90" r="62" fill="none" stroke="${channels[index].color}" stroke-width="26" stroke-dasharray="${segment.dash} ${segment.rest}" stroke-dashoffset="${segment.offset}" transform="rotate(-90 90 90)"/>`,
  )}<text x="90" y="88" text-anchor="middle" class="donut-num">${integer(period.orders + state.extra.orders)}</text><text x="90" y="108" text-anchor="middle" class="axis">pedidos</text></svg>
    <ul class="legend">${period.channels.map(
      (share, index) => html`<li><button type="button" data-legend="${index}"><i style="background:${channels[index].color}" aria-hidden="true"></i>${channels[index].name}<b>${share}%</b></button></li>`,
    )}</ul>`;
};

const renderHeat = () => {
  const peak = Math.max(...heat.flat().map((cell) => cell.value));
  $('#heat').innerHTML = html`<div class="heat-grid" role="group" aria-label="Faturamento por dia da semana e horário">
    <span></span>${bands.map((band) => html`<span class="heat-head" aria-hidden="true">${band}</span>`)}
    ${heat.map(
      (row) =>
        html`<span class="heat-day" aria-hidden="true">${row[0].day}</span>${row.map(
          (cell) =>
            html`<button type="button" class="cell" style="--v:${(cell.value / peak).toFixed(2)}" data-day="${cell.day}" data-band="${cell.band}" data-value="${cell.value}" data-orders="${cell.orders}" aria-label="${cell.day}, ${cell.band}: ${money(cell.value)}, ${cell.orders} pedidos"></button>`,
        )}`,
    )}</div>`;
};

const renderTop = () => {
  const period = periods[state.period];
  const max = period.top[0];
  $('#top').innerHTML = html`${period.top.map(
    (qty, index) => html`<li><div class="top-line"><span>${products[index]}</span><strong>${integer(qty)}</strong></div><div class="top-bar" aria-hidden="true"><i style="width:${(qty / max) * 100}%"></i></div></li>`,
  )}`;
};

const ring = (percent) => {
  const length = 2 * Math.PI * 26;
  return html`<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" fill="none" stroke="#e9def5" stroke-width="8"/><circle cx="32" cy="32" r="26" fill="none" stroke="#ff5c7a" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(Math.min(percent, 100) / 100) * length} ${length}" transform="rotate(-90 32 32)"/></svg>`;
};

const renderGoals = () => {
  $('#goals').innerHTML = html`${goals.map((goal) => {
    const progress = goalProgress(goal, state.extra);
    const format = goal.money ? money : integer;
    return html`<li class="goal">${ring(progress.percent)}<div><span>${goal.label}</span><strong>${progress.percent}%</strong><small>${format(progress.current)} de ${format(goal.target)}</small></div></li>`;
  })}`;
};

const renderFeed = () => {
  $('#feed').innerHTML = html`${state.feed.map(
    (item, index) => html`<li class="${index === 0 && state.extra.orders ? 'is-new' : ''}"><span class="dot" aria-hidden="true"></span><div><strong>${item.who}</strong><span>${item.what}</span></div><div class="feed-right"><b>${moneyCents(item.value)}</b><small>${item.when}</small></div></li>`,
  )}`;
};

const renderAll = () => {
  renderHero();
  renderChannels();
  renderTop();
  renderGoals();
  renderFeed();
};

const dimArcs = (legend) => {
  document.querySelectorAll('.arc').forEach((arc) => arc.classList.toggle('is-dim', Boolean(legend) && arc.dataset.arc !== legend.dataset.legend));
};

const showCell = (cell) => {
  $('#heat-note').innerHTML = html`<strong>${cell.dataset.day}, ${cell.dataset.band}</strong>: ${money(Number(cell.dataset.value))} em ${cell.dataset.orders} pedidos`;
};

periodButtons.forEach((button) =>
  button.addEventListener('click', () => {
    state = { ...state, period: button.dataset.period };
    periodButtons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    renderAll();
  }),
);

$('#simulate').addEventListener('click', () => {
  const { order, next } = addIncoming(state, incoming);
  state = next;
  renderAll();
  showToast(`Pedido simulado de ${order.who}: ${moneyCents(order.value)}.`);
});

document.addEventListener('pointerover', (event) => {
  dimArcs(event.target.closest('[data-legend]'));
  const cell = event.target.closest('.cell');
  if (cell) showCell(cell);
});

document.addEventListener('focusin', (event) => {
  dimArcs(event.target.closest('[data-legend]'));
  const cell = event.target.closest('.cell');
  if (cell) showCell(cell);
});

new ResizeObserver(() => drawChart()).observe($('#chart'));
renderHeat();
renderAll();
