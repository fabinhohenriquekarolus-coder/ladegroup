import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { money, addToBag, changeQty, bagSummary, piecesLabel } from './rules.js';

const root = document.querySelector('#ml');
const freeShipping = Number(root.dataset.free);
const items = [...document.querySelectorAll('.item')];
const filters = [...document.querySelectorAll('.ml-filters [data-cat]')];
const count = document.querySelector('#count');
const bag = document.querySelector('#bag');
const scrim = document.querySelector('#scrim');
const openButton = document.querySelector('#open-bag');
const lines = document.querySelector('#bag-lines');
const checkout = document.querySelector('#bag-checkout');

const state = { cat: 'todos', lines: [] };

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

const renderBag = () => {
  const summary = bagSummary(state.lines, freeShipping);
  lines.innerHTML = html`${state.lines.map(
    (line) => html`<li data-key="${line.key}"><i style="background:${line.hex}" aria-hidden="true"></i>
      <div><strong>${line.name}</strong><span>${line.colorName}, tamanho ${line.size}</span>
      <div class="qty"><button type="button" data-dec aria-label="Diminuir ${line.name}">−</button><b>${line.qty}<span class="sr-only"> unidades</span></b><button type="button" data-inc aria-label="Aumentar ${line.name}">+</button></div></div>
      <em>${money(line.price * line.qty)}</em></li>`,
  )}`;
  document.querySelector('#bag-empty').hidden = state.lines.length > 0;
  document.querySelector('#bag-count').textContent = summary.qty;
  document.querySelector('#bag-total').textContent = money(summary.total);
  document.querySelector('#meter').style.width = `${summary.progress}%`;
  document.querySelector('#ship').textContent = summary.free ? 'Você ganhou frete grátis.' : `Faltam ${money(summary.remaining)} para o frete grátis.`;
  checkout.disabled = summary.qty === 0;
};

const openBag = () => {
  bag.hidden = false;
  scrim.hidden = false;
  root.inert = true;
  document.querySelector('#close-bag').focus();
};

const closeBag = () => {
  bag.hidden = true;
  scrim.hidden = true;
  root.inert = false;
  openButton.focus();
};

filters.forEach((button) =>
  button.addEventListener('click', () => {
    state.cat = button.dataset.cat;
    press(filters, button);
    renderGrid();
  }),
);

document.querySelector('#grid').addEventListener('click', (event) => {
  const item = event.target.closest('.item');
  if (!item) return;
  const swatch = event.target.closest('.swatch');
  const size = event.target.closest('[data-size]');
  const favorite = event.target.closest('.item-fav');
  if (swatch) {
    item.style.setProperty('--g', swatch.dataset.hex);
    press([...item.querySelectorAll('.swatch')], swatch);
    return;
  }
  if (size) {
    press([...item.querySelectorAll('[data-size]')], size);
    return;
  }
  if (favorite) {
    const active = favorite.getAttribute('aria-pressed') !== 'true';
    favorite.setAttribute('aria-pressed', String(active));
    showToast(active ? `${item.dataset.name} foi para os favoritos.` : `${item.dataset.name} saiu dos favoritos.`);
    return;
  }
  if (event.target.closest('[data-add]')) {
    const color = item.querySelector('.swatch[aria-pressed="true"]');
    state.lines = addToBag(state.lines, {
      id: item.dataset.id,
      name: item.dataset.name,
      price: Number(item.dataset.price),
      color: color.dataset.color,
      colorName: color.getAttribute('aria-label'),
      hex: color.dataset.hex,
      size: item.querySelector('[data-size][aria-pressed="true"]').dataset.size,
    });
    renderBag();
    openBag();
  }
});

lines.addEventListener('click', (event) => {
  const row = event.target.closest('li');
  if (!row) return;
  const delta = event.target.closest('[data-inc]') ? 1 : event.target.closest('[data-dec]') ? -1 : 0;
  if (!delta) return;
  state.lines = changeQty(state.lines, row.dataset.key, delta);
  renderBag();
  const same = lines.querySelector(`[data-key="${row.dataset.key}"] ${delta > 0 ? '[data-inc]' : '[data-dec]'}`);
  (same ?? document.querySelector('#close-bag')).focus();
});

openButton.addEventListener('click', openBag);
document.querySelector('#close-bag').addEventListener('click', closeBag);
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
