import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { money, priceFor, addDish, changeQty, cartSummary, sizeLabel, itemsLabel, unitsLabel, categoryTitle } from './rules.js';

const dishes = [...document.querySelectorAll('.dish')];
const tabs = [...document.querySelectorAll('.fv-tabs [data-cat]')];
const sizeGroup = document.querySelector('#sizes-group');
const sizeButtons = [...document.querySelectorAll('#sizes [data-size]')];
const categoryHeading = document.querySelector('#titulo-categoria');
const lines = document.querySelector('#cart-lines');
const empty = document.querySelector('#cart-empty');
const neighborhood = document.querySelector('#bairro');
const checkout = document.querySelector('#checkout');
const status = document.querySelector('#cart-status');
const output = (selector, text) => {
  document.querySelector(selector).textContent = text;
};

const dishOf = (element) => ({
  id: element.dataset.id,
  name: element.dataset.name,
  media: Number(element.dataset.media),
  grande: element.dataset.grande ? Number(element.dataset.grande) : null,
});

const state = { cat: 'salgadas', size: 'media', lines: [] };

const press = (buttons, active) => buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));

const lineTitle = (line) => (line.size ? `${line.name}, ${sizeLabel(line.size)}` : line.name);

const currentFee = () => {
  const option = neighborhood.selectedOptions[0];
  return option && option.value ? Number(option.dataset.fee) : null;
};

const renderMenu = () => {
  sizeGroup.hidden = state.cat === 'bebidas';
  categoryHeading.textContent = categoryTitle(state.cat);
  dishes.forEach((element) => {
    element.hidden = element.dataset.cat !== state.cat;
    element.querySelector('.dish-price').textContent = money(priceFor(dishOf(element), state.size));
  });
};

const renderCart = () => {
  const option = neighborhood.selectedOptions[0];
  const fee = currentFee();
  const summary = cartSummary(state.lines, fee);
  lines.innerHTML = html`${state.lines.map(
    (line) => html`<li data-key="${line.key}"><span class="line-name">${line.name}${line.size ? html`<em>${sizeLabel(line.size)}</em>` : ''}</span>
      <span class="line-qty"><button type="button" data-dec aria-label="Diminuir ${lineTitle(line)}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button><b aria-hidden="true">${line.qty}</b><span class="sr-only">${unitsLabel(line.qty)}</span><button type="button" data-inc aria-label="Aumentar ${lineTitle(line)}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M8 3v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></span>
      <span class="line-price">${money(line.price * line.qty)}</span></li>`,
  )}`;
  empty.hidden = state.lines.length > 0;
  output('#subtotal', money(summary.subtotal));
  output('#fee', fee === null ? 'a calcular' : money(fee));
  output('#total', money(summary.total));
  output('#cart-count', summary.count);
  output('#cart-items', `, ${itemsLabel(summary.count)}, total`);
  output('#cart-top', money(summary.total));
  output('#eta', fee === null ? 'Escolha o bairro para ver o prazo.' : `Prazo estimado: ${option.dataset.time}.`);
  checkout.disabled = !summary.ready;
  return summary;
};

document.querySelector('#dishes').addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const dish = dishOf(button.closest('.dish'));
  state.lines = addDish(state.lines, dish, state.size);
  renderCart();
  showToast(`${dish.name} foi para o pedido.`);
});

lines.addEventListener('click', (event) => {
  const row = event.target.closest('li');
  if (!row) return;
  const delta = event.target.closest('[data-inc]') ? 1 : event.target.closest('[data-dec]') ? -1 : 0;
  if (!delta) return;
  const key = row.dataset.key;
  const before = state.lines.find((line) => line.key === key);
  state.lines = changeQty(state.lines, key, delta);
  const summary = renderCart();
  const after = state.lines.find((line) => line.key === key);
  status.textContent = after
    ? `${lineTitle(after)}: ${unitsLabel(after.qty)}. Total ${money(summary.total)}.`
    : `${lineTitle(before)} saiu do pedido. Total ${money(summary.total)}.`;
  const same = lines.querySelector(`[data-key="${key}"] ${delta > 0 ? '[data-inc]' : '[data-dec]'}`);
  (same ?? neighborhood).focus();
});

tabs.forEach((tab) =>
  tab.addEventListener('click', () => {
    state.cat = tab.dataset.cat;
    press(tabs, tab);
    renderMenu();
  }),
);

sizeButtons.forEach((button) =>
  button.addEventListener('click', () => {
    state.size = button.dataset.size;
    press(sizeButtons, button);
    renderMenu();
  }),
);

neighborhood.addEventListener('change', renderCart);

checkout.addEventListener('click', () => {
  showToast(`Pedido de demonstração de ${document.querySelector('#total').textContent}. Nada foi enviado nem cobrado.`);
});

renderMenu();
renderCart();
