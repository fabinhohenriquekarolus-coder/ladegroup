import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { closeMenu } from './site.js';
import {
  money,
  addToBag,
  changeQty,
  removeLine,
  bagSummary,
  shippingMessage,
  piecesLabel,
  unitsLabel,
  sizeLabel,
  sortPieces,
} from './rules.js';

const root = document.querySelector('#ml');
const background = [document.querySelector('.demo-skip'), document.querySelector('.demo-bar'), root].filter(Boolean);
const freeShipping = Number(root.dataset.free);
const grid = document.querySelector('#grid');
const items = [...grid.querySelectorAll('.item')];
const byId = new Map(items.map((item) => [item.dataset.id, item]));
const pieces = items.map((item, order) => ({ id: item.dataset.id, price: Number(item.dataset.price), order }));
const filters = [...document.querySelectorAll('.ml-filters [data-cat]')];
const sort = document.querySelector('#sort');
const count = document.querySelector('#count');
const bag = document.querySelector('#bag');
const scrim = document.querySelector('#scrim');
const openButton = document.querySelector('#open-bag');
const closeButton = document.querySelector('#close-bag');
const lines = document.querySelector('#bag-lines');
const status = document.querySelector('#bag-status');
const checkout = document.querySelector('#bag-checkout');

const state = { cat: 'todos', lines: [] };
let opener = openButton;

const press = (buttons, active) => buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));

const renderGrid = () => {
  let visible = 0;
  items.forEach((item) => {
    const show = state.cat === 'todos' || item.dataset.cat === state.cat;
    item.hidden = !show;
    if (show) visible += 1;
  });
  count.textContent = piecesLabel(visible);
};

const sortGrid = () => {
  grid.append(...sortPieces(pieces, sort.value).map((piece) => byId.get(piece.id)));
};

const renderBag = () => {
  const summary = bagSummary(state.lines, freeShipping);
  lines.innerHTML = html`${state.lines.map(
    (line) => html`<li data-key="${line.key}">
      <i class="ml-line-swatch" style="background:${line.hex}" aria-hidden="true"></i>
      <div class="ml-line-body">
        <strong>${line.name}</strong>
        <span>${line.colorName}, ${sizeLabel(line.size)}</span>
        <div class="qty" role="group" aria-label="Quantidade de ${line.name}">
          <button type="button" data-dec aria-label="Diminuir quantidade de ${line.name}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"></path></svg></button>
          <b>${line.qty}<span class="sr-only"> ${line.qty === 1 ? 'unidade' : 'unidades'}</span></b>
          <button type="button" data-inc aria-label="Aumentar quantidade de ${line.name}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M12 6v12"></path></svg></button>
        </div>
      </div>
      <div class="ml-line-side">
        <em>${money(line.price * line.qty)}</em>
        <button type="button" class="ml-line-remove" data-remove>Remover<span class="sr-only"> ${line.name}</span></button>
      </div>
    </li>`,
  )}`;
  document.querySelector('#bag-empty').hidden = state.lines.length > 0;
  document.querySelector('#bag-count').textContent = summary.qty;
  document.querySelector('#bag-qty').textContent = piecesLabel(summary.qty);
  document.querySelector('#bag-total').textContent = money(summary.total);
  document.querySelector('#meter').style.width = `${summary.progress}%`;
  document.querySelector('#ship').textContent = shippingMessage(summary);
  checkout.disabled = summary.qty === 0;
};

const setBackground = (value) =>
  background.forEach((element) => {
    element.inert = value;
  });

const openBag = (from) => {
  opener = from ?? openButton;
  closeMenu();
  bag.hidden = false;
  scrim.hidden = false;
  setBackground(true);
  closeButton.focus();
};

const closeBag = () => {
  bag.hidden = true;
  scrim.hidden = true;
  setBackground(false);
  (opener?.isConnected ? opener : openButton).focus();
};

filters.forEach((button) =>
  button.addEventListener('click', () => {
    state.cat = button.dataset.cat;
    press(filters, button);
    renderGrid();
  }),
);

sort.addEventListener('change', sortGrid);

grid.addEventListener('click', (event) => {
  const item = event.target.closest('.item');
  if (!item) return;
  const swatch = event.target.closest('.swatch');
  const size = event.target.closest('button[data-size]');
  const favorite = event.target.closest('.item-fav');
  const add = event.target.closest('[data-add]');
  if (swatch) {
    item.style.setProperty('--g', swatch.dataset.hex);
    press([...item.querySelectorAll('.swatch')], swatch);
    item.querySelector('.swatch-name').textContent = swatch.getAttribute('aria-label');
    return;
  }
  if (size) {
    press([...item.querySelectorAll('button[data-size]')], size);
    return;
  }
  if (favorite) {
    const active = favorite.getAttribute('aria-pressed') !== 'true';
    favorite.setAttribute('aria-pressed', String(active));
    showToast(active ? `${item.dataset.name} foi para os favoritos.` : `${item.dataset.name} saiu dos favoritos.`);
    return;
  }
  if (add) {
    const color = item.querySelector('.swatch[aria-pressed="true"]');
    const chosen = item.querySelector('button[data-size][aria-pressed="true"]') ?? item.querySelector('[data-size]');
    state.lines = addToBag(state.lines, {
      id: item.dataset.id,
      name: item.dataset.name,
      price: Number(item.dataset.price),
      color: color.dataset.color,
      colorName: color.getAttribute('aria-label'),
      hex: color.dataset.hex,
      size: chosen.dataset.size,
    });
    renderBag();
    openBag(add);
  }
});

lines.addEventListener('click', (event) => {
  const row = event.target.closest('li');
  if (!row) return;
  const key = row.dataset.key;
  const line = state.lines.find((entry) => entry.key === key);
  if (!line) return;
  const control = event.target.closest('[data-inc], [data-dec], [data-remove]');
  if (!control) return;
  if (control.matches('[data-remove]')) state.lines = removeLine(state.lines, key);
  else state.lines = changeQty(state.lines, key, control.matches('[data-inc]') ? 1 : -1);
  renderBag();
  const next = state.lines.find((entry) => entry.key === key);
  status.textContent = next ? `${line.name}: ${unitsLabel(next.qty)}.` : `${line.name} saiu da sacola.`;
  const selector = control.matches('[data-inc]') ? '[data-inc]' : '[data-dec]';
  const same = next ? lines.querySelector(`[data-key="${CSS.escape(key)}"] ${selector}`) : null;
  (same ?? lines.querySelector('[data-dec]') ?? closeButton).focus();
});

openButton.addEventListener('click', () => openBag(openButton));
closeButton.addEventListener('click', closeBag);
scrim.addEventListener('click', closeBag);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !bag.hidden) closeBag();
});

checkout.addEventListener('click', () => {
  closeBag();
  showToast('Compra de demonstração: nada foi enviado nem cobrado.');
});

renderGrid();
renderBag();
