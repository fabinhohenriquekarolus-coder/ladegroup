import { stages, properties, leads as seed, tones } from '../../data/demos/crm.js';

const board = document.querySelector('#board');
const stats = document.querySelector('#stats');
const drawer = document.querySelector('#drawer');
const scrim = document.querySelector('#scrim');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stageName = Object.fromEntries(stages.map((stage) => [stage.id, stage.name]));
const heatLabel = ['', 'baixo', 'médio', 'alto'];
const baseChance = { novo: 18, visita: 42, proposta: 68, fechado: 100 };

const state = { leads: seed.map((lead) => structuredClone(lead)), openId: null, tab: 'assistente', ai: {} };
let dragId = null;
let lastOpener = null;

const find = (id) => state.leads.find((lead) => lead.id === id);
const first = (lead) => lead.name.split(' ')[0];
const chance = (lead) => Math.min(100, baseChance[lead.stage] + (lead.stage === 'fechado' ? 0 : lead.heat * 5));
const short = (value) =>
  value >= 1e6 ? `R$ ${(value / 1e6).toFixed(1).replace('.', ',')} mi` : `R$ ${Math.round(value / 1e3)} mil`;
const toast = (message) => document.dispatchEvent(new CustomEvent('demo:toast', { detail: message }));

const facade = (property) => {
  const [sky, ground, wall, accent] = tones[property.tone];
  const windows = (x, y, cols, rows) =>
    Array.from({ length: cols * rows }, (_, i) => {
      const cx = x + (i % cols) * 16;
      const cy = y + Math.floor(i / cols) * 14;
      return `<rect x="${cx}" y="${cy}" width="9" height="8" fill="${sky}"/>`;
    }).join('');
  const shapes = {
    apto: `<rect x="66" y="14" width="68" height="76" fill="${wall}"/>${windows(74, 22, 4, 5)}<rect x="94" y="72" width="12" height="18" fill="${accent}"/>`,
    casa: `<polygon points="46,50 100,16 154,50" fill="${accent}"/><rect x="56" y="50" width="88" height="40" fill="${wall}"/><rect x="92" y="62" width="16" height="28" fill="${accent}"/><rect x="66" y="60" width="14" height="12" fill="${sky}"/><rect x="120" y="60" width="14" height="12" fill="${sky}"/>`,
    sala: `<rect x="36" y="42" width="128" height="48" fill="${wall}"/><rect x="46" y="52" width="108" height="24" fill="${sky}"/><rect x="36" y="38" width="128" height="6" fill="${accent}"/>`,
    cobertura: `<rect x="62" y="30" width="76" height="60" fill="${wall}"/>${windows(70, 46, 4, 3)}<rect x="56" y="22" width="88" height="8" fill="${accent}"/><rect x="72" y="12" width="56" height="10" fill="${wall}"/>`,
  };
  return `<svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="200" height="100" fill="${sky}"/><rect y="88" width="200" height="12" fill="${ground}"/>${shapes[property.type]}</svg>`;
};

const heat = (level) =>
  `<svg class="heat" viewBox="0 0 38 12" role="img" aria-label="Interesse ${heatLabel[level]}">${[0, 1, 2]
    .map(
      (i) =>
        `<path d="M${3 + i * 12} 10 L${9 + i * 12} 3 L${15 + i * 12} 10" fill="none" stroke="${i < level ? 'var(--brick)' : 'var(--line)'}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join('')}</svg>`;

const card = (lead) => `<li><article class="lead" draggable="true" data-id="${lead.id}">
    <div class="lead-art">${facade(properties[lead.matches[0][0]])}</div>
    <button type="button" class="lead-open" data-open="${lead.id}">
      <span class="lead-name">${lead.name}</span>
      <span class="lead-want">${lead.want}</span>
      <span class="lead-area">${lead.area}</span>
      <span class="lead-foot"><strong class="lead-price">${lead.budget}</strong>${heat(lead.heat)}</span>
    </button>
  </article></li>`;

const renderStats = () => {
  const active = state.leads.filter((lead) => lead.stage !== 'fechado').length;
  const negotiating = state.leads
    .filter((lead) => lead.stage === 'visita' || lead.stage === 'proposta')
    .reduce((sum, lead) => sum + lead.budgetValue, 0);
  const closed = state.leads.filter((lead) => lead.stage === 'fechado').length;
  const conversion = Math.round((closed / state.leads.length) * 100);
  stats.innerHTML = [
    ['Contatos ativos', String(active)],
    ['Em negociação', short(negotiating)],
    ['Conversão do funil', `${conversion}%`],
  ]
    .map(([label, value]) => `<div class="stat"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong></div>`)
    .join('');
};

const renderBoard = () => {
  board.innerHTML = stages
    .map((stage) => {
      const items = state.leads.filter((lead) => lead.stage === stage.id);
      const total = items.reduce((sum, lead) => sum + lead.budgetValue, 0);
      return `<section class="col" data-stage="${stage.id}" aria-label="${stage.name}">
        <header class="col-head"><h2>${stage.name}</h2><span class="col-count">${items.length}</span><span class="col-total">${short(total)}</span></header>
        <ul class="col-list">${items.map(card).join('') || '<li class="col-empty">Arraste um contato para cá</li>'}</ul>
      </section>`;
    })
    .join('');
  renderStats();
};

const moveLead = (id, stage) => {
  const lead = find(id);
  if (!lead || lead.stage === stage) return;
  lead.stage = stage;
  lead.timeline.unshift({ when: 'agora', text: `Movido para “${stageName[stage]}”` });
  renderBoard();
  if (state.openId === id) renderDrawer();
  toast(`${lead.name} movido para “${stageName[stage]}”.`);
};

const gauge = (value) => {
  const length = 157.08;
  return `<svg class="gauge" viewBox="0 0 120 74" role="img" aria-label="Chance estimada de fechar: ${value}%">
    <path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="var(--line)" stroke-width="10" stroke-linecap="round"/>
    <path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="var(--brass)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${(value / 100) * length} ${length}"/>
    <text x="60" y="58" text-anchor="middle" class="gauge-num">${value}%</text></svg>`;
};

const ring = (score) => {
  const length = 100.53;
  return `<svg class="ring" viewBox="0 0 40 40" role="img" aria-label="Compatibilidade de ${score}%">
    <circle cx="20" cy="20" r="16" fill="none" stroke="var(--line)" stroke-width="4"/>
    <circle cx="20" cy="20" r="16" fill="none" stroke="var(--pine-2)" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(score / 100) * length} ${length}" transform="rotate(-90 20 20)"/>
    <text x="20" y="24" text-anchor="middle" class="ring-num">${score}</text></svg>`;
};

const nextStep = (lead) => {
  if (lead.stage === 'visita') return 'Confirmar a visita um dia antes e preparar o comparativo com imóveis parecidos.';
  if (lead.stage === 'proposta') return 'Alinhar a contraproposta com o proprietário e dar um retorno em até 24 horas.';
  if (lead.stage === 'fechado') return 'Registrar o fechamento, pedir uma avaliação e a indicação de um conhecido.';
  if (lead.heat === 3) return 'Ligar ainda hoje e propor uma visita nos próximos dois dias.';
  if (lead.heat === 2) return 'Enviar três opções com fotos e perguntar o melhor horário para conversar.';
  return 'Manter no acompanhamento e retomar em uma semana, com novidades da região.';
};

const suggestion = (lead) => {
  if (lead.stage === 'visita') return `Olá, ${first(lead)}! Passando para confirmar a nossa visita. Se precisar remarcar, é só me avisar.`;
  if (lead.stage === 'proposta') return `Olá, ${first(lead)}! Tenho novidades sobre a sua proposta. Podemos conversar ainda hoje?`;
  if (lead.stage === 'fechado') return `Olá, ${first(lead)}! Parabéns pela conquista. Se algum conhecido estiver procurando imóvel, será um prazer atender.`;
  return `Olá, ${first(lead)}! Separei ${lead.matches.length} ${lead.matches.length === 1 ? 'imóvel que combina' : 'imóveis que combinam'} com o que você procura. Posso enviar as fotos e combinar uma visita?`;
};

const summary = (lead) =>
  `${first(lead)} busca ${lead.want.toLowerCase()} no ${lead.area}, com orçamento perto de ${lead.budget}. ${lead.note} O último contato foi ${lead.last}.`;

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

const assistantPanel = (lead) => {
  const status = state.ai[lead.id] ?? 'idle';
  if (status === 'idle') {
    return `<div class="ai-intro"><span class="ai-tag">Assistente · exemplo simulado</span>
      <p>Leio o histórico, as conversas e os interesses do contato para sugerir o próximo passo e uma mensagem.</p>
      <button type="button" class="cum-btn" data-ai>Gerar leitura do contato</button></div>`;
  }
  if (status === 'loading') {
    return `<div class="ai-intro"><span class="ai-tag">Assistente · exemplo simulado</span>
      <div class="skeleton" aria-hidden="true"><i></i><i></i><i></i></div><p class="sr-only" role="status">Lendo o histórico do contato</p></div>`;
  }
  return `<div class="ai-result"><span class="ai-tag">Assistente · exemplo simulado</span>
    <section><h3>Leitura do contato</h3><p class="ai-summary" id="ai-summary"></p></section>
    <section class="ai-grid">
      <div><h3>Chance estimada</h3>${gauge(chance(lead))}</div>
      <div><h3>Próximo passo</h3><p class="ai-next">${nextStep(lead)}</p></div>
    </section>
    <section><h3>Mensagem sugerida</h3>
      <label class="sr-only" for="ai-message">Mensagem sugerida</label>
      <textarea id="ai-message" rows="3">${suggestion(lead)}</textarea>
      <button type="button" class="cum-btn" data-send-ai>Enviar pela conversa</button></section></div>`;
};

const propertiesPanel = (lead) =>
  `<ul class="props">${lead.matches
    .map(([id, score]) => {
      const property = properties[id];
      return `<li class="prop"><div class="prop-art">${facade(property)}</div>
        <div class="prop-body"><strong>${property.title}</strong><span>${property.detail}</span><span>${property.area}</span><em>${property.price}</em></div>${ring(score)}</li>`;
    })
    .join('')}</ul>`;

const chatPanel = (lead) =>
  `<div class="chat"><ol class="thread" id="thread">${lead.thread
    .map((m) => `<li class="bubble ${m.from === 'agent' ? 'is-agent' : 'is-lead'}"><p>${m.text}</p><time>${m.time}</time></li>`)
    .join('')}</ol>
    <form class="composer" id="composer"><label class="sr-only" for="chat-input">Mensagem</label>
      <input id="chat-input" autocomplete="off" placeholder="Escreva uma mensagem" /><button type="submit" class="cum-btn">Enviar</button></form></div>`;

const timelinePanel = (lead) =>
  `<ol class="timeline">${lead.timeline.map((e) => `<li><time>${e.when}</time><p>${e.text}</p></li>`).join('')}</ol>`;

const panels = { assistente: assistantPanel, imoveis: propertiesPanel, conversa: chatPanel, historico: timelinePanel };
const tabLabels = { assistente: 'Assistente', imoveis: 'Imóveis', conversa: 'Conversa', historico: 'Linha do tempo' };

const renderPanel = () => {
  const lead = find(state.openId);
  const panel = drawer.querySelector('#panel');
  panel.innerHTML = panels[state.tab](lead);
  drawer.querySelectorAll('[role="tab"]').forEach((tab) => {
    const active = tab.dataset.tab === state.tab;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  if (state.tab === 'assistente' && state.ai[lead.id] === 'ready') typeInto(panel.querySelector('#ai-summary'), summary(lead));
  if (state.tab === 'conversa') panel.querySelector('#thread').scrollTop = 99999;
};

const renderDrawer = () => {
  const lead = find(state.openId);
  drawer.innerHTML = `<header class="drawer-head">
      <div class="avatar" aria-hidden="true">${lead.initials}</div>
      <div class="drawer-who"><h2 id="drawer-title">${lead.name}</h2><p>${lead.want} · ${lead.area}</p></div>
      <button type="button" class="drawer-close" data-close aria-label="Fechar detalhes">×</button>
    </header>
    <div class="drawer-meta">
      <label>Etapa<select data-stage>${stages.map((s) => `<option value="${s.id}" ${s.id === lead.stage ? 'selected' : ''}>${s.name}</option>`).join('')}</select></label>
      <span>Orçamento<strong>${lead.budget}</strong></span>
      <span>Origem<strong>${lead.origin}</strong></span>
    </div>
    <div class="tabs" role="tablist" aria-label="Detalhes do contato">${Object.entries(tabLabels)
      .map(([id, label]) => `<button type="button" role="tab" data-tab="${id}" aria-selected="false">${label}</button>`)
      .join('')}</div>
    <div class="panel" id="panel" role="tabpanel"></div>`;
  renderPanel();
};

const openDrawer = (id, opener) => {
  state.openId = id;
  state.tab = 'assistente';
  lastOpener = opener;
  renderDrawer();
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  scrim.hidden = false;
  drawer.querySelector('[data-close]').focus();
};

const closeDrawer = () => {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  scrim.hidden = true;
  state.openId = null;
  if (lastOpener && document.contains(lastOpener)) lastOpener.focus();
};

const replyFor = (lead) =>
  lead.stage === 'proposta' ? 'Recebi. Vou conversar com minha família e te respondo.' : lead.stage === 'visita' ? 'Combinado, estarei lá no horário.' : 'Obrigado! Vou olhar com calma e já te respondo.';

const sendMessage = (lead, text) => {
  lead.thread.push({ from: 'agent', text, time: 'agora' });
  lead.timeline.unshift({ when: 'agora', text: 'Mensagem enviada pelo WhatsApp' });
  state.tab = 'conversa';
  renderPanel();
  setTimeout(() => {
    lead.thread.push({ from: 'lead', text: replyFor(lead), time: 'agora' });
    if (state.openId === lead.id && state.tab === 'conversa') renderPanel();
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
  board.querySelectorAll('.is-dragging, .is-over').forEach((el) => el.classList.remove('is-dragging', 'is-over'));
});

board.addEventListener('dragover', (event) => {
  const col = event.target.closest('.col');
  if (!col || !dragId) return;
  event.preventDefault();
  board.querySelectorAll('.is-over').forEach((el) => el !== col && el.classList.remove('is-over'));
  col.classList.add('is-over');
});

board.addEventListener('drop', (event) => {
  const col = event.target.closest('.col');
  if (!col || !dragId) return;
  event.preventDefault();
  moveLead(dragId, col.dataset.stage);
});

scrim.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.openId) closeDrawer();
});

drawer.addEventListener('click', (event) => {
  const lead = find(state.openId);
  if (!lead) return;
  if (event.target.closest('[data-close]')) return closeDrawer();
  const tab = event.target.closest('[data-tab]');
  if (tab) {
    state.tab = tab.dataset.tab;
    return renderPanel();
  }
  if (event.target.closest('[data-ai]')) {
    state.ai[lead.id] = reduceMotion ? 'ready' : 'loading';
    renderPanel();
    if (!reduceMotion)
      setTimeout(() => {
        state.ai[lead.id] = 'ready';
        if (state.openId === lead.id && state.tab === 'assistente') renderPanel();
      }, 900);
    return;
  }
  if (event.target.closest('[data-send-ai]')) {
    const text = drawer.querySelector('#ai-message').value.trim();
    if (text) sendMessage(lead, text);
  }
});

drawer.addEventListener('change', (event) => {
  if (event.target.matches('[data-stage]')) moveLead(state.openId, event.target.value);
});

drawer.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = drawer.querySelector('#chat-input');
  const text = input.value.trim();
  if (text) sendMessage(find(state.openId), text);
});

renderBoard();
