import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { tiers } from './data.js';
import {
  money,
  matchesFilters,
  discountRate,
  lineTotal,
  addToQuote,
  changeQty,
  quoteSummary,
  formatCnpj,
  isValidCnpj,
  itemsLabel,
  filtersFromQuery,
} from './rules.js';

const rows = [...document.querySelectorAll('.part')];
const chips = [...document.querySelectorAll('.en-chips [data-cat]')];
const search = document.querySelector('#q');
const headerSearch = document.querySelector('#busca');
const lineSelect = document.querySelector('#line');
const onlyStock = document.querySelector('#only-stock');
const lines = document.querySelector('#quote-lines');
const error = document.querySelector('#quote-error');
const form = document.querySelector('#quote-form');
const cnpj = document.querySelector('#cnpj');

const partOf = (row) => ({
  code: row.dataset.code,
  name: row.dataset.name,
  app: row.dataset.app,
  cat: row.dataset.cat,
  line: row.dataset.line,
  stock: Number(row.dataset.stock),
  price: Number(row.dataset.price),
});

const state = { category: 'todas', entries: [] };

const renderTable = () => {
  const filters = { term: search.value, category: state.category, line: lineSelect.value, onlyStock: onlyStock.checked };
  let visible = 0;
  rows.forEach((row) => {
    const show = matchesFilters(partOf(row), filters);
    row.hidden = !show;
    if (show) visible += 1;
  });
  document.querySelector('#count').textContent = itemsLabel(visible);
  document.querySelector('#empty').hidden = visible > 0;
};

const renderQuote = () => {
  lines.innerHTML = html`${state.entries.map((entry) => {
    const rate = discountRate(entry.qty, tiers);
    return html`<li data-code="${entry.code}"><div><b>${entry.code}</b><span>${entry.name}</span>${entry.stock === 0 ? html`<em>Sob encomenda, até 5 dias úteis</em>` : ''}${rate ? html`<em class="off">Desconto de ${rate * 100}% aplicado</em>` : ''}</div>
      <div class="step"><button type="button" data-dec aria-label="Diminuir ${entry.code}">−</button><b>${entry.qty}<span class="sr-only"> unidades</span></b><button type="button" data-inc aria-label="Aumentar ${entry.code}">+</button></div>
      <strong>${money(lineTotal(entry, tiers))}</strong></li>`;
  })}`;
  const summary = quoteSummary(state.entries, tiers);
  document.querySelector('#quote-empty').hidden = summary.items > 0;
  document.querySelector('#sum-sub').textContent = money(summary.subtotal);
  document.querySelector('#sum-disc').textContent = summary.discount ? `menos ${money(summary.discount)}` : money(0);
  document.querySelector('#sum-total').textContent = money(summary.total);
  document.querySelector('#quote-count').textContent = summary.items;
};

const showError = (message, field) => {
  error.textContent = message;
  error.hidden = false;
  field?.setAttribute('aria-invalid', 'true');
  field?.focus();
};

const selectCategory = (category) => {
  state.category = category;
  chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.cat === category)));
};

chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    selectCategory(chip.dataset.cat);
    renderTable();
  }),
);

search.addEventListener('input', renderTable);
lineSelect.addEventListener('change', renderTable);
onlyStock.addEventListener('change', renderTable);

document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  search.value = headerSearch.value.trim();
  renderTable();
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelector('#catalogo').scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
  document.querySelector('#titulo-catalogo').focus({ preventScroll: true });
});

document.querySelector('#parts').addEventListener('click', (event) => {
  if (!event.target.closest('[data-add]')) return;
  const row = event.target.closest('.part');
  const input = row.querySelector('.qty');
  const part = partOf(row);
  state.entries = addToQuote(state.entries, part, input.value);
  input.value = 1;
  renderQuote();
  showToast(`${part.code} entrou na cotação.`);
});

lines.addEventListener('click', (event) => {
  const row = event.target.closest('li');
  if (!row) return;
  const delta = event.target.closest('[data-inc]') ? 1 : event.target.closest('[data-dec]') ? -1 : 0;
  if (!delta) return;
  state.entries = changeQty(state.entries, row.dataset.code, delta);
  renderQuote();
  const same = lines.querySelector(`[data-code="${row.dataset.code}"] ${delta > 0 ? '[data-inc]' : '[data-dec]'}`);
  (same ?? cnpj).focus();
});

cnpj.addEventListener('input', () => {
  cnpj.value = formatCnpj(cnpj.value);
  cnpj.removeAttribute('aria-invalid');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!state.entries.length) {
    showError('Adicione ao menos uma peça à cotação.');
    return;
  }
  if (!isValidCnpj(cnpj.value)) {
    showError('Confira o CNPJ: ele precisa ter 14 números e dígitos verificadores válidos.', cnpj);
    return;
  }
  error.hidden = true;
  const summary = quoteSummary(state.entries, tiers);
  showToast(`Cotação de demonstração com ${itemsLabel(summary.items)}, total ${money(summary.total)}. Nada foi enviado.`);
});

const initial = filtersFromQuery(window.location.search, chips.map((chip) => chip.dataset.cat));
search.value = initial.term;
headerSearch.value = initial.term;
selectCategory(initial.category);

renderTable();
renderQuote();
