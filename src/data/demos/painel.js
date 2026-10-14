const lcg = (seed) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const makeSeries = (count, total, seed) => {
  const rand = lcg(seed);
  const weekly = [0.9, 0.92, 0.95, 1, 1.2, 1.38, 1.12];
  const raw = Array.from({ length: count }, (_, i) => weekly[i % 7] * (0.86 + (i / count) * 0.28) * (0.9 + rand() * 0.2));
  const sum = raw.reduce((a, b) => a + b, 0);
  const values = raw.map((v) => Math.round((v / sum) * total));
  values[count - 1] += total - values.reduce((a, b) => a + b, 0);
  return values;
};

const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export const periods = {
  7: {
    label: 'últimos 7 dias',
    total: 18420,
    orders: 126,
    ticket: 146,
    customers: 34,
    delta: 8.4,
    labels: weekdays,
    values: makeSeries(7, 18420, 11),
    channels: [46, 24, 18, 12],
    top: [38, 27, 25, 19, 17],
  },
  30: {
    label: 'últimos 30 dias',
    total: 74900,
    orders: 512,
    ticket: 146,
    customers: 118,
    delta: 6.1,
    labels: Array.from({ length: 30 }, (_, i) => `Dia ${i + 1}`),
    values: makeSeries(30, 74900, 23),
    channels: [44, 26, 18, 12],
    top: [151, 112, 98, 77, 74],
  },
  90: {
    label: 'últimos 90 dias',
    total: 231300,
    orders: 1585,
    ticket: 146,
    customers: 342,
    delta: 11.3,
    labels: Array.from({ length: 13 }, (_, i) => `Semana ${i + 1}`),
    values: makeSeries(13, 231300, 37),
    channels: [41, 28, 19, 12],
    top: [468, 351, 302, 244, 220],
  },
};

export const channels = [
  { name: 'Loja física', color: '#2b1240' },
  { name: 'Instagram', color: '#ff5c7a' },
  { name: 'Site', color: '#7c4bb5' },
  { name: 'WhatsApp', color: '#ffb199' },
];

export const products = ['Camiseta básica', 'Calça jeans', 'Kit de meias', 'Jaqueta leve', 'Boné'];

export const bands = ['9h', '11h', '13h', '15h', '17h', '19h', '21h'];

const heatRand = lcg(91);
const dayWeight = [0.7, 0.75, 0.8, 0.9, 1.1, 1.35, 1.0];
const bandWeight = [0.4, 0.7, 0.8, 0.9, 1.15, 1.3, 0.7];

export const heat = weekdays.map((day, d) =>
  bands.map((band, b) => {
    const strength = dayWeight[d] * bandWeight[b] * (0.85 + heatRand() * 0.3);
    return { day, band, value: Math.round(strength * 1100), orders: Math.round(strength * 8) };
  }),
);

export const goals = [
  { id: 'receita', label: 'Faturamento do mês', current: 74900, target: 90000, money: true },
  { id: 'pedidos', label: 'Pedidos do mês', current: 512, target: 600, money: false },
  { id: 'clientes', label: 'Clientes novos', current: 118, target: 150, money: false },
];

export const feed = [
  { who: 'Juliana M.', what: '2 camisetas básicas', value: 189.9, when: 'há 4 min' },
  { who: 'Pedro H.', what: 'Kit de meias', value: 96, when: 'há 11 min' },
  { who: 'Camila R.', what: 'Jaqueta leve e boné', value: 312.5, when: 'há 26 min' },
  { who: 'Diego S.', what: 'Calça jeans', value: 74.9, when: 'há 41 min' },
];

export const incoming = [
  { who: 'Aline T.', what: 'Calça jeans e camiseta', value: 158 },
  { who: 'Marcos V.', what: 'Jaqueta leve', value: 229.9 },
  { who: 'Renata B.', what: '3 kits de meias', value: 144 },
  { who: 'Otávio L.', what: 'Boné', value: 59.9 },
];
