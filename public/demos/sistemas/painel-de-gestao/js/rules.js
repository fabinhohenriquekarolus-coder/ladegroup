export const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export const moneyCents = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const integer = (value) => value.toLocaleString('pt-BR');

export const smoothPath = (points) => {
  if (points.length < 3) return `M${points.map((point) => point.join(',')).join('L')}`;
  let path = `M${points[0][0]},${points[0][1]}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    path += `C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return path;
};

export const chartPoints = (values, width, height, pad) => {
  const max = Math.max(...values) * 1.12;
  const min = Math.min(...values) * 0.7;
  const span = max - min || 1;
  const step = values.length > 1 ? (width - pad.left - pad.right) / (values.length - 1) : 0;
  return values.map((value, index) => [pad.left + index * step, pad.top + (1 - (value - min) / span) * (height - pad.top - pad.bottom)]);
};

export const nearestIndex = (ratio, count) => Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));

export const donutSegments = (shares, radius, gap = 2) => {
  const length = 2 * Math.PI * radius;
  let offset = 0;
  return shares.map((share) => {
    const dash = (share / 100) * length;
    const segment = { dash: dash - gap, rest: length - dash + gap, offset: -offset };
    offset += dash;
    return segment;
  });
};

export const goalProgress = (goal, extra) => {
  const bonus = goal.id === 'receita' ? extra.revenue : goal.id === 'pedidos' ? extra.orders : 0;
  const current = goal.current + bonus;
  return { current, percent: Math.round((current / goal.target) * 100) };
};

export const addIncoming = (state, incoming) => {
  const order = incoming[state.incomingIndex % incoming.length];
  return {
    order,
    next: {
      ...state,
      incomingIndex: state.incomingIndex + 1,
      extra: { revenue: state.extra.revenue + Math.round(order.value), orders: state.extra.orders + 1 },
      feed: [{ ...order, when: 'agora' }, ...state.feed].slice(0, 6),
    },
  };
};
