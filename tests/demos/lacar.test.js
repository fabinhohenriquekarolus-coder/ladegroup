import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as data from '../../public/demos/lacar/js/data.js';
import {
  money,
  addDays,
  weekday,
  dayTitle,
  weekTitle,
  durationLabel,
  serviceById,
  priceFor,
  endOf,
  appointmentsOn,
  assignLanes,
  daySummary,
  upcomingCount,
  needsFollowUp,
  visitsLabel,
  filterClients,
  periodRange,
  cashSummary,
  dailySeries,
  peakDay,
  recentMovements,
  groupByDate,
  ladinhoAnswer,
} from '../../public/demos/lacar/js/rules.js';

const nbsp = (text) => text.replace(/ /g, ' ');

test('formata dinheiro em reais', () => {
  assert.equal(money(1705), nbsp('R$ 1.705,00'));
  assert.equal(money(96.842), nbsp('R$ 96,84'));
});

test('anda pelo calendário sem depender do fuso', () => {
  assert.equal(addDays('2026-10-14', -29), '2026-09-15');
  assert.equal(addDays('2026-09-30', 1), '2026-10-01');
  assert.equal(weekday('2026-10-14'), 3);
  assert.equal(dayTitle('2026-10-12'), 'Segunda, 12 de outubro');
  assert.equal(weekTitle(data.weekDays), '12 a 17 de outubro');
});

test('mostra a duração do serviço', () => {
  assert.equal(durationLabel(40), '40 min');
  assert.equal(durationLabel(60), '1h');
  assert.equal(durationLabel(90), '1h30');
});

test('preço depende do porte e pode não existir', () => {
  const completa = serviceById(data.services, 'completa');
  assert.equal(priceFor(completa, 'suv'), 90);
  assert.equal(priceFor(serviceById(data.services, 'higienizacao'), 'moto'), null);
});

test('calcula o fim pelo tempo do serviço', () => {
  assert.equal(endOf({ start: '08:30', service: 'polimento' }, data.services), 750);
});

test('nenhum dia passa da capacidade de carros ao mesmo tempo', () => {
  data.weekDays.forEach((date) => {
    const placed = assignLanes(appointmentsOn(data.appointments, date), data.services);
    placed.forEach((item) => {
      assert.ok(item.lanes <= data.capacity, `${date} ${item.id}`);
      assert.ok(item.startMin >= data.openHour * 60 && item.endMin <= data.closeHour * 60, item.id);
    });
  });
});

test('cancelado não ocupa vaga na agenda', () => {
  const placed = assignLanes(appointmentsOn(data.appointments, '2026-10-13'), data.services);
  assert.equal(placed.some((item) => item.status === 'cancelado'), false);
});

test('resume o dia da agenda', () => {
  assert.equal(daySummary(appointmentsOn(data.appointments, '2026-10-14')), '6 atendimentos, 3 concluídos');
  assert.equal(daySummary(appointmentsOn(data.appointments, '2026-10-13')), '5 atendimentos, todos concluídos');
  assert.equal(daySummary(appointmentsOn(data.appointments, '2026-10-17')), '4 atendimentos');
  assert.equal(daySummary([]), 'Nenhum atendimento');
});

test('o caixa dos dias da semana bate com os atendimentos concluídos', () => {
  ['2026-10-12', '2026-10-13', '2026-10-14'].forEach((date) => {
    const done = data.appointments.filter((item) => item.date === date && item.status === 'concluido');
    const income = done.reduce((total, item) => total + priceFor(serviceById(data.services, item.service), item.porte), 0);
    const day = data.cashDays.find((item) => item.date === date);
    assert.equal(day.income, income, date);
    assert.equal(day.visits, done.length, date);
  });
});

test('os números do mês batem com o resumo por serviço e por horário', () => {
  const month = cashSummary(data.cashDays, data.expenses, periodRange('mes', data.today));
  assert.equal(month.income, data.monthByService.reduce((total, item) => total + item.revenue, 0));
  assert.equal(month.visits, data.monthByService.reduce((total, item) => total + item.count, 0));
  assert.equal(month.visits, data.monthByHour.reduce((total, item) => total + item.count, 0));
});

test('monta os períodos do fluxo de caixa', () => {
  assert.deepEqual(periodRange('7', data.today), { start: '2026-10-08', end: '2026-10-14' });
  assert.deepEqual(periodRange('30', data.today), { start: '2026-09-15', end: '2026-10-14' });
  assert.deepEqual(periodRange('mes', data.today), { start: '2026-10-01', end: '2026-10-14' });
});

test('soma entradas, saídas e ticket médio do período', () => {
  const summary = cashSummary(data.cashDays, data.expenses, periodRange('mes', data.today));
  assert.equal(summary.income, 11040);
  assert.equal(summary.spent, 3200);
  assert.equal(summary.balance, 7840);
  assert.equal(summary.visits, 114);
  assert.equal(Math.round(summary.ticket * 100) / 100, 96.84);
});

test('a série diária cobre cada dia, inclusive os fechados', () => {
  const series = dailySeries(data.cashDays, data.expenses, periodRange('7', data.today));
  assert.equal(series.length, 7);
  assert.equal(series.find((day) => day.date === '2026-10-11').income, 0);
  assert.equal(series.find((day) => day.date === '2026-10-08').spent, 250);
  assert.equal(peakDay(series).date, '2026-10-10');
});

test('movimentações recentes vêm da agenda e das saídas', () => {
  const moves = recentMovements(data.appointments, data.expenses, data.services, data.clients, data.today);
  assert.equal(moves.length, 8);
  assert.equal(moves[0].label, 'Higienização interna');
  assert.equal(moves.find((move) => move.kind === 'saida').label, 'Cera e pretinho');
  assert.deepEqual(
    groupByDate(moves).map((group) => group.date),
    ['2026-10-14', '2026-10-13'],
  );
});

test('clientes sem voltar há mais de 30 dias entram em acompanhamento', () => {
  const late = filterClients(data.clients, { view: 'acompanhamento' }, data.today);
  assert.deepEqual(
    late.map((client) => client.name),
    ['Fernanda Alves', 'Gustavo Ribeiro'],
  );
  assert.equal(needsFollowUp({ lastVisit: null }, data.today), false);
});

test('busca de clientes ignora acento e maiúscula', () => {
  const found = filterClients(data.clients, { term: 'patricia' }, data.today);
  assert.deepEqual(
    found.map((client) => client.name),
    ['Patrícia Lima'],
  );
  assert.equal(filterClients(data.clients, { term: 'zzz' }, data.today).length, 0);
});

test('descreve visitas do cliente', () => {
  assert.equal(visitsLabel({ visits: 7, lastVisit: '2026-10-14' }, data.today), '7 visitas, última hoje');
  assert.equal(visitsLabel({ visits: 1, lastVisit: '2026-10-13' }, data.today), '1 visita, última ontem');
  assert.equal(visitsLabel({ visits: 0, lastVisit: null }, data.today), 'Ainda sem atendimento concluído');
});

test('o Ladinho responde com os números do painel', () => {
  assert.equal(upcomingCount(data.appointments, data.today), 16);
  assert.ok(ladinhoAnswer('semana', data).includes(`${nbsp('R$ 1.705,00')} em 14 atendimentos`));
  assert.match(ladinhoAnswer('gasto', data), /aluguel: R\$\s1\.800,00, 56%/);
  assert.match(ladinhoAnswer('servico', data), /lavagem simples lidera com 52.*lavagem completa: R\$\s3\.480,00/);
  assert.match(ladinhoAnswer('pico', data), /às 10h, com 21.*14h, com 17/);
});
