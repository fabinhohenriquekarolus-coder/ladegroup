import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { setupTabs } from '../../../comum/tabs.js';
import * as data from './data.js';
import {
  money,
  toMinutes,
  toTime,
  serviceById,
  endOf,
  statusAt,
  statusLabel,
  planQueue,
  waitLabel,
  fitWalkIn,
  earliestSlot,
  dayTotals,
  cashSummary,
  paymentsBreakdown,
  clubSummary,
  filterSubscribers,
  renewSubscriber,
  initials,
  brDate,
  listNames,
  dayCounts,
} from './rules.js';

const { today, now, openTime, closeTime, services, barbers, products, plans, productRate, clubPayout } = data;

const state = {
  appointments: [...data.appointments],
  queue: [...data.queue],
  subscribers: data.subscribers.map((subscriber) => ({ ...subscriber })),
  filter: 'todos',
  walkIns: data.queue.length,
};

const queueLimit = 8;
const open = toMinutes(openTime);
const $ = (selector) => document.querySelector(selector);
const barberName = (id) => barbers.find((barber) => barber.id === id).name;
const context = () => ({
  barbers,
  appointments: state.appointments,
  products,
  services,
  now,
  productRate,
  clubPayout,
  queue: state.queue,
  closeTime,
});

const kpi = (label, value, note, tone = '') =>
  html`<div class="rg-kpi${tone ? ` is-${tone}` : ''}"><p>${label}</p><strong>${value}</strong><small>${note}</small></div>`;

const place = (startMin, endMin) =>
  `top:calc(${startMin - open} * var(--minute));height:calc(${endMin - startMin} * var(--minute) - 2px)`;

const renderKpis = () => {
  const ctx = context();
  const counts = dayCounts(state.appointments, services, now);
  const cash = cashSummary(dayTotals(ctx));
  const free = earliestSlot(ctx, 30);
  const seated = barbers.filter((barber) =>
    state.appointments.some((item) => item.barber === barber.id && statusAt(item, services, now) === 'atendendo'),
  );
  $('#hoje-numeros').innerHTML = html`${[
    kpi('Atendimentos hoje', counts.total, `${counts.done} concluídos, ${counts.inChair} na cadeira, ${counts.upcoming} por vir`),
    kpi('Faturamento até agora', money(cash.revenue), 'serviços e produtos'),
    kpi('Na cadeira agora', `${seated.length} de ${barbers.length}`, seated.length ? listNames(seated.map((barber) => barber.name)) : 'Nenhuma cadeira ocupada'),
    kpi('Próximo horário livre', free ? toTime(free.start) : 'Sem vaga', free ? `com ${barberName(free.barber)}, serviço de 30 min` : 'hoje'),
  ]}`;
};

const block = (item) => {
  const service = serviceById(services, item.service);
  const status = statusAt(item, services, now);
  const tags = [
    item.payment === 'clube' ? html`<em class="rg-tag">Clube</em>` : '',
    item.walkIn ? html`<em class="rg-tag is-walkin">Encaixe</em>` : '',
  ];
  const size = service.minutes <= 15 ? ' is-short is-tiny' : service.minutes <= 30 ? ' is-short' : '';
  return html`<li class="rg-block is-${status}${item.walkIn ? ' is-walkin' : ''}${size}" style="${place(toMinutes(item.start), endOf(item, services))}"><b>${item.start} ${item.client}</b><span>${service.name}${tags}</span><span class="sr-only">, ${statusLabel(status)}</span></li>`;
};

const column = (barber) => {
  const items = state.appointments.filter((item) => item.barber === barber.id);
  const pause = html`<li class="rg-block is-break" style="${place(toMinutes(barber.breakStart), toMinutes(barber.breakEnd))}"><span>Pausa</span></li>`;
  const line = html`<li class="rg-now" aria-hidden="true" style="top:calc(${toMinutes(now) - open} * var(--minute))"></li>`;
  return html`<ul class="rg-col" aria-label="Agenda de ${barber.name}">${pause}${items.map(block)}${line}</ul>`;
};

const chairHead = (barber) => {
  const count = state.appointments.filter((item) => item.barber === barber.id).length;
  return html`<div class="rg-chair"><b>${barber.name}</b><span>${count} atendimentos</span></div>`;
};

const renderAgenda = () => {
  const hours = [];
  for (let minute = open; minute <= toMinutes(closeTime); minute += 60) hours.push(minute);
  $('#agenda').innerHTML = html`<span aria-hidden="true"></span>${barbers.map(chairHead)}<div class="rg-hours" aria-hidden="true">${hours.map(
    (minute) => html`<span style="top:calc(${minute - open} * var(--minute))">${toTime(minute)}</span>`,
  )}</div>${barbers.map(column)}`;
};

const queueItem = (walkIn) => {
  const service = serviceById(services, walkIn.service);
  const where = walkIn.barber ? `, com ${barberName(walkIn.barber)} às ${walkIn.start}` : '';
  return html`<li class="rg-walkin">
    <div class="rg-walkin-head"><b>${walkIn.name}</b><p class="rg-wait">${waitLabel(walkIn.wait)}</p></div>
    <span>${service.name}, chegou às ${walkIn.arrived}${where}</span>
    <div class="rg-walkin-actions">
      <button type="button" class="rg-btn is-small" data-encaixar="${walkIn.id}" ${walkIn.barber ? '' : 'disabled'}>Encaixar<span class="sr-only"> ${walkIn.name}</span></button>
      <button type="button" class="rg-btn is-small is-light" data-remover="${walkIn.id}">Tirar da fila<span class="sr-only"> ${walkIn.name}</span></button>
    </div>
  </li>`;
};

const renderQueue = () => {
  const planned = planQueue(context());
  $('#fila').innerHTML = html`${planned.map(queueItem)}`;
  $('#fila-vazia').hidden = planned.length > 0;
};

const announce = (message) => {
  $('#fila-status').textContent = message;
};

const renderDay = () => {
  renderKpis();
  renderAgenda();
  renderQueue();
};

$('#encaixe-servico').innerHTML = html`${services.map(
  (service) => html`<option value="${service.id}">${service.name}, ${service.minutes} min</option>`,
)}`;

$('#fila').addEventListener('click', (event) => {
  const fit = event.target.closest('[data-encaixar]');
  const drop = event.target.closest('[data-remover]');
  if (!fit && !drop) return;
  const id = (fit ?? drop).dataset.encaixar ?? drop.dataset.remover;
  if (fit) {
    const entry = fitWalkIn(planQueue(context()), id);
    if (!entry) return;
    state.appointments = [...state.appointments, entry];
    announce(`${entry.client} encaixado com ${barberName(entry.barber)} às ${entry.start}.`);
  } else {
    announce(`${state.queue.find((item) => item.id === id).name} saiu da fila.`);
  }
  state.queue = state.queue.filter((item) => item.id !== id);
  renderDay();
  renderCash();
  $('#titulo-fila').focus();
});

const form = $('#novo-encaixe');
const nameField = form.elements.nome;
const formError = $('#encaixe-erro');

const failWith = (message) => {
  formError.textContent = message;
  formError.hidden = false;
  nameField.setAttribute('aria-invalid', 'true');
  nameField.focus();
};

nameField.addEventListener('input', () => {
  formError.hidden = true;
  nameField.removeAttribute('aria-invalid');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameField.value.trim();
  if (!name) return failWith('Informe o nome do cliente.');
  if (state.queue.length >= queueLimit) return failWith(`A fila da demonstração aceita até ${queueLimit} pessoas.`);
  state.walkIns += 1;
  state.queue = [...state.queue, { id: `w${state.walkIns}`, name, service: form.elements.servico.value, arrived: now }];
  nameField.value = '';
  renderDay();
  const added = planQueue(context()).find((item) => item.id === `w${state.walkIns}`);
  announce(`${name} entrou na fila. ${waitLabel(added.wait)}.`);
  nameField.focus();
});

const renderClub = () => {
  const summary = clubSummary(state.subscribers, plans, today);
  const list = filterSubscribers(state.subscribers, state.filter, today);
  $('#clube-numeros').innerHTML = html`${[
    kpi('Assinantes ativos', summary.active, `${plans.length} planos`),
    kpi('Receita mensal do clube', money(summary.monthly), 'cobrança recorrente'),
    kpi('Vencendo em 5 dias', summary.dueSoon, 'para cobrar esta semana'),
    kpi('Atrasados', summary.late, summary.late ? `${money(summary.lateValue)} em aberto` : 'tudo em dia', summary.late ? 'wine' : ''),
  ]}`;
  $('#planos').innerHTML = html`${plans.map((plan) => {
    const members = state.subscribers.filter((subscriber) => subscriber.plan === plan.id).length;
    return html`<article class="rg-plan"><div><h3>${plan.name}</h3><p>${plan.includes}. ${members} assinantes.</p></div><strong>${money(plan.price)}<small>/mês</small></strong></article>`;
  })}`;
  $('#assinantes').innerHTML = html`${list.map((subscriber) => {
    const plan = plans.find((item) => item.id === subscriber.plan);
    const action =
      subscriber.status.key === 'em-dia'
        ? ''
        : html`<button type="button" class="rg-btn is-light" data-pagar="${subscriber.id}">Registrar pagamento<span class="sr-only"> de ${subscriber.name}</span></button>`;
    return html`<tr>
      <th scope="row"><span class="rg-person"><span class="rg-avatar" aria-hidden="true">${initials(subscriber.name)}</span>${subscriber.name}</span></th>
      <td>${plan.name}</td>
      <td class="is-num">${subscriber.uses}</td>
      <td>${brDate(subscriber.renewal)}</td>
      <td><span class="rg-status is-${subscriber.status.key}">${subscriber.status.label}</span></td>
      <td class="is-act">${action}</td>
    </tr>`;
  })}`;
  $('#assinantes-vazio').hidden = list.length > 0;
};

const clubButtons = [...document.querySelectorAll('[data-clube]')];

clubButtons.forEach((button) =>
  button.addEventListener('click', () => {
    state.filter = button.dataset.clube;
    clubButtons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    renderClub();
  }),
);

$('#assinantes').addEventListener('click', (event) => {
  const button = event.target.closest('[data-pagar]');
  if (!button) return;
  state.subscribers = state.subscribers.map((subscriber) =>
    subscriber.id === button.dataset.pagar ? renewSubscriber(subscriber, today) : subscriber,
  );
  const paid = state.subscribers.find((subscriber) => subscriber.id === button.dataset.pagar);
  renderClub();
  showToast(`Pagamento de ${paid.name} registrado. Próxima renovação em ${brDate(paid.renewal)}.`);
  $('#titulo-assinantes').focus();
});

const renderCash = () => {
  const ctx = context();
  const totals = dayTotals(ctx);
  const summary = cashSummary(totals);
  const clubVisits = totals.reduce((sum, row) => sum + row.club, 0);
  const payments = paymentsBreakdown(ctx);
  const paidTotal = Object.values(payments).reduce((sum, value) => sum + value, 0);
  const labels = { pix: 'Pix', cartao: 'Cartão', dinheiro: 'Dinheiro' };
  const byRate = new Map();
  barbers.forEach((barber) => byRate.set(barber.rate, [...(byRate.get(barber.rate) ?? []), barber.name]));
  const rule = [...byRate].map(([rate, names]) => `${listNames(names)} ${Math.round(rate * 100)}%`).join(', ');

  $('#caixa-numeros').innerHTML = html`${[
    kpi('Faturamento do dia', money(summary.revenue), `${money(summary.services)} em serviços e ${money(summary.products)} em produtos`),
    kpi('Atendimentos concluídos', summary.done, `${clubVisits} pelo clube`),
    kpi('Ticket médio', money(summary.ticket), 'por serviço pago na hora'),
    kpi('Comissões a pagar', money(summary.commission), 'até este momento', 'wine'),
  ]}`;
  $('#comissoes').innerHTML = html`${totals.map(
    (row) => html`<tr><th scope="row">${barberName(row.barber)}</th><td class="is-num">${row.done}</td><td class="is-num">${money(row.servicesTotal)}</td><td class="is-num">${row.club}</td><td class="is-num">${money(row.productsTotal)}</td><td class="is-num">${money(row.commission)}</td></tr>`,
  )}`;
  $('#comissoes-total').innerHTML = html`<tr><th scope="row">Total</th><td class="is-num">${summary.done}</td><td class="is-num">${money(summary.services)}</td><td class="is-num">${clubVisits}</td><td class="is-num">${money(summary.products)}</td><td class="is-num">${money(summary.commission)}</td></tr>`;
  $('#regra-comissao').textContent = `Comissão sobre o serviço: ${rule}. Produtos: ${Math.round(productRate * 100)}%. Atendimento do clube: ${money(clubPayout)} por corte.`;
  $('#pagamentos').innerHTML = html`${Object.entries(payments).map(([key, value]) => {
    const share = paidTotal ? Math.round((value / paidTotal) * 100) : 0;
    return html`<li><div class="rg-pay-row"><b>${labels[key]}</b><span>${money(value)}</span></div><div class="rg-bar" role="img" aria-label="${labels[key]}, ${share}% do total"><i style="width:${share}%"></i></div></li>`;
  })}`;
};

setupTabs($('.rg-tabs'));

renderDay();
renderClub();
renderCash();
