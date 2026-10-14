import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priceFor, lineKey, addDish, changeQty, cartSummary, sizeLabel, money } from '../../public/demos/sites/pizzaria/js/rules.js';

const margherita = { id: 'margherita', name: 'Margherita da Casa', media: 4400, grande: 5600 };
const refri = { id: 'refri', name: 'Refrigerante 2 L', media: 1200, grande: null };

test('preço muda com o tamanho só quando a pizza tem tamanho grande', () => {
  assert.equal(priceFor(margherita, 'media'), 4400);
  assert.equal(priceFor(margherita, 'grande'), 5600);
  assert.equal(priceFor(refri, 'grande'), 1200);
});

test('mesma pizza em tamanhos diferentes vira linhas separadas', () => {
  assert.notEqual(lineKey(margherita, 'media'), lineKey(margherita, 'grande'));
  assert.equal(lineKey(refri, 'media'), lineKey(refri, 'grande'));
  let lines = addDish([], margherita, 'media');
  lines = addDish(lines, margherita, 'media');
  lines = addDish(lines, margherita, 'grande');
  assert.equal(lines.length, 2);
  assert.equal(lines[0].qty, 2);
});

test('diminuir até zero remove a linha', () => {
  const lines = addDish([], refri, 'media');
  assert.deepEqual(changeQty(lines, lines[0].key, -1), []);
  assert.equal(changeQty(lines, lines[0].key, 2)[0].qty, 3);
});

test('total soma a taxa e só libera com bairro escolhido', () => {
  const lines = addDish(addDish([], margherita, 'grande'), refri, 'media');
  assert.deepEqual(cartSummary(lines, 700), { subtotal: 6800, count: 2, total: 7500, ready: true });
  assert.equal(cartSummary(lines, null).ready, false);
  assert.equal(cartSummary([], 700).ready, false);
});

test('rótulos e moeda', () => {
  assert.equal(sizeLabel('grande'), 'Grande');
  assert.equal(sizeLabel(''), '');
  assert.equal(money(10500).replace(/\s/g, ' '), 'R$ 105,00');
});
