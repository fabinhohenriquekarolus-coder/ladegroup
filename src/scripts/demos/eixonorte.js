const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const toast = (message) => document.dispatchEvent(new CustomEvent('demo:toast', { detail: message }));
const plain = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const root = document.querySelector('.en');
const tiers = JSON.parse(root.dataset.tiers);
const rows = [...document.querySelectorAll('.part')];
const chips = [...document.querySelectorAll('.en-chips [data-cat]')];
const search = document.querySelector('#q');
const line = document.querySelector('#line');
const onlyStock = document.querySelector('#only-stock');
const lines = document.querySelector('#quote-lines');
const error = document.querySelector('#quote-error');
const form = document.querySelector('#quote-form');

const state = { cat: 'todas', quote: new Map() };

const rateFor = (qty) => (tiers.find((tier) => qty >= tier.min) ?? { rate: 0 }).rate;

const renderTable = () => {
  const term = plain(search.value.trim());
  let visible = 0;
  rows.forEach((row) => {
    const haystack = plain(`${row.dataset.code} ${row.dataset.name} ${row.dataset.app}`);
    const show =
      (state.cat === 'todas' || row.dataset.cat === state.cat) &&
      (line.value === 'todas' || row.dataset.line === line.value) &&
      (!onlyStock.checked || Number(row.dataset.stock) > 0) &&
      haystack.includes(term);
    row.hidden = !show;
    if (show) visible += 1;
  });
  document.querySelector('#count').textContent = `${visible} ${visible === 1 ? 'item' : 'itens'}`;
  document.querySelector('#empty').hidden = visible > 0;
};

const renderQuote = () => {
  const entries = [...state.quote.values()];
  lines.innerHTML = entries
    .map((entry) => {
      const rate = rateFor(entry.qty);
      return `<li data-code="${entry.code}"><div><b>${entry.code}</b><span>${entry.name}</span>${entry.stock === 0 ? '<em>Sob encomenda · até 5 dias úteis</em>' : ''}${rate ? `<em class="off">Desconto de ${rate * 100}% aplicado</em>` : ''}</div>
      <div class="step"><button type="button" data-dec aria-label="Diminuir ${entry.code}">−</button><b>${entry.qty}</b><button type="button" data-inc aria-label="Aumentar ${entry.code}">+</button></div>
      <strong>${money(Math.round(entry.price * entry.qty * (1 - rate)))}</strong></li>`;
    })
    .join('');
  const subtotal = entries.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
  const total = entries.reduce((sum, entry) => sum + Math.round(entry.price * entry.qty * (1 - rateFor(entry.qty))), 0);
  document.querySelector('#quote-empty').hidden = entries.length > 0;
  document.querySelector('#sum-sub').textContent = money(subtotal);
  document.querySelector('#sum-disc').textContent = subtotal === total ? money(0) : `− ${money(subtotal - total)}`;
  document.querySelector('#sum-total').textContent = money(total);
  document.querySelector('#quote-count').textContent = entries.length;
};

chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    state.cat = chip.dataset.cat;
    chips.forEach((other) => other.setAttribute('aria-pressed', String(other === chip)));
    renderTable();
  }),
);

search.addEventListener('input', renderTable);
line.addEventListener('change', renderTable);
onlyStock.addEventListener('change', renderTable);

document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#parts').addEventListener('click', (event) => {
  if (!event.target.closest('[data-add]')) return;
  const row = event.target.closest('.part');
  const input = row.querySelector('.qty');
  const qty = Math.min(999, Math.max(1, Math.floor(Number(input.value) || 1)));
  const entry = state.quote.get(row.dataset.code);
  if (entry) entry.qty = Math.min(999, entry.qty + qty);
  else state.quote.set(row.dataset.code, { code: row.dataset.code, name: row.dataset.name, price: Number(row.dataset.price), stock: Number(row.dataset.stock), qty });
  input.value = 1;
  renderQuote();
  toast(`${row.dataset.code} adicionado à cotação.`);
});

lines.addEventListener('click', (event) => {
  const row = event.target.closest('li');
  if (!row) return;
  const entry = state.quote.get(row.dataset.code);
  if (event.target.closest('[data-inc]')) entry.qty = Math.min(999, entry.qty + 1);
  if (event.target.closest('[data-dec]')) entry.qty -= 1;
  if (entry.qty <= 0) state.quote.delete(row.dataset.code);
  renderQuote();
});

const cnpj = document.querySelector('#cnpj');
cnpj.addEventListener('input', () => {
  const digits = cnpj.value.replace(/\D/g, '').slice(0, 14);
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 8), digits.slice(8, 12), digits.slice(12, 14)];
  cnpj.value = [parts[0], parts[1] && `.${parts[1]}`, parts[2] && `.${parts[2]}`, parts[3] && `/${parts[3]}`, parts[4] && `-${parts[4]}`].filter(Boolean).join('');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (state.quote.size === 0) {
    error.textContent = 'Adicione ao menos uma peça à cotação.';
    error.hidden = false;
    return;
  }
  if (cnpj.value.replace(/\D/g, '').length !== 14) {
    error.textContent = 'Informe o CNPJ com 14 números.';
    error.hidden = false;
    return;
  }
  error.hidden = true;
  toast(`Cotação de demonstração com ${state.quote.size} ${state.quote.size === 1 ? 'item' : 'itens'}, total ${document.querySelector('#sum-total').textContent}. Nada foi enviado.`);
});

renderTable();
renderQuote();
