import { services, pros, days, clients as seedClients, appointments, openHour, closeHour } from '../../data/demos/agenda.js';

const grid = document.querySelector('#grid');
const panel = document.querySelector('#panel');
const proFilter = document.querySelector('#pro-filter');
const clientList = document.querySelector('#client-list');
const switchButtons = document.querySelectorAll('[data-view]');
const views = { agenda: document.querySelector('#view-agenda'), clientes: document.querySelector('#view-clientes') };
const newClientForm = document.querySelector('#new-client');

const toMin = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
const toTime = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
const toast = (message) => document.dispatchEvent(new CustomEvent('demo:toast', { detail: message }));
const narrow = window.matchMedia('(max-width: 1180px)');
const open = openHour * 60;
const close = closeHour * 60;

const state = {
  view: 'agenda',
  visible: new Set(Object.keys(pros)),
  selected: null,
  draft: null,
  filter: 'todos',
  clients: seedClients.map((c) => ({ ...c })),
  items: appointments.map((a, i) => ({ ...a, id: `a${i + 1}`, startMin: toMin(a.start) })),
  nextId: appointments.length + 1,
};

const clientOf = (id) => state.clients.find((c) => c.id === id);
const endOf = (item) => item.startMin + services[item.service].minutes;
const dayOf = (id) => days.find((d) => d.id === id);

const conflict = (item) =>
  state.items.find((o) => o.id !== item.id && o.day === item.day && o.pro === item.pro && o.startMin < endOf(item) && item.startMin < endOf(o));

const layout = (items) => {
  const sorted = [...items].sort((a, b) => a.startMin - b.startMin);
  const out = [];
  let cluster = [];
  let clusterEnd = 0;
  const flush = () => {
    const laneEnds = [];
    cluster.forEach((item) => {
      let lane = laneEnds.findIndex((end) => end <= item.startMin);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = endOf(item);
      item.lane = lane;
    });
    cluster.forEach((item) => {
      item.lanes = laneEnds.length;
    });
    out.push(...cluster);
    cluster = [];
  };
  sorted.forEach((item) => {
    if (cluster.length && item.startMin >= clusterEnd) flush();
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, endOf(item));
  });
  if (cluster.length) flush();
  return out;
};

const block = (item) => {
  const pro = pros[item.pro];
  const service = services[item.service];
  const left = (item.lane / item.lanes) * 100;
  const width = 100 / item.lanes;
  return `<button type="button" class="appt${state.selected === item.id ? ' is-selected' : ''}${item.status === 'aguardando' ? ' is-pending' : ''}" data-appt="${item.id}"
    style="top:${item.startMin - open}px;height:${service.minutes}px;left:calc(${left}% + 2px);width:calc(${width}% - 4px);--c:${pro.color};--s:${pro.soft}">
    <strong>${clientOf(item.client).name}</strong><span>${service.name}</span><em>${item.start} · ${pro.name}</em></button>`;
};

const popover = () => {
  const draft = state.draft;
  if (!draft) return '';
  const day = dayOf(draft.day);
  return `<form class="pop" id="pop" style="top:${Math.min(draft.startMin - open, close - open - 250)}px" aria-label="Novo agendamento">
    <h3>${day.short} ${day.number} · ${toTime(draft.startMin)}</h3>
    <label>Serviço<select name="service">${Object.entries(services).map(([id, s]) => `<option value="${id}">${s.name} · ${s.minutes} min</option>`).join('')}</select></label>
    <label>Profissional<select name="pro">${Object.entries(pros).map(([id, p]) => `<option value="${id}">${p.name}</option>`).join('')}</select></label>
    <label>Cliente<select name="client">${state.clients.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}</select></label>
    <p class="pop-error" id="pop-error" role="alert" hidden></p>
    <div class="pop-actions"><button type="submit" class="btn is-primary">Agendar</button><button type="button" class="btn" data-pop-cancel>Cancelar</button></div></form>`;
};

const renderGrid = () => {
  const hours = Array.from({ length: closeHour - openHour }, (_, i) => openHour + i);
  const head = days.map((d) => `<div class="day-head${d.today ? ' is-today' : ''}"><span>${d.short}</span><strong>${d.number}</strong></div>`).join('');
  const labels = hours.map((h) => `<span style="top:${(h - openHour) * 60}px">${String(h).padStart(2, '0')}:00</span>`).join('');
  const cols = days
    .map((d) => {
      const items = layout(state.items.filter((i) => i.day === d.id && state.visible.has(i.pro)));
      return `<div class="day-col${d.today ? ' is-today' : ''}" data-day="${d.id}">${items.map(block).join('')}${d.today ? '<i class="now" aria-hidden="true"></i>' : ''}${state.draft?.day === d.id ? popover() : ''}</div>`;
    })
    .join('');
  grid.innerHTML = `<div class="grid-head"><span></span>${head}</div><div class="grid-body"><div class="hours">${labels}</div>${cols}</div>`;
};

const renderFilter = () => {
  proFilter.innerHTML = Object.entries(pros)
    .map(([id, p]) => {
      const count = state.items.filter((i) => i.pro === id).length;
      return `<li><label class="pro"><input type="checkbox" data-pro="${id}" ${state.visible.has(id) ? 'checked' : ''}/><i style="background:${p.color}"></i><span>${p.name}</span><b>${count}</b></label></li>`;
    })
    .join('');
};

const renderPanel = () => {
  const item = state.items.find((i) => i.id === state.selected);
  if (!item) {
    panel.innerHTML = `<h2>Detalhes</h2><p class="muted">Clique em um horário para ver o cliente e as ações. Clique em um espaço vazio da agenda para marcar um novo atendimento.</p>
      <p class="tally"><strong>${state.items.length}</strong> atendimentos na semana</p>`;
    return;
  }
  const client = clientOf(item.client);
  const service = services[item.service];
  const pro = pros[item.pro];
  const day = dayOf(item.day);
  panel.innerHTML = `<div class="chip" style="--c:${pro.color};--s:${pro.soft}">${pro.name}</div>
    <h2>${client.name}</h2>
    <p class="when">${day.short} ${day.number} · ${item.start} – ${toTime(endOf(item))}</p>
    <dl><dt>Serviço</dt><dd>${service.name} · ${service.price}</dd><dt>Situação</dt><dd><span class="status is-${item.status}">${item.status}</span></dd>
    <dt>Cliente desde</dt><dd>${client.since} · ${client.visits} visitas</dd><dt>Última visita</dt><dd>${client.last}</dd></dl>
    <p class="note">“${client.note}”</p>
    <div class="actions">${item.status === 'aguardando' ? '<button type="button" class="btn is-primary" data-confirm>Confirmar</button>' : ''}<button type="button" class="btn" data-move>Remarcar para o próximo horário livre</button><button type="button" class="btn is-danger" data-cancel>Cancelar atendimento</button></div>`;
};

const renderClients = () => {
  const list = state.clients.filter((c) => state.filter === 'todos' || c.tags.includes(state.filter));
  clientList.innerHTML = list
    .map((c) => `<li class="client"><div class="avatar" aria-hidden="true">${c.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</div>
      <div><strong>${c.name}</strong><span>${c.visits ? `${c.visits} visitas · última ${c.last}` : 'Ainda sem visitas'}</span><span>Prefere: ${c.pref}</span><p>${c.note}</p>
      <em class="tag is-${c.tags[0]}">${c.tags[0]}</em></div></li>`)
    .join('');
};

const render = () => {
  renderGrid();
  renderFilter();
  renderPanel();
  renderClients();
};

const setView = (name) => {
  state.view = name;
  Object.entries(views).forEach(([key, node]) => {
    node.hidden = key !== name;
  });
  switchButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === name)));
};

grid.addEventListener('click', (event) => {
  const appt = event.target.closest('[data-appt]');
  if (appt) {
    state.selected = appt.dataset.appt;
    state.draft = null;
    renderGrid();
    renderPanel();
    if (narrow.matches) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }
  if (event.target.closest('.pop')) {
    if (event.target.closest('[data-pop-cancel]')) {
      state.draft = null;
      renderGrid();
    }
    return;
  }
  const col = event.target.closest('.day-col');
  if (!col) return;
  const rect = col.getBoundingClientRect();
  const minutes = open + Math.floor((event.clientY - rect.top) / 30) * 30;
  if (minutes >= close - 30) return;
  state.selected = null;
  state.draft = { day: Number(col.dataset.day), startMin: minutes };
  renderGrid();
  renderPanel();
  document.querySelector('#pop select').focus();
});

grid.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const item = {
    id: `a${state.nextId++}`,
    day: state.draft.day,
    startMin: state.draft.startMin,
    start: toTime(state.draft.startMin),
    service: form.service.value,
    pro: form.pro.value,
    client: form.client.value,
    status: 'confirmado',
  };
  if (endOf(item) > close) {
    const error = form.querySelector('#pop-error');
    error.textContent = 'Esse serviço passaria do horário de fechamento.';
    error.hidden = false;
    return;
  }
  const clash = conflict(item);
  if (clash) {
    const error = form.querySelector('#pop-error');
    error.textContent = `${pros[item.pro].name} já tem ${clientOf(clash.client).name.split(' ')[0]} às ${clash.start}. Escolha outro profissional ou horário.`;
    error.hidden = false;
    return;
  }
  state.items.push(item);
  state.visible.add(item.pro);
  state.selected = item.id;
  state.draft = null;
  render();
  toast(`Agendado: ${services[item.service].name} para ${clientOf(item.client).name}, ${dayOf(item.day).short} às ${item.start}.`);
});

document.querySelector('[data-new]').addEventListener('click', () => {
  state.selected = null;
  state.draft = { day: 2, startMin: 10 * 60 + 30 };
  renderGrid();
  renderPanel();
  document.querySelector('#pop select').focus();
});

panel.addEventListener('click', (event) => {
  const item = state.items.find((i) => i.id === state.selected);
  if (!item) return;
  if (event.target.closest('[data-confirm]')) {
    item.status = 'confirmado';
    render();
    return toast('Atendimento confirmado.');
  }
  if (event.target.closest('[data-cancel]')) {
    state.items = state.items.filter((i) => i.id !== item.id);
    state.selected = null;
    render();
    return toast('Atendimento cancelado. O horário ficou livre.');
  }
  if (event.target.closest('[data-move]')) {
    const original = item.startMin;
    for (let start = original + 30; start + services[item.service].minutes <= close; start += 30) {
      const probe = { ...item, startMin: start };
      if (!conflict(probe)) {
        item.startMin = start;
        item.start = toTime(start);
        render();
        return toast(`Remarcado para ${item.start}.`);
      }
    }
    toast('Não há horário livre neste dia para esse profissional.');
  }
});

proFilter.addEventListener('change', (event) => {
  const id = event.target.dataset.pro;
  if (event.target.checked) state.visible.add(id);
  else state.visible.delete(id);
  renderGrid();
});

switchButtons.forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));

document.querySelectorAll('[data-client-filter]').forEach((chip) =>
  chip.addEventListener('click', () => {
    state.filter = chip.dataset.clientFilter;
    document.querySelectorAll('[data-client-filter]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    renderClients();
  }),
);

newClientForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = newClientForm.name.value.trim();
  if (!name) return;
  state.clients.unshift({ id: `c${state.clients.length + 1}`, name, since: '2026', visits: 0, last: 'sem visitas', pref: newClientForm.pref.value, tags: ['nova'], note: 'Cadastro criado agora, nesta demonstração.' });
  newClientForm.reset();
  state.filter = 'todos';
  document.querySelectorAll('[data-client-filter]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.clientFilter === 'todos')));
  render();
  toast(`${name} foi cadastrada. Os dados ficam só no seu navegador.`);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.draft) {
    state.draft = null;
    renderGrid();
  }
});

render();
