export const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const plain = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const matchesFilters = (part, { term, category, line, onlyStock }) => {
  const haystack = plain(`${part.code} ${part.name} ${part.app}`);
  return (
    (category === 'todas' || part.cat === category) &&
    (line === 'todas' || part.line === line) &&
    (!onlyStock || part.stock > 0) &&
    haystack.includes(plain(term.trim()))
  );
};

export const discountRate = (qty, tiers) => (tiers.find((tier) => qty >= tier.min) ?? { rate: 0 }).rate;

export const lineTotal = (entry, tiers) => Math.round(entry.price * entry.qty * (1 - discountRate(entry.qty, tiers)));

export const clampQty = (value, max = 999) => Math.min(max, Math.max(1, Math.floor(Number(value) || 1)));

export const addToQuote = (entries, part, qty) => {
  const amount = clampQty(qty);
  if (entries.some((entry) => entry.code === part.code)) {
    return entries.map((entry) => (entry.code === part.code ? { ...entry, qty: clampQty(entry.qty + amount) } : entry));
  }
  return [...entries, { ...part, qty: amount }];
};

export const changeQty = (entries, code, delta) =>
  entries
    .map((entry) => (entry.code === code ? { ...entry, qty: Math.min(999, entry.qty + delta) } : entry))
    .filter((entry) => entry.qty > 0);

export const quoteSummary = (entries, tiers) => {
  const subtotal = entries.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
  const total = entries.reduce((sum, entry) => sum + lineTotal(entry, tiers), 0);
  return { subtotal, discount: subtotal - total, total, items: entries.length };
};

export const formatCnpj = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 8), digits.slice(8, 12), digits.slice(12, 14)];
  return [parts[0], parts[1] && `.${parts[1]}`, parts[2] && `.${parts[2]}`, parts[3] && `/${parts[3]}`, parts[4] && `-${parts[4]}`]
    .filter(Boolean)
    .join('');
};

const checkDigit = (digits, weights) => {
  const sum = weights.reduce((total, weight, index) => total + Number(digits[index]) * weight, 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
};

export const isValidCnpj = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false;
  const first = checkDigit(digits, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = checkDigit(digits, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return first === Number(digits[12]) && second === Number(digits[13]);
};

export const itemsLabel = (count) => `${count} ${count === 1 ? 'item' : 'itens'}`;
