import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as data from '../../public/demos/sistemas/barbearia/js/data.js';
import {
  money,
  toMinutes,
  toTime,
  roundUp,
  endOf,
  statusAt,
  busyIntervals,
  nextSlot,
  planQueue,
  waitLabel,
  fitWalkIn,
  earliestSlot,
  dayTotals,
  cashSummary,
  paymentsBreakdown,
  subscriptionStatus,
  filterSubscribers,
  clubSummary,
  renewSubscriber,
  addDays,
  brDate,
  listNames,
  dayCounts,
  initials,
} from '../../public/demos/sistemas/barbearia/js/rules.js';

const ctx = { ...data, queue: data.queue };
const nbsp = (text) => text.replace(/ /g, ' ');

test('formata dinheiro e horários', () => {
  assert.equal(money(636), nbsp('R$ 636,00'));
  assert.equal(toMinutes('15:10'), 910);
  assert.equal(toTime(935), '15:35');
  assert.equal(roundUp(912), 915);
  assert.equal(roundUp(915), 915);
});

test('o fim do atendimento vem da duração do serviço', () => {
  assert.equal(endOf({ start: '14:50', service: 'pigmentacao' }, data.services), toMinutes('15:35'));
});

test('o estado do atendimento depende da hora atual', () => {
  const at = (id) => statusAt(data.appointments.find((item) => item.id === id), data.services, data.now);
  assert.equal(at('t6'), 'concluido');
  assert.equal(at('t7'), 'atendendo');
  assert.equal(at('r7'), 'atendendo');
  assert.equal(at('t8'), 'agendado');
  assert.deepEqual(dayCounts(data.appointments, data.services, data.now), { total: 29, done: 19, inChair: 2, upcoming: 8 });
});

test('nenhum barbeiro tem dois atendimentos ao mesmo tempo nem durante a pausa', () => {
  data.barbers.forEach((barber) => {
    const busy = busyIntervals(barber, data.appointments, data.services);
    busy.forEach((slot, index) => {
      if (index === 0) return;
      assert.ok(busy[index - 1].end <= slot.start, `${barber.id} ${toTime(slot.start)}`);
    });
    busy.forEach((slot) => {
      assert.ok(slot.start >= toMinutes(data.openTime) && slot.end <= toMinutes(data.closeTime), barber.id);
    });
  });
});

test('procura o primeiro intervalo livre que cabe o serviço', () => {
  const busy = [
    { start: 600, end: 640 },
    { start: 650, end: 700 },
  ];
  assert.equal(nextSlot(busy, 30, 600, 740), 700);
  assert.equal(nextSlot(busy, 30, 600, 720), null);
  assert.equal(nextSlot(busy, 10, 600, 720), 640);
  assert.equal(nextSlot(busy, 30, 600, 710), null);
  assert.equal(nextSlot([], 30, 603, 720), 605);
});

test('a fila de encaixe usa a primeira cadeira livre e reserva o horário', () => {
  const planned = planQueue(ctx);
  assert.deepEqual(
    planned.map((item) => [item.name, item.barber, item.start, item.wait]),
    [
      ['Caio', 'tonho', '15:35', 25],
      ['Henrique', 'rafa', '16:00', 50],
      ['Otávio', 'leo', '15:10', 0],
    ],
  );
});

test('o encaixe não invade a pausa nem outro atendimento', () => {
  const planned = planQueue(ctx);
  const added = planned.filter((item) => item.barber).map((item) => fitWalkIn(planned, item.id));
  const all = [...data.appointments, ...added];
  data.barbers.forEach((barber) => {
    const busy = busyIntervals(barber, all, data.services);
    busy.forEach((slot, index) => {
      if (index > 0) assert.ok(busy[index - 1].end <= slot.start, `${barber.id} ${toTime(slot.start)}`);
    });
  });
  assert.equal(fitWalkIn(planned, 'inexistente'), null);
  assert.equal(fitWalkIn([{ id: 'x', barber: null }], 'x'), null);
});

test('descreve a espera', () => {
  assert.equal(waitLabel(0), 'Atende agora');
  assert.equal(waitLabel(25), 'Espera de 25 min');
  assert.equal(waitLabel(60), 'Espera de 1h');
  assert.equal(waitLabel(75), 'Espera de 1h15');
  assert.equal(waitLabel(null), 'Sem vaga hoje');
});

test('acha o próximo horário livre do dia', () => {
  assert.deepEqual(earliestSlot(ctx, 30), { barber: 'tonho', start: toMinutes('15:35') });
  assert.equal(earliestSlot({ ...ctx, now: '19:45' }, 30), null);
});

test('comissão separa serviço, clube e produtos', () => {
  const totals = dayTotals({ ...ctx, products: data.products });
  const tonho = totals.find((row) => row.barber === 'tonho');
  assert.equal(tonho.done, 6);
  assert.equal(tonho.club, 2);
  assert.equal(tonho.servicesTotal, 220);
  assert.equal(tonho.commission, 146.7);
  const summary = cashSummary(totals);
  assert.equal(summary.revenue, 636);
  assert.equal(summary.done, 19);
  assert.equal(summary.commission, 357.1);
  assert.equal(Math.round(summary.ticket * 100) / 100, 39.58);
});

test('o faturamento fecha com as formas de pagamento', () => {
  const payments = paymentsBreakdown(ctx);
  assert.deepEqual(payments, { pix: 239, cartao: 237, dinheiro: 160 });
  assert.equal(Object.values(payments).reduce((sum, value) => sum + value, 0), cashSummary(dayTotals(ctx)).revenue);
});

test('situação da assinatura pela data de renovação', () => {
  const at = (renewal) => subscriptionStatus({ renewal }, '2026-10-14');
  assert.deepEqual([at('2026-10-14').key, at('2026-10-14').label], ['vencendo', 'Vence hoje']);
  assert.equal(at('2026-10-15').label, 'Vence em 1 dia');
  assert.equal(at('2026-10-19').label, 'Vence em 5 dias');
  assert.equal(at('2026-10-20').key, 'em-dia');
  assert.deepEqual([at('2026-10-13').key, at('2026-10-13').label], ['atrasado', 'Atrasado há 1 dia']);
  assert.equal(at('2026-10-08').label, 'Atrasado há 6 dias');
});

test('assinantes ordenados do mais urgente ao mais folgado', () => {
  const list = filterSubscribers(data.subscribers, 'todos', data.today);
  assert.deepEqual(
    list.slice(0, 5).map((item) => item.name),
    ['Igor C.', 'Rodrigo B.', 'Marcos T.', 'Bruno L.', 'Caetano J.'],
  );
  assert.deepEqual(
    filterSubscribers(data.subscribers, 'atrasado', data.today).map((item) => item.name),
    ['Igor C.', 'Rodrigo B.'],
  );
  assert.equal(filterSubscribers(data.subscribers, 'vencendo', data.today).length, 3);
});

test('resume o clube em receita, vencimentos e atrasos', () => {
  assert.deepEqual(clubSummary(data.subscribers, data.plans, data.today), {
    active: 10,
    monthly: 1090,
    dueSoon: 3,
    late: 2,
    lateValue: 258,
  });
});

test('registrar pagamento renova a assinatura e zera os usos', () => {
  const late = data.subscribers.find((item) => item.id === 's3');
  const renewed = renewSubscriber(late, data.today);
  assert.equal(renewed.renewal, '2026-11-13');
  assert.equal(renewed.uses, 0);
  assert.equal(subscriptionStatus(renewed, data.today).key, 'em-dia');
  const early = data.subscribers.find((item) => item.id === 's2');
  assert.equal(renewSubscriber(early, data.today).renewal, '2026-11-15');
  assert.equal(late.renewal, '2026-10-10');
});

test('datas e textos auxiliares', () => {
  assert.equal(addDays('2026-10-31', 1), '2026-11-01');
  assert.equal(brDate('2026-10-14'), '14/10/2026');
  assert.equal(listNames(['Rafa', 'Léo']), 'Rafa e Léo');
  assert.equal(listNames(['Tonho', 'Rafa', 'Léo']), 'Tonho, Rafa e Léo');
  assert.equal(listNames([]), '');
  assert.equal(initials('Marcos T.'), 'MT');
});
