const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const toast = (message) => document.dispatchEvent(new CustomEvent('demo:toast', { detail: message }));

const dishes = [...document.querySelectorAll('.dish')];
const tabs = document.querySelectorAll('.fv-tabs [data-cat]');
const sizeBar = document.querySelector('#sizes');
const sizeButtons = sizeBar.querySelectorAll('[data-size]');
const lines = document.querySelector('#cart-lines');
const empty = document.querySelector('#cart-empty');
const bairro = document.querySelector('#bairro');
const checkout = document.querySelector('#checkout');

const state = { cat: 'salgadas', size: 'media', cart: new Map() };

const priceOf = (dish, size) => {
  const grande = dish.dataset.grande;
  return size === 'grande' && grande ? Number(grande) : Number(dish.dataset.media);
};

const hasSizes = (dish) => dish.dataset.grande !== '';

const renderMenu = () => {
  sizeBar.hidden = state.cat === 'bebidas';
  dishes.forEach((dish) => {
    dish.hidden = dish.dataset.cat !== state.cat;
    dish.querySelector('.dish-price').textContent = money(priceOf(dish, state.size));
  });
};

const renderCart = () => {
  const entries = [...state.cart.values()];
  lines.innerHTML = entries
    .map(
      (line) => `<li data-key="${line.key}"><span class="line-name">${line.name}${line.size ? `<em>${line.size === 'grande' ? 'Grande' : 'Média'}</em>` : ''}</span>
      <span class="line-qty"><button type="button" data-dec aria-label="Diminuir ${line.name}">−</button><b>${line.qty}</b><button type="button" data-inc aria-label="Aumentar ${line.name}">+</button></span>
      <span class="line-price">${money(line.price * line.qty)}</span></li>`,
    )
    .join('');
  empty.hidden = entries.length > 0;

  const subtotal = entries.reduce((sum, line) => sum + line.price * line.qty, 0);
  const count = entries.reduce((sum, line) => sum + line.qty, 0);
  const option = bairro.selectedOptions[0];
  const fee = option && option.value ? Number(option.dataset.fee) : null;
  const total = subtotal + (fee ?? 0);

  document.querySelector('#subtotal').textContent = money(subtotal);
  document.querySelector('#fee').textContent = fee === null ? '—' : money(fee);
  document.querySelector('#total').textContent = money(total);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#cart-top').textContent = money(total);
  document.querySelector('#eta').textContent = fee === null ? 'Escolha o bairro para ver o prazo.' : `Prazo estimado: ${option.dataset.time}.`;
  checkout.disabled = count === 0 || fee === null;
};

const add = (dish) => {
  const sized = hasSizes(dish);
  const size = sized ? state.size : '';
  const key = `${dish.dataset.id}-${size}`;
  const line = state.cart.get(key);
  if (line) line.qty += 1;
  else state.cart.set(key, { key, name: dish.dataset.name, size, price: priceOf(dish, state.size), qty: 1 });
  renderCart();
};

document.querySelector('#dishes').addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (button) add(button.closest('.dish'));
});

lines.addEventListener('click', (event) => {
  const row = event.target.closest('li');
  if (!row) return;
  const line = state.cart.get(row.dataset.key);
  if (event.target.closest('[data-inc]')) line.qty += 1;
  if (event.target.closest('[data-dec]')) line.qty -= 1;
  if (line.qty <= 0) state.cart.delete(row.dataset.key);
  renderCart();
});

tabs.forEach((tab) =>
  tab.addEventListener('click', () => {
    state.cat = tab.dataset.cat;
    tabs.forEach((other) => other.setAttribute('aria-pressed', String(other === tab)));
    renderMenu();
  }),
);

sizeButtons.forEach((button) =>
  button.addEventListener('click', () => {
    state.size = button.dataset.size;
    sizeButtons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    renderMenu();
  }),
);

bairro.addEventListener('change', renderCart);

checkout.addEventListener('click', () => {
  const total = document.querySelector('#total').textContent;
  toast(`Pedido de demonstração de ${total}. Nada foi enviado nem cobrado.`);
});

renderMenu();
renderCart();
