import { docs, reviewBelow } from '../../data/demos/erp.js';

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
const chips = document.querySelectorAll('[data-filter]');
const rows = document.querySelectorAll('[data-status]');
const button = document.querySelector('#classify');
const summary = document.querySelector('#classify-summary');
const kpi = document.querySelector('#kpi-docs .app-kpi-value');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const activate = (tab, focus = false) => {
  tabs.forEach((item, index) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    panels[index].hidden = !active;
  });
  if (focus) tab.focus();
};

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    activate(tabs[(index + step + tabs.length) % tabs.length], true);
  });
});

chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach((item) => item.setAttribute('aria-pressed', String(item === chip)));
    rows.forEach((row) => {
      row.hidden = filter !== 'todas' && row.dataset.status !== filter;
    });
  }),
);

const fill = (doc) => {
  const row = document.querySelector(`[data-doc="${doc.id}"]`);
  const needsReview = doc.confidence < reviewBelow;
  row.querySelector('.erp-doc-result').innerHTML = `<strong>${doc.kind}</strong>
    <span>${doc.account}</span>
    <span class="app-badge ${needsReview ? 'is-warn' : 'is-ok'}">${needsReview ? `Revisar · ${doc.confidence}%` : `${doc.confidence}%`}</span>`;
  row.classList.add('is-done');
};

const finish = () => {
  const reviews = docs.filter((doc) => doc.confidence < reviewBelow).length;
  summary.textContent = `${docs.length} documentos classificados${reviews ? `, ${reviews} para revisão humana` : ''}. Exemplo ilustrativo.`;
  summary.hidden = false;
  kpi.textContent = String(Number(kpi.textContent) - docs.length);
  button.textContent = 'Classificados';
};

button.addEventListener('click', () => {
  button.disabled = true;
  if (reduceMotion) {
    docs.forEach(fill);
    finish();
    return;
  }
  button.textContent = 'Classificando...';
  docs.forEach((doc, index) => setTimeout(() => fill(doc), 350 * (index + 1)));
  setTimeout(finish, 350 * (docs.length + 1));
});
