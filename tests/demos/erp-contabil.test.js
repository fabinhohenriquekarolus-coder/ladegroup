import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clients, reviewBelow } from '../../public/demos/sistemas/erp-contabil/js/data.js';
import {
  money,
  totalOf,
  openFindings,
  pendingObligations,
  deliveryProgress,
  sortRows,
  toggleSort,
  needsReview,
  findingsLabel,
} from '../../public/demos/sistemas/erp-contabil/js/rules.js';

const padaria = clients.find((client) => client.id === 'padaria');

test('formata valores no padrão brasileiro com duas casas', () => {
  assert.equal(money(47865.75), '47.865,75');
  assert.equal(money(0), '0,00');
});

test('soma os lançamentos do período', () => {
  assert.equal(Number(totalOf(padaria.entries).toFixed(2)), 47865.75);
  assert.equal(totalOf([]), 0);
});

test('apontamentos só aparecem depois da conferência e somem quando revisados', () => {
  assert.deepEqual(openFindings(padaria, false), []);
  const found = openFindings(padaria, true);
  assert.ok(found.length > 0);
  const reviewed = { ...padaria, entries: padaria.entries.map((entry) => ({ ...entry, reviewed: true })) };
  assert.deepEqual(openFindings(reviewed, true), []);
});

test('conta obrigações pendentes e o progresso de entrega', () => {
  const pending = pendingObligations(padaria);
  const progress = deliveryProgress(padaria);
  assert.equal(progress.total, padaria.obligations.length);
  assert.equal(progress.done + pending, progress.total);
  assert.equal(progress.percent, Math.round((progress.done / progress.total) * 100));
  assert.deepEqual(deliveryProgress({ obligations: [] }), { done: 0, total: 0, percent: 0 });
});

test('ordena sem alterar a lista original e alterna a direção', () => {
  const rows = [{ v: 2 }, { v: 1 }, { v: 3 }];
  assert.deepEqual(sortRows(rows, { key: 'v', dir: 1 }).map((row) => row.v), [1, 2, 3]);
  assert.deepEqual(sortRows(rows, { key: 'v', dir: -1 }).map((row) => row.v), [3, 2, 1]);
  assert.deepEqual(rows.map((row) => row.v), [2, 1, 3]);
  assert.deepEqual(toggleSort({ key: 'v', dir: 1 }, 'v'), { key: 'v', dir: -1 });
  assert.deepEqual(toggleSort({ key: 'v', dir: -1 }, 'w'), { key: 'w', dir: 1 });
});

test('documento abaixo da confiança mínima pede revisão até ser aprovado', () => {
  assert.equal(needsReview({ confidence: reviewBelow - 1 }, reviewBelow), true);
  assert.equal(needsReview({ confidence: reviewBelow }, reviewBelow), false);
  assert.equal(needsReview({ confidence: 10, approved: true }, reviewBelow), false);
});

test('rótulo de apontamentos no singular e no plural', () => {
  assert.equal(findingsLabel(1), '1 apontamento');
  assert.equal(findingsLabel(3), '3 apontamentos');
});
