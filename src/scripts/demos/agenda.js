import { services, days, firstHour, slotCount, clients, appointments } from '../../data/demos/agenda.js';

const serviceById = Object.fromEntries(services.map((service) => [service.id, service]));
const clientById = Object.fromEntries(clients.map((client) => [client.id, client]));
const dayById = Object.fromEntries(days.map((day) => [day.id, day]));

const slotsFor = (service) => Math.ceil(service.minutes / 30);
const timeOf = (index) => {
  const minutes = firstHour * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
};
const indexOf = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60 + minutes - firstHour * 60) / 30;
};

const state = {
  service: services[0].id,
  day: days[0].id,
  time: null,
  booked: appointments.map((item) => ({ ...item })),
};

const slotsRoot = document.querySelector('#slots');
const listRoot = document.querySelector('#day-list');
const dayTitle = document.querySelector('#day-title');
const submit = document.querySelector('#book');
const clientSelect = document.querySelector('#client');
const serviceButtons = document.querySelectorAll('[data-service]');
const dayButtons = document.querySelectorAll('[data-day]');
const clientFilters = document.querySelectorAll('[data-client-filter]');
const clientCards = document.querySelectorAll('[data-client-kind]');

const occupied = () => {
  const taken = new Set();
  state.booked
    .filter((item) => item.day === state.day)
    .forEach((item) => {
      const start = indexOf(item.time);
      for (let offset = 0; offset < slotsFor(serviceById[item.service]); offset += 1) taken.add(start + offset);
    });
  return taken;
};

const renderSlots = () => {
  const taken = occupied();
  const needed = slotsFor(serviceById[state.service]);
  slotsRoot.innerHTML = Array.from({ length: slotCount }, (_, index) => {
    let fits = index + needed <= slotCount;
    for (let offset = 0; fits && offset < needed; offset += 1) if (taken.has(index + offset)) fits = false;
    const selected = state.time === index;
    return `<button type="button" class="agenda-slot" data-slot="${index}" aria-pressed="${selected}" ${fits ? '' : 'disabled'}>${timeOf(index)}</button>`;
  }).join('');
  submit.disabled = state.time === null;
};

const renderList = () => {
  const items = state.booked
    .filter((item) => item.day === state.day)
    .sort((a, b) => indexOf(a.time) - indexOf(b.time));
  dayTitle.textContent = `Agenda de ${dayById[state.day].label}`;
  listRoot.innerHTML = items.length
    ? items
        .map((item) => {
          const service = serviceById[item.service];
          return `<li class="agenda-item${item.fresh ? ' is-fresh' : ''}">
            <span class="agenda-time">${item.time}</span>
            <span><strong>${clientById[item.client].name}</strong><span class="agenda-service">${service.name} · ${service.minutes} min · ${service.price}</span></span>
            ${item.fresh ? '<span class="app-badge is-ok">Novo</span>' : ''}
          </li>`;
        })
        .join('')
    : '<li class="agenda-empty">Nenhum horário marcado para este dia.</li>';
};

const render = () => {
  renderSlots();
  renderList();
};

const press = (buttons, value, attr) =>
  buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset[attr] === value)));

serviceButtons.forEach((button) =>
  button.addEventListener('click', () => {
    state.service = button.dataset.service;
    state.time = null;
    press(serviceButtons, state.service, 'service');
    render();
  }),
);

dayButtons.forEach((button) =>
  button.addEventListener('click', () => {
    state.day = button.dataset.day;
    state.time = null;
    press(dayButtons, state.day, 'day');
    render();
  }),
);

slotsRoot.addEventListener('click', (event) => {
  const slot = event.target.closest('[data-slot]');
  if (!slot || slot.disabled) return;
  state.time = Number(slot.dataset.slot);
  renderSlots();
});

submit.addEventListener('click', () => {
  if (state.time === null) return;
  const service = serviceById[state.service];
  const client = clientById[clientSelect.value];
  state.booked.forEach((item) => {
    item.fresh = false;
  });
  state.booked.push({ day: state.day, time: timeOf(state.time), service: state.service, client: clientSelect.value, fresh: true });
  document.dispatchEvent(
    new CustomEvent('demo:toast', {
      detail: `Agendado: ${service.name} para ${client.name}, ${dayById[state.day].label} às ${timeOf(state.time)}. Exemplo ilustrativo.`,
    }),
  );
  state.time = null;
  render();
});

clientFilters.forEach((chip) =>
  chip.addEventListener('click', () => {
    const filter = chip.dataset.clientFilter;
    press(clientFilters, filter, 'clientFilter');
    clientCards.forEach((card) => {
      card.hidden = filter !== 'todos' && card.dataset.clientKind !== filter;
    });
  }),
);

render();
