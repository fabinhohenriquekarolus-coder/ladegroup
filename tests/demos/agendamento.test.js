import { test } from 'node:test';
import assert from 'node:assert/strict';
import { services, appointments, closeHour, openHour } from '../../public/demos/sistemas/agendamento/js/data.js';
import {
  toMinutes,
  toTime,
  endOf,
  findConflict,
  fitsBusinessHours,
  assignLanes,
  nextFreeStart,
  slotFromOffset,
  initials,
  visitsLabel,
} from '../../public/demos/sistemas/agendamento/js/rules.js';

const items = appointments.map((item, index) => ({ ...item, id: `a${index + 1}`, startMin: toMinutes(item.start) }));

test('converte horários em minutos e de volta', () => {
  assert.equal(toMinutes('09:30'), 570);
  assert.equal(toTime(570), '09:30');
  assert.equal(toTime(toMinutes('17:05')), '17:05');
});

test('calcula o fim pelo tempo do serviço', () => {
  assert.equal(endOf({ startMin: 600, service: 'coloracao' }, services), 690);
});

test('aponta conflito só para o mesmo profissional no mesmo dia', () => {
  const candidate = { id: 'novo', day: 2, pro: 'ana', service: 'corte', startMin: toMinutes('10:00') };
  assert.equal(findConflict(items, candidate, services)?.client, 'c5');
  assert.equal(findConflict(items, { ...candidate, pro: 'beto' }, services), null);
  assert.equal(findConflict(items, { ...candidate, day: 5, startMin: toMinutes('15:00') }, services), null);
});

test('horário que termina exatamente no início do outro não conflita', () => {
  const candidate = { id: 'novo', day: 2, pro: 'ana', service: 'escova', startMin: toMinutes('09:00') };
  assert.equal(findConflict(items, candidate, services), null);
});

test('respeita o horário de funcionamento', () => {
  const open = openHour * 60;
  const close = closeHour * 60;
  assert.equal(fitsBusinessHours({ startMin: toMinutes('17:00'), service: 'coloracao' }, services, open, close), false);
  assert.equal(fitsBusinessHours({ startMin: toMinutes('17:00'), service: 'escova' }, services, open, close), true);
});

test('distribui atendimentos sobrepostos em colunas sem mudar a entrada', () => {
  const day = items.filter((item) => item.day === 0);
  const before = JSON.stringify(day);
  const placed = assignLanes(day, services);
  assert.equal(JSON.stringify(day), before);
  const first = placed.find((item) => item.start === '09:00');
  const second = placed.find((item) => item.start === '09:30');
  assert.equal(first.lanes, 2);
  assert.notEqual(first.lane, second.lane);
  assert.equal(placed.find((item) => item.start === '14:00').lanes, 1);
});

test('encontra o próximo horário livre ou avisa que não há', () => {
  const item = items.find((entry) => entry.day === 2 && entry.start === '16:00');
  assert.equal(nextFreeStart(items, item, services, closeHour * 60), toMinutes('16:30'));
  const late = { ...item, startMin: toMinutes('17:00') };
  assert.equal(nextFreeStart(items, late, services, closeHour * 60), null);
});

test('converte a posição do clique em blocos de 30 minutos', () => {
  assert.equal(slotFromOffset(0, 480), 480);
  assert.equal(slotFromOffset(59, 480), 480 + 30);
  assert.equal(slotFromOffset(61, 480), 480 + 60);
});

test('gera iniciais e rótulo de visitas', () => {
  assert.equal(initials('  sônia   ribeiro '), 'SR');
  assert.equal(visitsLabel({ visits: 0 }), 'Ainda sem visitas');
  assert.equal(visitsLabel({ visits: 1, last: 'ontem' }), '1 visita, última ontem');
});
