import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { services, pros, days, clients as seedClients, appointments, openHour, closeHour } from './data.js';
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
} from './rules.js';

const grid = document.querySelector('#grid');
const panel = document.querySelector('#panel');
const proFilter = document.querySelector('#pro-filter');
const clientList = document.querySelector('#client-list');
const viewButtons = document.querySelectorAll('[data-view]');
const views = { agenda: document.querySelector('#view-agenda'), clientes: document.querySelector('#view-clientes') };
const clientFilters = document.querySelectorAll('[data-client-filter]');
const newClientForm = document.querySelector('#new-client');
const narrow = window.matchMedia('(max-width: 1180px)');

const open = openHour * 60;
const close = closeHour * 60;

const state = {
  visible: new Set(Object.keys(pros)),
  selected: null,
  draft: null,
  filter: 'todos',
  clients: seedClients.map((client) => ({ ...client })),
  items: appointments.map((item, index) => ({ ...item, id: `a${index + 1}`, startMin: toMinutes(item.start) })),
  nextId: appointments.length + 1,
};

const clientOf = (id) => state.clients.find((client) => client.id === id);
const dayOf = (id) => days.find((day) => day.id === id);
const firstName = (name) => name.split(' ')[0];

const block = (item) => {
  const pro = pros[item.pro];
  const service = services[item.service];
  const client = clientOf(item.client);
  const classes = ['appt', state.selected === item.id && 'is-selected', item.status === 'aguardando' && 'is-pending'].filter(Boolean).join(' ');
  const style = `top:${item.startMin - open}px;height:${service.minutes}px;left:calc(${(item.lane / item.lanes) * 100}% + 2px);width:calc(${100 / item.lanes}% - 4px);--c:${pro.color};--s:${pro.soft}`;
  return html`<button type="button" class="${classes}" data-appt="${item.id}" style="${style}"><strong>${client.name}</strong><span>${service.name}</span><em>${item.start} com ${pro.name}</em></button>`;
};

const popover = () => {
  const draft = state.draft;
  const day = dayOf(draft.day);
  const top = Math.min(draft.startMin - open, close - open - 260);
  return html`<form class="pop" id="pop" style="top:${top}px" aria-labelledby="pop-title">
    <h3 id="pop-title">${day.short} ${day.number}, ${toTime(draft.startMin)}</h3>
    <label>Serviço<select name="service">${Object.entries(services).map(([id, service]) => html`<option value="${id}">${service.name}, ${service.minutes} min</option>`)}</select></label>
    <label>Profissional<select name="pro">${Object.entries(pros).map(([id, pro]) => html`<option value="${id}">${pro.name}</option>`)}</select></label>
    <label>Cliente<select name="client">${state.clients.map((client) => html`<option value="${client.id}">${client.name}</option>`)}</select></label>
    <p class="pop-error" id="pop-error" role="alert" hidden></p>
    <div class="pop-actions"><button type="submit" class="btn is-primary">Agendar</button><button type="button" class="btn" data-pop-cancel>Cancelar</button></div>
  </form>`;
};

const renderGrid = () => {
  const hours = Array.from({ length: closeHour - openHour }, (_, index) => openHour + index);
  const head = days.map((day) => html`<div class="day-head${day.today ? ' is-today' : ''}"><span>${day.short}</span><strong>${day.number}</strong></div>`);
  const labels = hours.map((hour) => html`<span style="top:${(hour - openHour) * 60}px">${String(hour).padStart(2, '0')}:00</span>`);
  const columns = days.map((day) => {
    const items = assignLanes(
      state.items.filter((item) => item.day === day.id && state.visible.has(item.pro)),
      services,
    );
    return html`<div class="day-col${day.today ? ' is-today' : ''}" data-day="${day.id}" aria-label="${day.short} ${day.number}">${items.map(block)}${day.today ? html`<i class="now" aria-hidden="true"></i>` : ''}${state.draft?.day === day.id ? popover() : ''}</div>`;
  });
  grid.innerHTML = html`<div class="grid-head"><span></span>${head}</div><div class="grid-body"><div class="hours" aria-hidden="true">${labels}</div>${columns}</div>`;
};

const renderFilter = () => {
  proFilter.innerHTML = html`${Object.entries(pros).map(([id, pro]) => {
    const count = state.items.filter((item) => item.pro === id).length;
    return html`<li><label class="pro"><input type="checkbox" data-pro="${id}" ${state.visible.has(id) ? 'checked' : ''} /><i style="background:${pro.color}" aria-hidden="true"></i><span>${pro.name}</span><b>${count}<span class="sr-only"> atendimentos</span></b></label></li>`;
  })}`;
};

const renderPanel = () => {
  const item = state.items.find((entry) => entry.id === state.selected);
  if (!item) {
    panel.innerHTML = html`<h2>Detalhes</h2><p class="muted">Escolha um atendimento na agenda para ver o cliente e as ações. Para marcar um horário, clique em um espaço vazio ou use Novo agendamento.</p>
      <p class="tally"><strong>${state.items.length}</strong> atendimentos na semana</p>`;
    return;
  }
  const client = clientOf(item.client);
  const service = services[item.service];
  const pro = pros[item.pro];
  const day = dayOf(item.day);
  panel.innerHTML = html`<p class="chip" style="--c:${pro.color};--s:${pro.soft}">${pro.name}</p>
    <h2>${client.name}</h2>
    <p class="when">${day.short} ${day.number}, das ${item.start} às ${toTime(endOf(item, services))}</p>
    <dl>
      <dt>Serviço</dt><dd>${service.name}, ${service.price}</dd>
      <dt>Situação</dt><dd><span class="status is-${item.status}">${item.status}</span></dd>
      <dt>Cliente desde</dt><dd>${client.since}, ${client.visits} visitas</dd>
      <dt>Última visita</dt><dd>${client.last}</dd>
    </dl>
    <p class="note">${client.note}</p>
    <div class="actions">${item.status === 'aguardando' ? html`<button type="button" class="btn is-primary" data-confirm>Confirmar</button>` : ''}<button type="button" class="btn" data-move>Remarcar para o próximo horário livre</button><button type="button" class="btn is-danger" data-cancel>Cancelar atendimento</button></div>`;
};

const renderClients = () => {
  const list = state.clients.filter((client) => state.filter === 'todos' || client.tags.includes(state.filter));
  clientList.innerHTML = html`${list.map(
    (client) => html`<li class="client"><div class="avatar" aria-hidden="true">${initials(client.name)}</div>
      <div><strong>${client.name}</strong><span>${visitsLabel(client)}</span><span>Prefere: ${client.pref}</span><p>${client.note}</p>
      <em class="tag is-${client.tags[0]}">${client.tags[0]}</em></div></li>`,
  )}`;
};

const render = () => {
  renderGrid();
  renderFilter();
  renderPanel();
  renderClients();
};

const openDraft = (day, startMin) => {
  state.selected = null;
  state.draft = { day, startMin };
  renderGrid();
  renderPanel();
  document.querySelector('#pop select').focus();
};

const showError = (form, message) => {
  const error = form.querySelector('#pop-error');
  error.textContent = message;
  error.hidden = false;
};

const setView = (name) => {
  Object.entries(views).forEach(([key, node]) => {
    node.hidden = key !== name;
  });
  viewButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === name)));
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
  const column = event.target.closest('.day-col');
  if (!column) return;
  const startMin = slotFromOffset(event.clientY - column.getBoundingClientRect().top, open);
  if (startMin >= close - 30) return;
  openDraft(Number(column.dataset.day), startMin);
});

grid.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const item = {
    id: `a${state.nextId}`,
    day: state.draft.day,
    startMin: state.draft.startMin,
    start: toTime(state.draft.startMin),
    service: form.elements.service.value,
    pro: form.elements.pro.value,
    client: form.elements.client.value,
    status: 'confirmado',
  };
  if (!fitsBusinessHours(item, services, open, close)) {
    showError(form, 'Esse serviço passaria do horário de fechamento.');
    return;
  }
  const clash = findConflict(state.items, item, services);
  if (clash) {
    showError(form, `${pros[item.pro].name} já atende ${firstName(clientOf(clash.client).name)} às ${clash.start}. Escolha outro profissional ou horário.`);
    return;
  }
  state.nextId += 1;
  state.items.push(item);
  state.visible.add(item.pro);
  state.selected = item.id;
  state.draft = null;
  render();
  showToast(`Agendado: ${services[item.service].name} para ${clientOf(item.client).name}, ${dayOf(item.day).short} às ${item.start}.`);
});

panel.addEventListener('click', (event) => {
  const item = state.items.find((entry) => entry.id === state.selected);
  if (!item) return;
  if (event.target.closest('[data-confirm]')) {
    item.status = 'confirmado';
    render();
    showToast('Atendimento confirmado.');
    return;
  }
  if (event.target.closest('[data-cancel]')) {
    state.items = state.items.filter((entry) => entry.id !== item.id);
    state.selected = null;
    render();
    showToast('Atendimento cancelado. O horário ficou livre.');
    return;
  }
  if (event.target.closest('[data-move]')) {
    const start = nextFreeStart(state.items, item, services, close);
    if (start === null) {
      showToast('Não há outro horário livre neste dia para esse profissional.');
      return;
    }
    item.startMin = start;
    item.start = toTime(start);
    render();
    showToast(`Remarcado para ${item.start}.`);
  }
});

proFilter.addEventListener('change', (event) => {
  const id = event.target.dataset.pro;
  if (event.target.checked) state.visible.add(id);
  else state.visible.delete(id);
  renderGrid();
});

document.querySelector('[data-new]').addEventListener('click', () => {
  const today = days.find((day) => day.today) ?? days[0];
  openDraft(today.id, 10 * 60 + 30);
});

viewButtons.forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));

clientFilters.forEach((chip) =>
  chip.addEventListener('click', () => {
    state.filter = chip.dataset.clientFilter;
    clientFilters.forEach((other) => other.setAttribute('aria-pressed', String(other === chip)));
    renderClients();
  }),
);

newClientForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = newClientForm.elements.name.value.trim();
  if (!name) {
    newClientForm.elements.name.focus();
    return;
  }
  state.clients.unshift({
    id: `c${state.clients.length + 1}`,
    name,
    since: '2026',
    visits: 0,
    last: 'sem visitas',
    pref: newClientForm.elements.pref.value,
    tags: ['nova'],
    note: 'Cadastro criado agora, nesta demonstração.',
  });
  newClientForm.reset();
  state.filter = 'todos';
  clientFilters.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.clientFilter === 'todos')));
  render();
  showToast(`${name} foi cadastrado. Os dados ficam só no seu navegador.`);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.draft) {
    state.draft = null;
    renderGrid();
    document.querySelector('[data-new]').focus();
  }
});

render();
