import { test } from 'node:test';
import assert from 'node:assert/strict';
import { periods, goals, feed, incoming } from '../../public/demos/sistemas/painel-de-gestao/js/data.js';
import {
  money,
  integer,
  smoothPath,
  chartPoints,
  nearestIndex,
  donutSegments,
  goalProgress,
  addIncoming,
} from '../../public/demos/sistemas/painel-de-gestao/js/rules.js';

test('cada período soma exatamente o faturamento informado', () => {
  Object.values(periods).forEach((period) => {
    assert.equal(period.values.reduce((sum, value) => sum + value, 0), period.total);
    assert.equal(period.values.length, period.labels.length);
    assert.equal(period.channels.reduce((sum, share) => sum + share, 0), 100);
  });
});

test('formata moeda sem centavos e inteiros no padrão brasileiro', () => {
  assert.equal(money(18420).replace(/\s/g, ' '), 'R$ 18.420');
  assert.equal(integer(1585), '1.585');
});

test('pontos do gráfico ficam dentro da área útil', () => {
  const pad = { top: 24, right: 14, bottom: 26, left: 14 };
  const points = chartPoints(periods[7].values, 600, 250, pad);
  assert.equal(points.length, 7);
  assert.equal(points[0][0], pad.left);
  assert.equal(points[6][0], 600 - pad.right);
  points.forEach(([, y]) => assert.ok(y >= pad.top && y <= 250 - pad.bottom));
  assert.match(smoothPath(points), /^M14,[\d.]+C/);
  assert.match(smoothPath([[0, 0], [1, 1]]), /^M0,0L1,1$/);
});

test('posição do ponteiro vira o índice mais próximo dentro dos limites', () => {
  assert.equal(nearestIndex(0, 7), 0);
  assert.equal(nearestIndex(1, 7), 6);
  assert.equal(nearestIndex(-2, 7), 0);
  assert.equal(nearestIndex(0.5, 7), 3);
});

test('segmentos da rosca cobrem a circunferência na ordem', () => {
  const segments = donutSegments([50, 50], 10, 0);
  const length = 2 * Math.PI * 10;
  assert.ok(Math.abs(segments[0].dash - length / 2) < 1e-9);
  assert.ok(Math.abs(segments[1].offset + length / 2) < 1e-9);
});

test('metas somam os pedidos simulados só onde se aplicam', () => {
  const revenue = goals.find((goal) => goal.id === 'receita');
  const customers = goals.find((goal) => goal.id === 'clientes');
  const extra = { revenue: 1000, orders: 3 };
  assert.equal(goalProgress(revenue, extra).current, revenue.current + 1000);
  assert.equal(goalProgress(customers, extra).current, customers.current);
});

test('novo pedido entra no topo, soma ao faturamento e mantém seis itens', () => {
  const state = { period: '7', extra: { revenue: 0, orders: 0 }, feed: [...feed], incomingIndex: 0 };
  const { order, next } = addIncoming(state, incoming);
  assert.equal(next.feed[0].who, order.who);
  assert.equal(next.feed[0].when, 'agora');
  assert.equal(next.feed.length, Math.min(6, feed.length + 1));
  assert.equal(next.extra.orders, 1);
  assert.equal(next.extra.revenue, Math.round(order.value));
  assert.equal(state.extra.orders, 0);
});
