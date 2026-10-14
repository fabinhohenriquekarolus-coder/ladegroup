export const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const bagKey = ({ id, color, size }) => `${id}-${color}-${size}`;

export const addToBag = (lines, item) => {
  const key = bagKey(item);
  if (lines.some((line) => line.key === key)) return lines.map((line) => (line.key === key ? { ...line, qty: line.qty + 1 } : line));
  return [...lines, { ...item, key, qty: 1 }];
};

export const changeQty = (lines, key, delta) =>
  lines.map((line) => (line.key === key ? { ...line, qty: line.qty + delta } : line)).filter((line) => line.qty > 0);

export const bagSummary = (lines, freeShipping) => {
  const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const qty = lines.reduce((sum, line) => sum + line.qty, 0);
  return {
    total,
    qty,
    free: total >= freeShipping,
    remaining: Math.max(0, freeShipping - total),
    progress: freeShipping ? Math.min(100, (total / freeShipping) * 100) : 100,
  };
};

export const piecesLabel = (count) => `${count} ${count === 1 ? 'peça' : 'peças'}`;
