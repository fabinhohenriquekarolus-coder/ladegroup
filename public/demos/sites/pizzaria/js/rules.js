export const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const priceFor = (dish, size) => (size === 'grande' && dish.grande ? dish.grande : dish.media);

export const lineKey = (dish, size) => `${dish.id}-${dish.grande ? size : 'unico'}`;

export const addDish = (lines, dish, size) => {
  const key = lineKey(dish, size);
  const existing = lines.find((line) => line.key === key);
  if (existing) return lines.map((line) => (line.key === key ? { ...line, qty: line.qty + 1 } : line));
  return [...lines, { key, name: dish.name, size: dish.grande ? size : '', price: priceFor(dish, size), qty: 1 }];
};

export const changeQty = (lines, key, delta) =>
  lines.map((line) => (line.key === key ? { ...line, qty: line.qty + delta } : line)).filter((line) => line.qty > 0);

export const cartSummary = (lines, fee) => {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  return { subtotal, count, total: subtotal + (fee ?? 0), ready: count > 0 && fee !== null };
};

export const sizeLabel = (size) => (size === 'grande' ? 'Grande' : size === 'media' ? 'Média' : '');
