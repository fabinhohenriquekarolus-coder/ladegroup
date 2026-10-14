import { periods, channels, products, bands, heat, goals, feed, incoming } from '../../data/demos/painel.js';

const el = (id) => document.querySelector(id);
const periodButtons = document.querySelectorAll('[data-period]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const state = { period: '7', extra: 0, extraOrders: 0, feed: [...feed], incomingIndex: 0 };

const money = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const money2 = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const int = (v) => v.toLocaleString('pt-BR');
const toast = (message) => document.dispatchEvent(new CustomEvent('demo:toast', { detail: message }));

const smooth = (points) => {
  if (points.length < 3) return `M${points.map((p) => p.join(',')).join('L')}`;
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
};

const renderHero = () => {
  const period = periods[state.period];
  const total = period.total + state.extra;
  el('#hero-total').textContent = money(total);
  el('#hero-label').textContent = `Faturamento · ${period.label}`;
  el('#hero-delta').textContent = `+${period.delta.toLocaleString('pt-BR')}% vs. período anterior`;
  el('#hero-orders').textContent = int(period.orders + state.extraOrders);
  el('#hero-ticket').textContent = money(period.ticket);
  el('#hero-customers').textContent = int(period.customers);
  drawChart();
};

const drawChart = () => {
  const period = periods[state.period];
  const root = el('#chart');
  const width = Math.max(300, Math.round(root.clientWidth));
  const height = 250;
  const pad = { top: 24, right: 14, bottom: 26, left: 14 };
  const values = period.values;
  const max = Math.max(...values) * 1.12;
  const min = Math.min(...values) * 0.7;
  const x = (i) => pad.left + (i / (values.length - 1)) * (width - pad.left - pad.right);
  const y = (v) => pad.top + (1 - (v - min) / (max - min)) * (height - pad.top - pad.bottom);
  const points = values.map((v, i) => [x(i), y(v)]);
  const line = smooth(points);
  const area = `${line}L${x(values.length - 1)},${height - pad.bottom}L${x(0)},${height - pad.bottom}Z`;
  const ticks = [0, Math.floor((values.length - 1) / 2), values.length - 1]
    .map((i) => `<text x="${x(i)}" y="${height - 6}" text-anchor="${i === 0 ? 'start' : i === values.length - 1 ? 'end' : 'middle'}" class="axis">${period.labels[i]}</text>`)
    .join('');
  root.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Faturamento por intervalo, ${period.label}" id="chart-svg">
      <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5c7a" stop-opacity=".55"/><stop offset="1" stop-color="#ff5c7a" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#fill)"/><path d="${line}" fill="none" stroke="#ff8aa0" stroke-width="3" stroke-linecap="round"/>
      <line id="guide" y1="${pad.top}" y2="${height - pad.bottom}" stroke="#fff" stroke-opacity=".5" stroke-dasharray="3 4" opacity="0"/>
      <circle id="dot" r="6" fill="#fff" stroke="#ff5c7a" stroke-width="3" opacity="0"/>${ticks}</svg>
    <div class="tip" id="tip" hidden></div>`;
  const svg = root.querySelector('svg');
  const tip = root.querySelector('#tip');
  const guide = root.querySelector('#guide');
  const dot = root.querySelector('#dot');
  const show = (index) => {
    const [px, py] = points[index];
    guide.setAttribute('x1', px);
    guide.setAttribute('x2', px);
    guide.setAttribute('opacity', '1');
    dot.setAttribute('cx', px);
    dot.setAttribute('cy', py);
    dot.setAttribute('opacity', '1');
    tip.hidden = false;
    tip.innerHTML = `<span>${period.labels[index]}</span><strong>${money(values[index])}</strong>`;
    tip.style.left = `${Math.min(Math.max(px, 60), width - 60)}px`;
    tip.style.top = `${py - 12}px`;
  };
  const hide = () => {
    guide.setAttribute('opacity', '0');
    dot.setAttribute('opacity', '0');
    tip.hidden = true;
  };
  svg.addEventListener('pointermove', (event) => {
    const box = svg.getBoundingClientRect();
    const ratio = (event.clientX - box.left) / box.width;
    show(Math.min(values.length - 1, Math.max(0, Math.round(ratio * (values.length - 1)))));
  });
  svg.addEventListener('pointerleave', hide);
};

const renderChannels = () => {
  const shares = periods[state.period].channels;
  const orders = periods[state.period].orders + state.extraOrders;
  const radius = 62;
  const length = 2 * Math.PI * radius;
  let offset = 0;
  const arcs = shares
    .map((share, i) => {
      const dash = (share / 100) * length;
      const arc = `<circle class="arc" data-arc="${i}" cx="90" cy="90" r="${radius}" fill="none" stroke="${channels[i].color}" stroke-width="26" stroke-dasharray="${dash - 2} ${length - dash + 2}" stroke-dashoffset="${-offset}" transform="rotate(-90 90 90)"/>`;
      offset += dash;
      return arc;
    })
    .join('');
  el('#donut').innerHTML = `<svg viewBox="0 0 180 180" role="img" aria-label="Pedidos por canal de venda">${arcs}<text x="90" y="88" text-anchor="middle" class="donut-num">${int(orders)}</text><text x="90" y="108" text-anchor="middle" class="axis">pedidos</text></svg>
    <ul class="legend">${shares.map((share, i) => `<li><button type="button" data-legend="${i}"><i style="background:${channels[i].color}"></i>${channels[i].name}<b>${share}%</b></button></li>`).join('')}</ul>`;
};

const renderHeat = () => {
  const peak = Math.max(...heat.flat().map((c) => c.value));
  el('#heat').innerHTML = `<div class="heat-grid" role="group" aria-label="Faturamento por dia da semana e horário">
    <span></span>${bands.map((b) => `<span class="heat-head">${b}</span>`).join('')}
    ${heat.map((row) => `<span class="heat-day">${row[0].day}</span>${row.map((c) => `<button type="button" class="cell" style="--v:${(c.value / peak).toFixed(2)}" data-day="${c.day}" data-band="${c.band}" data-value="${c.value}" data-orders="${c.orders}" aria-label="${c.day}, ${c.band}: ${money(c.value)}, ${c.orders} pedidos"></button>`).join('')}`).join('')}</div>`;
};

const renderTop = () => {
  const period = periods[state.period];
  const max = period.top[0];
  el('#top').innerHTML = period.top
    .map((qty, i) => `<li><div class="top-line"><span>${products[i]}</span><strong>${int(qty)}</strong></div><div class="top-bar"><i style="width:${(qty / max) * 100}%"></i></div></li>`)
    .join('');
};

const ringSvg = (pct) => {
  const length = 2 * Math.PI * 26;
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" fill="none" stroke="#e9def5" stroke-width="8"/><circle cx="32" cy="32" r="26" fill="none" stroke="#ff5c7a" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(Math.min(pct, 100) / 100) * length} ${length}" transform="rotate(-90 32 32)"/></svg>`;
};

const renderGoals = () => {
  el('#goals').innerHTML = goals
    .map((goal) => {
      const current = goal.current + (goal.id === 'receita' ? state.extra : goal.id === 'pedidos' ? state.extraOrders : 0);
      const pct = Math.round((current / goal.target) * 100);
      const fmt = goal.money ? money : int;
      return `<li class="goal">${ringSvg(pct)}<div><span>${goal.label}</span><strong>${pct}%</strong><small>${fmt(current)} de ${fmt(goal.target)}</small></div></li>`;
    })
    .join('');
};

const renderFeed = () => {
  el('#feed').innerHTML = state.feed
    .map((item, i) => `<li class="${i === 0 && state.extraOrders ? 'is-new' : ''}"><span class="dot"></span><div><strong>${item.who}</strong><span>${item.what}</span></div><div class="feed-right"><b>${money2(item.value)}</b><small>${item.when}</small></div></li>`)
    .join('');
};

const renderAll = () => {
  renderHero();
  renderChannels();
  renderTop();
  renderGoals();
  renderFeed();
};

periodButtons.forEach((button) =>
  button.addEventListener('click', () => {
    state.period = button.dataset.period;
    periodButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    renderAll();
  }),
);

el('#simulate').addEventListener('click', () => {
  const order = incoming[state.incomingIndex % incoming.length];
  state.incomingIndex += 1;
  state.extra += Math.round(order.value);
  state.extraOrders += 1;
  state.feed = [{ ...order, when: 'agora' }, ...state.feed].slice(0, 6);
  renderAll();
  toast(`Pedido simulado de ${order.who}: ${money2(order.value)}.`);
});

document.addEventListener('pointerover', (event) => {
  const legend = event.target.closest('[data-legend]');
  document.querySelectorAll('.arc').forEach((arc) => arc.classList.toggle('is-dim', legend && arc.dataset.arc !== legend.dataset.legend));
  const cell = event.target.closest('.cell');
  if (cell) showCell(cell);
});

document.addEventListener('focusin', (event) => {
  const cell = event.target.closest('.cell');
  if (cell) showCell(cell);
  const legend = event.target.closest('[data-legend]');
  document.querySelectorAll('.arc').forEach((arc) => arc.classList.toggle('is-dim', legend && arc.dataset.arc !== legend.dataset.legend));
});

const showCell = (cell) => {
  el('#heat-note').innerHTML = `<strong>${cell.dataset.day}, ${cell.dataset.band}</strong> · ${money(Number(cell.dataset.value))} · ${cell.dataset.orders} pedidos`;
};

new ResizeObserver(() => drawChart()).observe(el('#chart'));
renderHeat();
renderAll();
