const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const toast = (message) => document.dispatchEvent(new CustomEvent('demo:toast', { detail: message }));

const root = document.querySelector('#ml');
const free = Number(root.dataset.free);
const items = [...document.querySelectorAll('.item')];
const filters = document.querySelectorAll('.ml-filters [data-cat]');
const count = document.querySelector('#count');
const bag = document.querySelector('#bag');
const scrim = document.querySelector('#scrim');
const openButton = document.querySelector('#open-bag');
const lines = document.querySelector('#bag-lines');
const checkout = document.querySelector('#bag-checkout');

const state = { cat: 'todos', cart: new Map() };

const press = (buttons, active) => buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));

const renderGrid = () => {
  let visible = 0;
  items.forEach((item) => {
    const show = state.cat === 'todos' || item.dataset.cat === state.cat;
    item.hidden = !show;
    if (show) visible += 1;
  });
  count.textContent = `${visible} ${visible === 1 ? 'peça' : 'peças'}`;
};

const renderBag = () => {
  const entries = [...state.cart.values()];
  const total = entries.reduce((sum, line) => sum + line.price * line.qty, 0);
  const qty = entries.reduce((sum, line) => sum + line.qty, 0);
  lines.innerHTML = entries
    .map(
      (line) => `<li data-key="${line.key}"><i style="background:${line.hex}"></i>
      <div><strong>${line.name}</strong><span>${line.color} · ${line.size}</span>
      <div class="qty"><button type="button" data-dec aria-label="Diminuir ${line.name}">−</button><b>${line.qty}</b><button type="button" data-inc aria-label="Aumentar ${line.name}">+</button></div></div>
      <em>${money(line.price * line.qty)}</em></li>`,
    )
    .join('');
  document.querySelector('#bag-empty').hidden = entries.length > 0;
  document.querySelector('#bag-count').textContent = qty;
  document.querySelector('#bag-total').textContent = money(total);
  document.querySelector('#meter').style.width = `${Math.min(100, (total / free) * 100)}%`;
  document.querySelector('#ship').textContent =
    total >= free ? 'Você ganhou frete grátis.' : `Faltam ${money(free - total)} para o frete grátis.`;
  checkout.disabled = qty === 0;
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
    press([...filters], button);
    renderGrid();
  }),
);

document.querySelector('#grid').addEventListener('click', (event) => {
  const item = event.target.closest('.item');
  if (!item) return;
  const swatch = event.target.closest('.swatch');
  const size = event.target.closest('[data-size]');
  const fav = event.target.closest('.item-fav');
  if (swatch) {
    item.style.setProperty('--g', swatch.dataset.hex);
    press([...item.querySelectorAll('.swatch')], swatch);
  } else if (size) {
    press([...item.querySelectorAll('[data-size]')], size);
  } else if (fav) {
    fav.setAttribute('aria-pressed', String(fav.getAttribute('aria-pressed') !== 'true'));
  } else if (event.target.closest('[data-add]')) {
    const color = item.querySelector('.swatch[aria-pressed=true]');
    const chosen = item.querySelector('[data-size][aria-pressed=true]').dataset.size;
    const key = `${item.dataset.id}-${color.dataset.color}-${chosen}`;
    const line = state.cart.get(key);
    if (line) line.qty += 1;
    else state.cart.set(key, { key, name: item.dataset.name, price: Number(item.dataset.price), color: color.getAttribute('aria-label'), hex: color.dataset.hex, size: chosen, qty: 1 });
    renderBag();
    openBag();
  }
});

lines.addEventListener('click', (event) => {
  const row = event.target.closest('li');
  if (!row) return;
  const line = state.cart.get(row.dataset.key);
  if (event.target.closest('[data-inc]')) line.qty += 1;
  if (event.target.closest('[data-dec]')) line.qty -= 1;
  if (line.qty <= 0) state.cart.delete(row.dataset.key);
  renderBag();
});

openButton.addEventListener('click', openBag);
document.querySelector('#close-bag').addEventListener('click', closeBag);
scrim.addEventListener('click', closeBag);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !bag.hidden) closeBag();
});

checkout.addEventListener('click', () => {
  closeBag();
  toast('Compra de demonstração: nada foi enviado nem cobrado.');
});

renderGrid();
renderBag();
