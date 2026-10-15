import { test } from 'node:test';
import assert from 'node:assert/strict';
import { busy } from '../../public/demos/sites/petshop/js/data.js';
import { estimate, formatDuration, takenHours, isAvailable, missingFields, listInPortuguese } from '../../public/demos/sites/petshop/js/rules.js';

test('estimativa soma porte e adicionais', () => {
  const medio = { price: 7500, minutes: 80 };
  const hidratacao = { price: 2500, minutes: 15 };
  assert.deepEqual(estimate(medio, [hidratacao]), { price: 10000, minutes: 95 });
  assert.deepEqual(estimate(medio, []), { price: 7500, minutes: 80 });
});

test('duração em horas e minutos', () => {
  assert.equal(formatDuration(60), '1 h');
  assert.equal(formatDuration(95), '1 h 35 min');
  assert.equal(formatDuration(45), '45 min');
});

test('horários ocupados dependem do dia escolhido', () => {
  assert.deepEqual(takenHours(busy, 'Dom 18'), []);
  assert.equal(isAvailable(busy, 'Ter 13', '09:00'), false);
  assert.equal(isAvailable(busy, 'Ter 13', '10:30'), true);
  assert.equal(isAvailable(busy, '', '10:30'), false);
});

test('aponta o que falta preencher, na ordem do formulário', () => {
  assert.deepEqual(missingFields({ tutor: ' ', pet: '', day: '', hour: '' }), ['seu nome', 'o nome do pet', 'o dia']);
  assert.deepEqual(missingFields({ tutor: 'Ana', pet: 'Pipoca', day: 'Seg 12', hour: '' }), ['o horário']);
  assert.deepEqual(missingFields({ tutor: 'Ana', pet: 'Pipoca', day: 'Seg 12', hour: '09:00' }), []);
});

test('lista em português com vírgulas e "e" no fim', () => {
  assert.equal(listInPortuguese(['a']), 'a');
  assert.equal(listInPortuguese(['a', 'b']), 'a e b');
  assert.equal(listInPortuguese(['a', 'b', 'c']), 'a, b e c');
});
