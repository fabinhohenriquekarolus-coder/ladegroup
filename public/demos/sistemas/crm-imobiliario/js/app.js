import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { stages, properties, tones, leads as seed } from './data.js';
import {
  shortMoney,
  closingChance,
  funnelStats,
  stageTotal,
  nextStep,
  suggestedMessage,
  leadSummary,
  autoReply,
  moveToStage,
} from './rules.js';
import { facade, heat, gauge, ring } from './view.js';

const board = document.querySelector('#board');
const stats = document.querySelector('#stats');
const drawer = document.querySelector('#drawer');
const scrim = document.querySelector('#scrim');
const background = document.querySelector('#app');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const stageName = Object.fromEntries(stages.map((stage) => [stage.id, stage.name]));

const tabLabels = { assistente: 'Assistente', imoveis: 'Imóveis', conversa: 'Conversa', historico: 'Linha do tempo' };

const state = {
  leads: seed.map((lead) => structuredClone(lead)),
  openId: null,
  tab: 'assistente',
  ai: {},
};

let dragId = null;
let lastOpener = null;

const find = (id) => state.leads.find((lead) => lead.id === id);

const replaceLead = (next) => {
  state.leads = state.leads.map((lead) => (lead.id === next.id ? next : lead));
};

const card = (lead) => html`<li><article class="lead" draggable="true" data-id="${lead.id}">
    <div class="lead-art">${facade(properties[lead.matches[0][0]], tones)}</div>
    <button type="button" class="lead-open" data-open="${lead.id}">
      <span class="lead-name">${lead.name}</span>
      <span class="lead-want">${lead.want}</span>
      <span class="lead-area">${lead.area}</span>
      <span class="lead-foot"><strong class="lead-price">${lead.budget}</strong>${heat(lead.heat)}</span>
    </button>
  </article></li>`;

const renderStats = () => {
  const summary = funnelStats(state.leads);
  const items = [
    ['Contatos ativos', String(summary.active)],
    ['Em negociação', shortMoney(summary.negotiating)],
    ['Conversão do funil', `${summary.conversion}%`],
  ];
  stats.innerHTML = html`${items.map(
    ([label, value]) => html`<div class="stat"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong></div>`,
  )}`;
};

const renderBoard = () => {
  board.innerHTML = html`${stages.map((stage) => {
    const items = state.leads.filter((lead) => lead.stage === stage.id);
    return html`<section class="col" data-stage="${stage.id}" aria-labelledby="col-${stage.id}">
      <header class="col-head"><h2 id="col-${stage.id}">${stage.name}</h2><span class="col-count">${items.length}<span class="sr-only"> contatos</span></span><span class="col-total">${shortMoney(stageTotal(state.leads, stage.id))}</span></header>
      <ul class="col-list">${items.length ? items.map(card) : html`<li class="col-empty">Arraste um contato para cá</li>`}</ul>
    </section>`;
  })}`;
  renderStats();
};

const assistantPanel = (lead) => {
  const status = state.ai[lead.id] ?? 'idle';
  if (status === 'idle') {
    return html`<div class="ai-intro"><span class="ai-tag">Assistente, exemplo simulado</span>
      <p>Leio o histórico, as conversas e os interesses do contato para sugerir o próximo passo e uma mensagem.</p>
      <button type="button" class="mor-btn" data-ai>Gerar leitura do contato</button></div>`;
  }
  if (status === 'loading') {
    return html`<div class="ai-intro"><span class="ai-tag">Assistente, exemplo simulado</span>
      <div class="skeleton" aria-hidden="true"><i></i><i></i><i></i></div><p class="sr-only" role="status">Lendo o histórico do contato</p></div>`;
  }
  return html`<div class="ai-result"><span class="ai-tag">Assistente, exemplo simulado</span>
    <section><h3>Leitura do contato</h3><p class="ai-summary" id="ai-summary"></p></section>
    <section class="ai-grid">
      <div><h3>Chance estimada</h3>${gauge(closingChance(lead))}</div>
      <div><h3>Próximo passo</h3><p class="ai-next">${nextStep(lead)}</p></div>
    </section>
    <section><h3><label for="ai-message">Mensagem sugerida</label></h3>
      <textarea id="ai-message" rows="3">${suggestedMessage(lead)}</textarea>
      <button type="button" class="mor-btn" data-send-ai>Enviar pela conversa</button></section></div>`;
};

const propertiesPanel = (lead) =>
  html`<ul class="props">${lead.matches.map(([id, score]) => {
    const property = properties[id];
    return html`<li class="prop"><div class="prop-art">${facade(property, tones)}</div>
      <div class="prop-body"><strong>${property.title}</strong><span>${property.detail}</span><span>${property.area}</span><em>${property.price}</em></div>${ring(score)}</li>`;
  })}</ul>`;

const chatPanel = (lead) =>
  html`<div class="chat"><ol class="thread" id="thread" aria-label="Conversa com ${lead.name}">${lead.thread.map(
    (message) => html`<li class="bubble ${message.from === 'agent' ? 'is-agent' : 'is-lead'}"><p>${message.text}</p><time>${message.time}</time></li>`,
  )}</ol>
    <form class="composer" id="composer"><label class="sr-only" for="chat-input">Mensagem</label>
      <input id="chat-input" autocomplete="off" maxlength="400" placeholder="Escreva uma mensagem" /><button type="submit" class="mor-btn">Enviar</button></form></div>`;

const timelinePanel = (lead) =>
  html`<ol class="timeline">${lead.timeline.map((entry) => html`<li><time>${entry.when}</time><p>${entry.text}</p></li>`)}</ol>`;

const panels = { assistente: assistantPanel, imoveis: propertiesPanel, conversa: chatPanel, historico: timelinePanel };

const typeInto = (element, text) => {
  if (reduceMotion) {
    element.textContent = text;
    return;
  }
  let index = 0;
  const timer = setInterval(() => {
    index += 2;
    element.textContent = text.slice(0, index);
    if (index >= text.length) clearInterval(timer);
  }, 16);
};

const renderPanel = () => {
  const lead = find(state.openId);
  const panel = drawer.querySelector('#panel');
  panel.innerHTML = panels[state.tab](lead);
  panel.setAttribute('aria-labelledby', `tab-${state.tab}`);
  drawer.querySelectorAll('[role="tab"]').forEach((tab) => {
    const active = tab.dataset.tab === state.tab;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  if (state.tab === 'assistente' && state.ai[lead.id] === 'ready') typeInto(panel.querySelector('#ai-summary'), leadSummary(lead));
  if (state.tab === 'conversa') panel.querySelector('#thread').scrollTop = panel.querySelector('#thread').scrollHeight;
};

const renderDrawer = () => {
  const lead = find(state.openId);
  drawer.innerHTML = html`<header class="drawer-head">
      <div class="avatar" aria-hidden="true">${lead.initials}</div>
      <div class="drawer-who"><h2 id="drawer-title">${lead.name}</h2><p>${lead.want}, ${lead.area}</p></div>
      <button type="button" class="drawer-close" data-close aria-label="Fechar detalhes">×</button>
    </header>
    <div class="drawer-meta">
      <label>Etapa<select data-stage>${stages.map((stage) => html`<option value="${stage.id}" ${stage.id === lead.stage ? 'selected' : ''}>${stage.name}</option>`)}</select></label>
      <span>Orçamento<strong>${lead.budget}</strong></span>
      <span>Origem<strong>${lead.origin}</strong></span>
    </div>
    <div class="tabs" role="tablist" aria-label="Detalhes do contato">${Object.entries(tabLabels).map(
      ([id, label]) => html`<button type="button" role="tab" id="tab-${id}" data-tab="${id}" aria-controls="panel" aria-selected="false">${label}</button>`,
    )}</div>
    <div class="panel" id="panel" role="tabpanel" tabindex="0"></div>`;
  renderPanel();
};

const moveLead = (id, stage) => {
  const lead = find(id);
  if (!lead || lead.stage === stage) return;
  replaceLead(moveToStage(lead, stage, stageName[stage]));
  renderBoard();
  if (state.openId === id) renderDrawer();
  showToast(`${lead.name} foi para ${stageName[stage]}.`);
};

const openDrawer = (id, opener) => {
  state.openId = id;
  state.tab = 'assistente';
  lastOpener = opener;
  renderDrawer();
  drawer.hidden = false;
  scrim.hidden = false;
  background.inert = true;
  requestAnimationFrame(() => drawer.classList.add('is-open'));
  drawer.querySelector('[data-close]').focus();
};

const closeDrawer = () => {
  drawer.classList.remove('is-open');
  drawer.hidden = true;
  scrim.hidden = true;
  background.inert = false;
  state.openId = null;
  if (lastOpener && document.contains(lastOpener)) lastOpener.focus();
  else board.querySelector('[data-open]')?.focus();
};

const sendMessage = (id, text) => {
  const lead = find(id);
  replaceLead({
    ...lead,
    thread: [...lead.thread, { from: 'agent', text, time: 'agora' }],
    timeline: [{ when: 'agora', text: 'Mensagem enviada pelo WhatsApp' }, ...lead.timeline],
  });
  state.tab = 'conversa';
  renderPanel();
  drawer.querySelector('#chat-input')?.focus();
  setTimeout(() => {
    const current = find(id);
    replaceLead({ ...current, thread: [...current.thread, { from: 'lead', text: autoReply(current), time: 'agora' }] });
    if (state.openId === id && state.tab === 'conversa') renderPanel();
  }, 1500);
};

board.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-open]');
  if (opener) openDrawer(opener.dataset.open, opener);
});

board.addEventListener('dragstart', (event) => {
  const lead = event.target.closest('.lead');
  if (!lead) return;
  dragId = lead.dataset.id;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', dragId);
  lead.classList.add('is-dragging');
});

board.addEventListener('dragend', () => {
  dragId = null;
  board.querySelectorAll('.is-dragging, .is-over').forEach((element) => element.classList.remove('is-dragging', 'is-over'));
});

board.addEventListener('dragover', (event) => {
  const column = event.target.closest('.col');
  if (!column || !dragId) return;
  event.preventDefault();
  board.querySelectorAll('.is-over').forEach((element) => element !== column && element.classList.remove('is-over'));
  column.classList.add('is-over');
});

board.addEventListener('drop', (event) => {
  const column = event.target.closest('.col');
  if (!column || !dragId) return;
  event.preventDefault();
  moveLead(dragId, column.dataset.stage);
});

scrim.addEventListener('click', closeDrawer);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.openId) closeDrawer();
});

drawer.addEventListener('keydown', (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (!tab) return;
  const ids = Object.keys(tabLabels);
  const index = ids.indexOf(tab.dataset.tab);
  const moves = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: ids.length - 1 };
  if (!(event.key in moves)) return;
  event.preventDefault();
  state.tab = ids[(moves[event.key] + ids.length) % ids.length];
  renderPanel();
  drawer.querySelector(`#tab-${state.tab}`).focus();
});

drawer.addEventListener('click', (event) => {
  const lead = find(state.openId);
  if (!lead) return;
  if (event.target.closest('[data-close]')) {
    closeDrawer();
    return;
  }
  const tab = event.target.closest('[data-tab]');
  if (tab) {
    state.tab = tab.dataset.tab;
    renderPanel();
    return;
  }
  if (event.target.closest('[data-ai]')) {
    state.ai[lead.id] = reduceMotion ? 'ready' : 'loading';
    renderPanel();
    drawer.querySelector('#panel').focus();
    if (!reduceMotion) {
      setTimeout(() => {
        state.ai[lead.id] = 'ready';
        if (state.openId === lead.id && state.tab === 'assistente') renderPanel();
      }, 900);
    }
    return;
  }
  if (event.target.closest('[data-send-ai]')) {
    const text = drawer.querySelector('#ai-message').value.trim();
    if (text) sendMessage(lead.id, text);
  }
});

drawer.addEventListener('change', (event) => {
  if (event.target.matches('[data-stage]')) moveLead(state.openId, event.target.value);
});

drawer.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = drawer.querySelector('#chat-input');
  const text = input.value.trim();
  if (text) sendMessage(state.openId, text);
});

renderBoard();
