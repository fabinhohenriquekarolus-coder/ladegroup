import { html } from '../../comum/html.js';
import '../../comum/toast.js';
import {
  today,
  weekDays,
  openHour,
  closeHour,
  portes,
  services,
  clients,
  appointments,
  cashDays,
  expenses,
  monthByService,
  monthByHour,
  questions,
} from './data.js';
import {
  money,
  dayTitle,
  weekTitle,
  shortWeekday,
  dayOfMonth,
  brDate,
  toTime,
  serviceById,
  priceFor,
  durationLabel,
  endOf,
  appointmentsOn,
  assignLanes,
  isActive,
  statusInfo,
  daySummary,
  initials,
  daysSince,
  needsFollowUp,
  visitsLabel,
  filterClients,
  clientsLabel,
  periodRange,
  cashSummary,
  dailySeries,
  peakDay,
  recentMovements,
  groupByDate,
  ladinhoAnswer,
} from './rules.js';

const $ = (selector) => document.querySelector(selector);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clientById = (id) => clients.find((client) => client.id === id);
const porteLabel = (id) => portes.find((porte) => porte.id === id).label;
const icon = (name) => html`<svg class="lc-ico" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

const setupTabs = (list, onChange) => {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    tabs.forEach((other) => {
      const active = other === tab;
      other.setAttribute('aria-selected', String(active));
      other.tabIndex = active ? 0 : -1;
      document.getElementById(other.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tab.focus();
    onChange?.(tab);
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => select(tab, false)));
  list.addEventListener('keydown', (event) => {
    const index = tabs.indexOf(document.activeElement);
    if (index === -1) return;
    const moves = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next = null;
    if (event.key in moves) next = tabs[(index + moves[event.key] + tabs.length) % tabs.length];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    event.preventDefault();
    select(next, true);
  });
};

const press = (buttons, active) => buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));

setupTabs($('.lc-modes-tabs'));

const agenda = { date: today, mode: 'dia' };
const agendaButtons = [...document.querySelectorAll('[data-agenda]')];
const agendaTitle = $('#agenda-titulo');
agendaTitle.tabIndex = -1;

const appointmentRow = (item) => {
  const service = serviceById(services, item.service);
  const status = statusInfo(item.status);
  const fromWhatsapp = item.origin === 'whatsapp';
  return html`<li class="lc-appt is-${status.tone}">
    <div class="lc-appt-time"><b>${item.start}</b><span>${toTime(endOf(item, services))}</span></div>
    <div class="lc-appt-main"><b>${clientById(item.client).name}</b><span>${service.name}, ${porteLabel(item.porte)}</span><span class="lc-origin">${icon(fromWhatsapp ? 'chat' : 'user')}${fromWhatsapp ? 'Agendado pelo WhatsApp' : 'Cadastro manual'}</span></div>
    <div class="lc-appt-side"><span class="lc-status is-${status.tone}">${status.label}</span><strong>${isActive(item) ? money(priceFor(service, item.porte)) : 'Sem cobrança'}</strong></div>
  </li>`;
};

const weekGrid = () => {
  const hours = [];
  for (let hour = openHour; hour <= closeHour; hour += 1) hours.push(hour);
  const heads = weekDays.map(
    (date) =>
      html`<button type="button" class="lc-week-day${date === today ? ' is-today' : ''}" data-dia="${date}"><span class="lc-wd" aria-hidden="true">${shortWeekday(date)}</span><span class="sr-only">${dayTitle(date)}, ver o dia</span><span class="lc-dn" aria-hidden="true">${dayOfMonth(date)}</span></button>`,
  );
  const columns = weekDays.map((date) => {
    const blocks = assignLanes(appointmentsOn(appointments, date), services).map((item) => {
      const service = serviceById(services, item.service);
      const status = statusInfo(item.status);
      const style = `top:${item.startMin - openHour * 60}px;height:${item.endMin - item.startMin - 2}px;left:calc(${(item.lane / item.lanes) * 100}% + 3px);width:calc(${100 / item.lanes}% - 6px)`;
      return html`<li class="lc-block is-${status.tone}" style="${style}"><b>${item.start} ${clientById(item.client).name.split(' ')[0]}</b><span>${service.name}</span><span class="sr-only">${status.label}</span></li>`;
    });
    return html`<ul class="lc-col${date === today ? ' is-today' : ''}" aria-label="${dayTitle(date)}">${blocks}</ul>`;
  });
  return html`<span aria-hidden="true"></span>${heads}<div class="lc-hours" aria-hidden="true">${hours.map(
    (hour) => html`<span style="top:${(hour - openHour) * 60}px">${String(hour).padStart(2, '0')}:00</span>`,
  )}</div>${columns}`;
};

const renderAgenda = () => {
  const isDay = agenda.mode === 'dia';
  const index = weekDays.indexOf(agenda.date);
  agendaTitle.textContent = isDay ? dayTitle(agenda.date) : weekTitle(weekDays);
  $('#dia-anterior').disabled = !isDay || index === 0;
  $('#dia-seguinte').disabled = !isDay || index === weekDays.length - 1;
  $('#agenda-dia').hidden = !isDay;
  $('#agenda-semana').hidden = isDay;
  if (isDay) {
    const items = appointmentsOn(appointments, agenda.date);
    $('#agenda-resumo').textContent = daySummary(items);
    $('#agenda-dia').innerHTML = html`${items.map(appointmentRow)}`;
  } else {
    const total = appointments.filter(isActive).length;
    $('#agenda-resumo').textContent = `${total} atendimentos na semana`;
    $('#agenda-grade').innerHTML = weekGrid();
  }
};

agendaButtons.forEach((button) =>
  button.addEventListener('click', () => {
    agenda.mode = button.dataset.agenda;
    press(agendaButtons, button);
    renderAgenda();
  }),
);

const shiftDay = (step) => {
  const index = weekDays.indexOf(agenda.date) + step;
  if (index < 0 || index >= weekDays.length) return;
  agenda.date = weekDays[index];
  renderAgenda();
};

$('#dia-anterior').addEventListener('click', () => shiftDay(-1));
$('#dia-seguinte').addEventListener('click', () => shiftDay(1));

$('#agenda-grade').addEventListener('click', (event) => {
  const day = event.target.closest('[data-dia]');
  if (!day) return;
  agenda.date = day.dataset.dia;
  agenda.mode = 'dia';
  press(agendaButtons, agendaButtons[0]);
  renderAgenda();
  agendaTitle.focus();
});

const clientState = { term: '', view: 'todos' };
const clientButtons = [...document.querySelectorAll('[data-clientes]')];

const clientRow = (client) => {
  const late = needsFollowUp(client, today);
  return html`<li class="lc-client">
    <span class="lc-avatar" aria-hidden="true">${initials(client.name)}</span>
    <div><b>${client.name}</b><p class="lc-client-sub"><span>${visitsLabel(client, today)}</span>${late ? html`<span class="lc-status is-warning">Sem voltar há ${daysSince(client, today)} dias</span>` : ''}</p></div>
    <strong>${client.total ? money(client.total) : ''}</strong>
  </li>`;
};

const renderClients = () => {
  const list = filterClients(clients, clientState, today);
  $('#clientes-lista').innerHTML = html`${list.map(clientRow)}`;
  $('#clientes-total').textContent = clientsLabel(list.length);
  $('#clientes-vazio').hidden = list.length > 0;
};

clientButtons.forEach((button) =>
  button.addEventListener('click', () => {
    clientState.view = button.dataset.clientes;
    press(clientButtons, button);
    renderClients();
  }),
);

$('#busca-cliente').addEventListener('input', (event) => {
  clientState.term = event.target.value;
  renderClients();
});

const cash = { period: 'mes' };
const periodButtons = [...document.querySelectorAll('[data-periodo]')];

const chart = (series) => {
  const width = 1000;
  const height = 160;
  const top = Math.max(...series.flatMap((day) => [day.income, day.spent]), 1);
  const slot = width / series.length;
  const bar = Math.min(slot * 0.32, 18);
  const scale = (value) => (value / top) * (height - 6);
  const lines = [0.25, 0.5, 0.75, 1].map(
    (step) => html`<line x1="0" x2="${width}" y1="${height - step * (height - 6)}" y2="${height - step * (height - 6)}" stroke="#d8ecea" vector-effect="non-scaling-stroke"></line>`,
  );
  const bars = series.map((day, index) => {
    const center = index * slot + slot / 2;
    return html`<rect x="${center - bar - 1}" y="${height - scale(day.income)}" width="${bar}" height="${scale(day.income)}" fill="#18745c"></rect><rect x="${center + 1}" y="${height - scale(day.spent)}" width="${bar}" height="${scale(day.spent)}" fill="#ad3a40"></rect>`;
  });
  const marks = [0, Math.floor((series.length - 1) / 3), Math.floor(((series.length - 1) * 2) / 3), series.length - 1];
  return html`<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">${lines}${bars}<line x1="0" x2="${width}" y1="${height}" y2="${height}" stroke="#b8dcd8" vector-effect="non-scaling-stroke"></line></svg><div class="lc-chart-axis" aria-hidden="true">${marks.map((index) => html`<span>${brDate(series[index].date).slice(0, 5)}</span>`)}</div>`;
};

const statCard = (label, value, note, tone = '') =>
  html`<div class="lc-stat${tone ? ` is-${tone}` : ''}"><p>${label}</p><strong>${value}</strong><small>${note}</small></div>`;

const moveRow = (move) =>
  move.kind === 'entrada'
    ? html`<li class="lc-move"><span class="lc-move-icon">${icon('in')}</span><div><b>${move.label}</b><span>${move.detail}, ${move.time}</span></div><strong>+${money(move.amount)}</strong></li>`
    : html`<li class="lc-move is-out"><span class="lc-move-icon">${icon('out')}</span><div><b>${move.label}</b><span>${move.detail}</span></div><strong><span class="sr-only">Saída de </span>${money(move.amount)}</strong></li>`;

const renderCash = () => {
  const range = periodRange(cash.period, today);
  const summary = cashSummary(cashDays, expenses, range);
  const series = dailySeries(cashDays, expenses, range);
  const peak = peakDay(series);
  $('#caixa-periodo').textContent = `De ${brDate(range.start)} a ${brDate(range.end)}.`;
  $('#caixa-numeros').innerHTML = html`${[
    statCard('Saldo do período', money(summary.balance), 'entradas menos saídas'),
    statCard('Entradas', money(summary.income), `${summary.visits} atendimentos`, 'in'),
    statCard('Saídas', money(summary.spent), 'contas, aluguel e produtos', 'out'),
    statCard('Atendimentos', summary.visits, `ticket médio ${money(summary.ticket)}`),
  ]}`;
  $('#caixa-grafico').innerHTML = chart(series);
  $('#caixa-tabela').innerHTML = html`<caption>Entradas e saídas por dia</caption><thead><tr><th scope="col">Dia</th><th scope="col">Entradas</th><th scope="col">Saídas</th></tr></thead><tbody>${series.map(
    (day) => html`<tr><th scope="row">${brDate(day.date)}</th><td>${money(day.income)}</td><td>${money(day.spent)}</td></tr>`,
  )}</tbody>`;
  $('#caixa-pico').textContent = `Maior dia do período: ${dayTitle(peak.date).toLowerCase()}, com ${money(peak.income)}.`;
  $('#caixa-movimentos').innerHTML = html`${groupByDate(recentMovements(appointments, expenses, services, clients, today)).map(
    (group) => html`<h5>${dayTitle(group.date)}</h5><ul>${group.items.map(moveRow)}</ul>`,
  )}`;
};

periodButtons.forEach((button) =>
  button.addEventListener('click', () => {
    cash.period = button.dataset.periodo;
    press(periodButtons, button);
    renderCash();
  }),
);

const catalog = { porte: 'suv' };

$('#portes').innerHTML = html`${portes.map(
  (porte) =>
    html`<label class="lc-porte"><input type="radio" name="porte" value="${porte.id}" ${porte.id === catalog.porte ? 'checked' : ''} /><span>${porte.label}</span></label>`,
)}`;

const serviceCard = (service) => {
  const price = priceFor(service, catalog.porte);
  return html`<li class="lc-service">
    <h4>${service.name}</h4>
    <p>${service.text}</p>
    <dl>
      <div><dt>Preço</dt><dd class="${price === null ? 'is-off' : ''}">${price === null ? `Não oferecido para ${porteLabel(catalog.porte).toLowerCase()}` : money(price)}</dd></div>
      <div><dt>Duração</dt><dd>${durationLabel(service.minutes)}</dd></div>
    </dl>
    <div class="lc-service-actions">
      <button type="button" class="lc-btn is-small is-soft" data-demo-action="Na demonstração os serviços não podem ser desligados.">Desligar<span class="sr-only"> ${service.name}</span></button>
      <button type="button" class="lc-btn is-small is-soft" data-demo-action="Na demonstração os serviços não podem ser editados.">Editar<span class="sr-only"> ${service.name}</span></button>
    </div>
  </li>`;
};

const renderServices = () => {
  $('#servicos-lista').innerHTML = html`${services.map(serviceCard)}`;
};

$('#portes').addEventListener('change', (event) => {
  catalog.porte = event.target.value;
  renderServices();
});

const log = $('#ladinho-conversa');
const asks = $('#ladinho-perguntas');
const context = { today, cashDays, expenses, appointments, services, monthByService, monthByHour };

asks.innerHTML = html`${questions.map((question) => html`<button type="button" class="lc-ask" data-pergunta="${question.id}">${question.text}</button>`)}`;

const bubble = (text, from) =>
  html`<li class="lc-msg ${from === 'voce' ? 'is-out' : 'is-in'}"><span class="sr-only">${from === 'voce' ? 'Você:' : 'Ladinho:'}</span>${text}</li>`;

const append = (markup) => {
  log.insertAdjacentHTML('beforeend', String(markup));
  while (log.children.length > 6) log.firstElementChild.remove();
};

let typing = false;

asks.addEventListener('click', (event) => {
  const button = event.target.closest('[data-pergunta]');
  if (!button || typing) return;
  const question = questions.find((item) => item.id === button.dataset.pergunta);
  const answer = ladinhoAnswer(question.id, context);
  append(bubble(question.text, 'voce'));
  if (reduceMotion.matches) {
    append(bubble(answer, 'ladinho'));
    return;
  }
  typing = true;
  append(html`<li class="lc-msg is-in lc-typing" aria-hidden="true">Ladinho está escrevendo</li>`);
  setTimeout(() => {
    log.querySelector('.lc-typing')?.remove();
    append(bubble(answer, 'ladinho'));
    typing = false;
  }, 650);
});

const views = { 'aba-clientes': renderClients, 'aba-caixa': renderCash, 'aba-servicos': renderServices };
const rendered = new Set();

setupTabs($('.lc-app-nav'), (tab) => {
  if (rendered.has(tab.id) || !views[tab.id]) return;
  rendered.add(tab.id);
  views[tab.id]();
});

renderAgenda();
