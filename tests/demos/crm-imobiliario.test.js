import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leads } from '../../public/demos/sistemas/crm-imobiliario/js/data.js';
import {
  firstName,
  shortMoney,
  closingChance,
  funnelStats,
  stageTotal,
  nextStep,
  suggestedMessage,
  leadSummary,
  autoReply,
  moveToStage,
} from '../../public/demos/sistemas/crm-imobiliario/js/rules.js';

const lead = (overrides) => ({ ...leads[0], ...overrides });

test('formata valores curtos em mil e milhão', () => {
  assert.equal(shortMoney(480000), 'R$ 480 mil');
  assert.equal(shortMoney(3200000), 'R$ 3,2 mi');
  assert.equal(shortMoney(1000000), 'R$ 1,0 mi');
});

test('chance de fechar cresce com a etapa e o interesse, com teto de 100', () => {
  assert.equal(closingChance(lead({ stage: 'novo', heat: 1 })), 23);
  assert.equal(closingChance(lead({ stage: 'proposta', heat: 3 })), 83);
  assert.equal(closingChance(lead({ stage: 'fechado', heat: 3 })), 100);
});

test('resume o funil com ativos, negociação e conversão', () => {
  const summary = funnelStats(leads);
  const closed = leads.filter((item) => item.stage === 'fechado').length;
  assert.equal(summary.active, leads.length - closed);
  assert.equal(summary.conversion, Math.round((closed / leads.length) * 100));
  assert.equal(summary.negotiating, stageTotal(leads, 'visita') + stageTotal(leads, 'proposta'));
  assert.deepEqual(funnelStats([]), { active: 0, negotiating: 0, conversion: 0 });
});

test('sugere próximo passo e mensagem conforme a etapa', () => {
  assert.match(nextStep(lead({ stage: 'visita' })), /Confirmar a visita/);
  assert.match(nextStep(lead({ stage: 'novo', heat: 3 })), /Ligar ainda hoje/);
  assert.match(suggestedMessage(lead({ stage: 'proposta' })), /novidades sobre a sua proposta/);
  assert.match(suggestedMessage(lead({ stage: 'novo', matches: [['p1', 90]] })), /1 imóvel que combina/);
});

test('monta o resumo do contato com o primeiro nome', () => {
  const sample = lead({ name: 'Helena Rocha', want: 'Apartamento de 2 quartos' });
  assert.equal(firstName('  Helena   Rocha '), 'Helena');
  assert.match(leadSummary(sample), /^Helena busca apartamento de 2 quartos/);
});

test('resposta automática depende da etapa', () => {
  assert.match(autoReply(lead({ stage: 'visita' })), /estarei lá/);
  assert.match(autoReply(lead({ stage: 'novo' })), /Obrigado/);
});

test('mover de etapa não altera o contato original e registra na linha do tempo', () => {
  const original = lead({ stage: 'novo' });
  const moved = moveToStage(original, 'visita', 'Visita marcada');
  assert.equal(original.stage, 'novo');
  assert.equal(moved.stage, 'visita');
  assert.equal(moved.timeline[0].text, 'Movido para Visita marcada');
  assert.equal(moved.timeline.length, original.timeline.length + 1);
  assert.equal(moveToStage(original, 'novo', 'Novos contatos'), original);
});
