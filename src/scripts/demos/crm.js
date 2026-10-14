import { leads, properties, stages, heatClass } from '../../data/demos/crm.js';

const detail = document.querySelector('#crm-detail');
const cards = document.querySelectorAll('.crm-lead');
const byId = Object.fromEntries(leads.map((lead) => [lead.id, lead]));
const stageName = Object.fromEntries(stages.map((stage) => [stage.id, stage.name]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const aiState = new Map();

let selected = null;
let timer;

const firstName = (lead) => lead.name.split(' ')[0];

const nextStep = (lead) => {
  if (lead.stage === 'visita') return 'Confirmar a visita um dia antes e preparar o comparativo com imóveis parecidos.';
  if (lead.stage === 'proposta') return 'Alinhar a contraproposta com o proprietário e dar um retorno em até 24 horas.';
  if (lead.stage === 'fechado') return 'Registrar o fechamento e pedir a indicação de um conhecido.';
  if (lead.heat === 'quente') return 'Ligar ainda hoje e propor uma visita nos próximos dois dias.';
  if (lead.heat === 'morno') return 'Enviar três opções com fotos e perguntar o melhor horário para conversar.';
  return 'Manter no acompanhamento e retomar o contato em uma semana, com novidades da região.';
};

const message = (lead) =>
  lead.stage === 'fechado'
    ? `Olá, ${firstName(lead)}! Parabéns pela conquista. Se algum conhecido estiver procurando imóvel, será um prazer atender.`
    : `Olá, ${firstName(lead)}! Separei ${lead.matches.length} ${lead.matches.length === 1 ? 'imóvel que combina' : 'imóveis que combinam'} com o que você procura. Posso enviar as fotos e combinar uma visita?`;

const summary = (lead) =>
  `${firstName(lead)} busca ${lead.want.toLowerCase()} no ${lead.area}, com orçamento em torno de ${lead.budget}. Chegou por ${lead.origin.toLowerCase()} e o último contato foi ${lead.last}. ${lead.note}`;

const matchesList = (lead) =>
  lead.matches
    .map(([id, score]) => {
      const property = properties[id];
      return `<li class="crm-match">
        <div class="crm-match-top"><strong>${property.title}</strong><span>${score}%</span></div>
        <div class="crm-match-sub">${property.area} · ${property.price}</div>
        <div class="crm-bar" role="img" aria-label="Compatibilidade de ${score}%"><span style="width:${score}%"></span></div>
      </li>`;
    })
    .join('');

const aiBlock = (lead) => {
  const state = aiState.get(lead.id) ?? 'idle';
  if (state === 'loading') {
    return '<p class="crm-loading">Analisando o histórico do lead...</p>';
  }
  if (state === 'ready') {
    return `<div class="crm-ai-section"><h4>Resumo</h4><p>${summary(lead)}</p></div>
      <div class="crm-ai-section"><h4>Próximo passo sugerido</h4><p>${nextStep(lead)}</p></div>
      <div class="crm-ai-section"><h4>Imóveis compatíveis</h4><ul class="crm-matches">${matchesList(lead)}</ul></div>
      <div class="crm-ai-section"><h4>Mensagem sugerida</h4><p class="crm-message">${message(lead)}</p>
      <button type="button" class="app-btn" data-demo-action="Na versão real, a mensagem seria enviada pelo WhatsApp do corretor.">Enviar pelo WhatsApp</button></div>`;
  }
  return `<p class="app-sub">Gere um resumo do lead, o próximo passo e os imóveis que mais combinam com o perfil.</p>
    <button type="button" class="app-btn is-primary" data-generate>Gerar resumo e próximo passo</button>`;
};

const render = (lead) => {
  const heat = heatClass[lead.heat];
  detail.innerHTML = `<div class="crm-detail-head">
      <div><h2 class="app-card-title">${lead.name}</h2><p class="app-sub">${lead.want} · ${lead.area}</p></div>
      <span class="app-badge ${heat}">${lead.heat}</span>
    </div>
    <dl class="crm-facts">
      <div><dt>Etapa</dt><dd>${stageName[lead.stage]}</dd></div>
      <div><dt>Orçamento</dt><dd>${lead.budget}</dd></div>
      <div><dt>Origem</dt><dd>${lead.origin}</dd></div>
      <div><dt>Último contato</dt><dd>${lead.last}</dd></div>
    </dl>
    <div class="crm-ai">
      <div class="app-card-title-row"><h3 class="app-card-title">Assistente de IA</h3><span class="app-sim">Simulação</span></div>
      ${aiBlock(lead)}
    </div>`;
};

const select = (id) => {
  selected = byId[id];
  cards.forEach((card) => {
    const active = card.dataset.lead === id;
    card.classList.toggle('is-selected', active);
    card.setAttribute('aria-pressed', String(active));
  });
  render(selected);
};

cards.forEach((card) => card.addEventListener('click', () => select(card.dataset.lead)));

detail.addEventListener('click', (event) => {
  if (!event.target.closest('[data-generate]') || !selected) return;
  const lead = selected;
  if (reduceMotion) {
    aiState.set(lead.id, 'ready');
    render(lead);
    return;
  }
  aiState.set(lead.id, 'loading');
  render(lead);
  clearTimeout(timer);
  timer = setTimeout(() => {
    aiState.set(lead.id, 'ready');
    if (selected === lead) render(lead);
  }, 900);
});

select(leads[0].id);
