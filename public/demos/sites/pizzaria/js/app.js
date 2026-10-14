import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { money, priceFor, addDish, changeQty, cartSummary, sizeLabel } from './rules.js';

const dishes = [...document.querySelectorAll('.dish')];
const tabs = [...document.querySelectorAll('.fv-tabs [data-cat]')];
const sizeBar = document.querySelector('#sizes');
const sizeButtons = [...sizeBar.querySelectorAll('[data-size]')];
const lines = document.querySelector('#cart-lines');
const empty = document.querySelector('#cart-empty');
const neighborhood = document.querySelector('#bairro');
const checkout = document.querySelector('#checkout');

const dishOf = (element) => ({
  id: element.dataset.id,
  name: element.dataset.name,
  media: Number(element.dataset.media),
  grande: element.dataset.grande ? Number(element.dataset.grande) : null,
});

const state = { cat: 'salgadas', size: 'media', lines: [] };

const press = (buttons, active) => buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));

const renderMenu = () => {
  sizeBar.hidden = state.cat === 'bebidas';
  dishes.forEach((element) => {
    element.hidden = element.dataset.cat !== state.cat;
    element.querySelector('.dish-price').textContent = money(priceFor(dishOf(element), state.size));
  });
};

const renderCart = () => {
  const option = neighborhood.selectedOptions[0];
  const fee = option && option.value ? Number(option.dataset.fee) : null;
  const summary = cartSummary(state.lines, fee);
  lines.innerHTML = html`${state.lines.map(
    (line) => html`<li data-key="${line.key}"><span class="line-name">${line.name}${line.size ? html`<em>${sizeLabel(line.size)}</em>` : ''}</span>
      <span class="line-qty"><button type="button" data-dec aria-label="Diminuir ${line.name}">−</button><b>${line.qty}<span class="sr-only"> unidades</span></b><button type="button" data-inc aria-label="Aumentar ${line.name}">+</button></span>
      <span class="line-price">${money(line.price * line.qty)}</span></li>`,
  )}`;
  empty.hidden = state.lines.length > 0;
  document.querySelector('#subtotal').textContent = money(summary.subtotal);
  document.querySelector('#fee').textContent = fee === null ? 'a calcular' : money(fee);
  document.querySelector('#total').textContent = money(summary.total);
  document.querySelector('#cart-count').textContent = summary.count;
  document.querySelector('#cart-top').textContent = money(summary.total);
  document.querySelector('#eta').textContent = fee === null ? 'Escolha o bairro para ver o prazo.' : `Prazo estimado: ${option.dataset.time}.`;
  checkout.disabled = !summary.ready;
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
  state.lines = changeQty(state.lines, row.dataset.key, delta);
  renderCart();
  const same = lines.querySelector(`[data-key="${row.dataset.key}"] ${delta > 0 ? '[data-inc]' : '[data-dec]'}`);
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
