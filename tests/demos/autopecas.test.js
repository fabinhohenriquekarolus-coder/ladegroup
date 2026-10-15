import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tiers } from '../../public/demos/sites/autopecas/js/data.js';
import {
  plain,
  matchesFilters,
  discountRate,
  lineTotal,
  clampQty,
  addToQuote,
  changeQty,
  quoteSummary,
  formatCnpj,
  isValidCnpj,
  filtersFromQuery,
} from '../../public/demos/sites/autopecas/js/rules.js';

const pastilha = { code: 'EN-1042', cat: 'freios', line: 'leve', name: 'Pastilha de freio dianteira', app: 'Compactos e sedãs 1.0 a 1.6', stock: 240, price: 8990 };
const pivo = { code: 'EN-4310', cat: 'suspensao', line: 'pesada', name: 'Pivô de suspensão reforçado', app: 'Caminhões leves', stock: 0, price: 12700 };
const all = { term: '', category: 'todas', line: 'todas', onlyStock: false };

test('busca ignora acentos e maiúsculas', () => {
  assert.equal(plain('Pivô DE Suspensão'), 'pivo de suspensao');
  assert.equal(matchesFilters(pivo, { ...all, term: 'PIVO' }), true);
  assert.equal(matchesFilters(pastilha, { ...all, term: 'sedas' }), true);
  assert.equal(matchesFilters(pastilha, { ...all, term: 'filtro' }), false);
});

test('filtros de categoria, linha e estoque se combinam', () => {
  assert.equal(matchesFilters(pivo, { ...all, onlyStock: true }), false);
  assert.equal(matchesFilters(pivo, { ...all, line: 'leve' }), false);
  assert.equal(matchesFilters(pastilha, { ...all, category: 'freios', line: 'leve', onlyStock: true }), true);
});

test('desconto por volume segue as faixas', () => {
  assert.equal(discountRate(9, tiers), 0);
  assert.equal(discountRate(10, tiers), 0.05);
  assert.equal(discountRate(50, tiers), 0.08);
  assert.equal(lineTotal({ price: 8990, qty: 12 }, tiers), 102486);
});

test('quantidade fica entre 1 e 999', () => {
  assert.equal(clampQty('0'), 1);
  assert.equal(clampQty('abc'), 1);
  assert.equal(clampQty('12.7'), 12);
  assert.equal(clampQty('5000'), 999);
});

test('cotação soma itens repetidos e calcula desconto', () => {
  let entries = addToQuote([], pastilha, 6);
  entries = addToQuote(entries, pastilha, 6);
  entries = addToQuote(entries, pivo, 1);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].qty, 12);
  const summary = quoteSummary(entries, tiers);
  assert.equal(summary.subtotal, 8990 * 12 + 12700);
  assert.equal(summary.total, 102486 + 12700);
  assert.equal(summary.discount, summary.subtotal - summary.total);
  assert.deepEqual(changeQty(entries, 'EN-4310', -1).map((entry) => entry.code), ['EN-1042']);
});

test('CNPJ é formatado enquanto digita e validado pelos dígitos verificadores', () => {
  assert.equal(formatCnpj('11222333000181'), '11.222.333/0001-81');
  assert.equal(formatCnpj('11.222'), '11.222');
  assert.equal(isValidCnpj('11.222.333/0001-81'), true);
  assert.equal(isValidCnpj('11.222.333/0001-82'), false);
  assert.equal(isValidCnpj('00.000.000/0000-00'), false);
  assert.equal(isValidCnpj('1122233300018'), false);
});

test('busca e categoria chegam pelo endereço da página do catálogo', () => {
  const categories = ['todas', 'freios', 'filtros', 'suspensao', 'motor', 'eletrica'];
  assert.deepEqual(filtersFromQuery('?q=+pastilha+&categoria=freios', categories), { term: 'pastilha', category: 'freios' });
  assert.deepEqual(filtersFromQuery('?q=pivô', categories), { term: 'pivô', category: 'todas' });
  assert.deepEqual(filtersFromQuery('?categoria=pneus', categories), { term: '', category: 'todas' });
  assert.deepEqual(filtersFromQuery('', categories), { term: '', category: 'todas' });
  assert.equal(filtersFromQuery(`?q=${'a'.repeat(80)}`, categories).term.length, 60);
});
