import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bagKey, addToBag, changeQty, bagSummary, piecesLabel } from '../../public/demos/sites/moda/js/rules.js';

const coat = { id: 'entretempo', name: 'Casaco Entretempo', price: 58900, color: 'noite', size: 'M' };

test('mesma peça em cor ou tamanho diferente vira outra linha', () => {
  let lines = addToBag([], coat);
  lines = addToBag(lines, coat);
  lines = addToBag(lines, { ...coat, size: 'G' });
  lines = addToBag(lines, { ...coat, color: 'areia' });
  assert.equal(lines.length, 3);
  assert.equal(lines.find((line) => line.key === bagKey(coat)).qty, 2);
});

test('remover a última unidade tira a linha da sacola', () => {
  const lines = addToBag([], coat);
  assert.deepEqual(changeQty(lines, lines[0].key, -1), []);
});

test('frete grátis a partir do limite, com quanto falta e progresso', () => {
  const scarf = { id: 'brisa', name: 'Lenço Brisa', price: 11900, color: 'giz', size: 'M' };
  const small = bagSummary(addToBag([], scarf), 35000);
  assert.equal(small.free, false);
  assert.equal(small.remaining, 23100);
  assert.equal(Math.round(small.progress), 34);
  const big = bagSummary(addToBag([], coat), 35000);
  assert.equal(big.free, true);
  assert.equal(big.remaining, 0);
  assert.equal(big.progress, 100);
});

test('contagem de peças no singular e plural', () => {
  assert.equal(piecesLabel(1), '1 peça');
  assert.equal(piecesLabel(12), '12 peças');
});
