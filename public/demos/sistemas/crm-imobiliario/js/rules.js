export const baseChance = { novo: 18, visita: 42, proposta: 68, fechado: 100 };

export const firstName = (name) => name.trim().split(/\s+/)[0];

export const shortMoney = (value) =>
  value >= 1e6 ? `R$ ${(value / 1e6).toFixed(1).replace('.', ',')} mi` : `R$ ${Math.round(value / 1e3)} mil`;

export const closingChance = (lead) =>
  lead.stage === 'fechado' ? 100 : Math.min(100, baseChance[lead.stage] + lead.heat * 5);

export const funnelStats = (leads) => {
  const closed = leads.filter((lead) => lead.stage === 'fechado').length;
  return {
    active: leads.length - closed,
    negotiating: leads
      .filter((lead) => lead.stage === 'visita' || lead.stage === 'proposta')
      .reduce((sum, lead) => sum + lead.budgetValue, 0),
    conversion: leads.length ? Math.round((closed / leads.length) * 100) : 0,
  };
};

export const stageTotal = (leads, stage) =>
  leads.filter((lead) => lead.stage === stage).reduce((sum, lead) => sum + lead.budgetValue, 0);

export const nextStep = (lead) => {
  if (lead.stage === 'visita') return 'Confirmar a visita um dia antes e preparar o comparativo com imóveis parecidos.';
  if (lead.stage === 'proposta') return 'Alinhar a contraproposta com o proprietário e dar um retorno em até 24 horas.';
  if (lead.stage === 'fechado') return 'Registrar o fechamento, pedir uma avaliação e a indicação de um conhecido.';
  if (lead.heat === 3) return 'Ligar ainda hoje e propor uma visita nos próximos dois dias.';
  if (lead.heat === 2) return 'Enviar três opções com fotos e perguntar o melhor horário para conversar.';
  return 'Manter no acompanhamento e retomar em uma semana, com novidades da região.';
};

export const suggestedMessage = (lead) => {
  const name = firstName(lead.name);
  if (lead.stage === 'visita') return `Olá, ${name}! Passando para confirmar a nossa visita. Se precisar remarcar, é só me avisar.`;
  if (lead.stage === 'proposta') return `Olá, ${name}! Tenho novidades sobre a sua proposta. Podemos conversar ainda hoje?`;
  if (lead.stage === 'fechado') return `Olá, ${name}! Parabéns pela conquista. Se algum conhecido estiver procurando imóvel, será um prazer atender.`;
  const count = lead.matches.length;
  return `Olá, ${name}! Separei ${count} ${count === 1 ? 'imóvel que combina' : 'imóveis que combinam'} com o que você procura. Posso enviar as fotos e combinar uma visita?`;
};

export const leadSummary = (lead) =>
  `${firstName(lead.name)} busca ${lead.want.toLowerCase()} no ${lead.area}, com orçamento perto de ${lead.budget}. ${lead.note} O último contato foi ${lead.last}.`;

export const autoReply = (lead) => {
  if (lead.stage === 'proposta') return 'Recebi. Vou conversar com minha família e te respondo.';
  if (lead.stage === 'visita') return 'Combinado, estarei lá no horário.';
  return 'Obrigado! Vou olhar com calma e já te respondo.';
};

export const moveToStage = (lead, stage, stageName) => {
  if (lead.stage === stage) return lead;
  return {
    ...lead,
    stage,
    timeline: [{ when: 'agora', text: `Movido para ${stageName}` }, ...lead.timeline],
  };
};
