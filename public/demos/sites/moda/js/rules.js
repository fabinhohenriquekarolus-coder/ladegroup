export const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const bagKey = ({ id, color, size }) => `${id}-${color}-${size}`;

export const addToBag = (lines, item) => {
  const key = bagKey(item);
  if (lines.some((line) => line.key === key)) return lines.map((line) => (line.key === key ? { ...line, qty: line.qty + 1 } : line));
  return [...lines, { ...item, key, qty: 1 }];
};

export const changeQty = (lines, key, delta) =>
  lines.map((line) => (line.key === key ? { ...line, qty: line.qty + delta } : line)).filter((line) => line.qty > 0);

export const removeLine = (lines, key) => lines.filter((line) => line.key !== key);

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

export const shippingMessage = (summary) => {
  if (summary.qty === 0) return `Frete grátis em compras a partir de ${money(summary.remaining)}.`;
  if (summary.free) return 'Você ganhou frete grátis.';
  return `Faltam ${money(summary.remaining)} para o frete grátis.`;
};

export const piecesLabel = (count) => `${count} ${count === 1 ? 'peça' : 'peças'}`;

export const unitsLabel = (count) => `${count} ${count === 1 ? 'unidade' : 'unidades'}`;

export const sizeLabel = (size) => (size === 'U' ? 'tamanho único' : `tamanho ${size}`);

export const sortPieces = (pieces, mode) => {
  const list = [...pieces];
  if (mode === 'menor') return list.sort((a, b) => a.price - b.price || a.order - b.order);
  if (mode === 'maior') return list.sort((a, b) => b.price - a.price || a.order - b.order);
  return list.sort((a, b) => a.order - b.order);
};
