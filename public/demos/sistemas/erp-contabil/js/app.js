import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { clients, reviewBelow } from './data.js';
import {
  money,
  totalOf,
  openFindings,
  pendingObligations,
  deliveryProgress,
  sortRows,
  toggleSort,
  needsReview,
  findingsLabel,
} from './rules.js';

const root = document.querySelector('#rz');
const tree = root.querySelector('#rz-tree');
const view = root.querySelector('#rz-view');
const inspector = root.querySelector('#rz-inspector');
const status = root.querySelector('#rz-status');
const tabs = [...root.querySelectorAll('[role="tab"]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const state = {
  client: clients[0].id,
  tab: 'lancamentos',
  selected: null,
  sort: {
    lancamentos: { key: 'day', dir: 1 },
    obrigacoes: { key: 'day', dir: 1 },
    documentos: { key: 'received', dir: 1 },
  },
  data: Object.fromEntries(clients.map((client) => [client.id, structuredClone(client)])),
  checked: {},
  classified: {},
  busy: false,
};

const current = () => state.data[state.client];
const findings = (client) => openFindings(client, state.checked[client.id]);

const head = (tab, key, label, className = '') => {
  const rule = state.sort[tab];
  const active = rule.key === key;
  const ariaSort = active ? (rule.dir === 1 ? 'ascending' : 'descending') : 'none';
  const arrow = active ? (rule.dir === 1 ? '▲' : '▼') : '';
  return html`<th class="${className}" aria-sort="${ariaSort}"><button type="button" data-sort="${key}">${label}<span aria-hidden="true">${arrow}</span></button></th>`;
};

const renderTree = () => {
  tree.innerHTML = html`${Object.values(state.data).map((client) => {
    const open = pendingObligations(client);
    const alerts = findings(client).length;
    return html`<li><button type="button" class="rz-client${client.id === state.client ? ' is-active' : ''}" data-client="${client.id}" aria-pressed="${client.id === state.client}">
      <span class="rz-client-name">${client.name}</span>
      <span class="rz-client-meta">${client.regime}</span>
      <span class="rz-client-badges">${open ? html`<i class="pill">${open} obrig.</i>` : ''}${alerts ? html`<i class="pill is-bad">${alerts} IA</i>` : ''}</span>
    </button></li>`;
  })}`;
};

const entriesView = (client) => {
  const checked = state.checked[client.id];
  const rows = sortRows(client.entries, state.sort.lancamentos).map((entry, index) => {
    const mark = checked && entry.flag && !entry.reviewed;
    const classes = [state.selected === `e:${entry.id}` && 'is-selected', mark && 'is-flag'].filter(Boolean).join(' ');
    return html`<tr data-row="e:${entry.id}" class="${classes}">
      <th scope="row" class="n">${index + 1}</th><td><button type="button" class="row-open" data-open="e:${entry.id}">${entry.date}</button></td><td>${entry.history}${mark ? html`<b class="flag" title="Apontamento da IA">!<span class="sr-only"> com apontamento</span></b>` : ''}</td>
      <td>${entry.debit}</td><td>${entry.credit}</td><td class="num">${money(entry.value)}</td></tr>`;
  });
  return html`<div class="grid-wrap" tabindex="0" role="region" aria-label="Lançamentos"><table class="grid"><caption class="sr-only">Lançamentos de ${client.name}</caption><thead><tr><th class="n"><span class="sr-only">Linha</span></th>${head('lancamentos', 'day', 'Data')}${head('lancamentos', 'history', 'Histórico')}${head('lancamentos', 'debit', 'Conta débito')}${head('lancamentos', 'credit', 'Conta crédito')}${head('lancamentos', 'value', 'Valor (R$)', 'num')}</tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr><th class="n"></th><td colspan="4">Total do período, ${client.entries.length} lançamentos</td><td class="num">${money(totalOf(client.entries))}</td></tr></tfoot></table></div>`;
};

const obligationsView = (client) => {
  const rows = sortRows(client.obligations, state.sort.obrigacoes).map(
    (item, index) => html`<tr data-row="o:${item.id}" class="${state.selected === `o:${item.id}` ? 'is-selected' : ''}">
      <th scope="row" class="n">${index + 1}</th><td><button type="button" class="row-open" data-open="o:${item.id}">${item.name}</button></td><td>${item.due}</td>
      <td><span class="chip is-${item.status}">${item.status}</span></td><td>${item.owner}</td>
      <td class="act">${item.status === 'entregue' ? '' : html`<button type="button" class="tbtn" data-deliver="${item.id}">Marcar entregue</button>`}</td></tr>`,
  );
  const progress = deliveryProgress(client);
  return html`<div class="progress"><span>Obrigações da competência: <strong>${progress.done} de ${progress.total}</strong> entregues</span><div class="bar" role="progressbar" aria-label="Obrigações entregues" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress.percent}"><i style="width:${progress.percent}%"></i></div></div>
    <div class="grid-wrap" tabindex="0" role="region" aria-label="Obrigações"><table class="grid"><caption class="sr-only">Obrigações de ${client.name}</caption><thead><tr><th class="n"><span class="sr-only">Linha</span></th>${head('obrigacoes', 'name', 'Obrigação')}${head('obrigacoes', 'day', 'Vencimento')}${head('obrigacoes', 'status', 'Situação')}${head('obrigacoes', 'owner', 'Resp.')}<th><span class="sr-only">Ação</span></th></tr></thead><tbody>${rows}</tbody></table></div>`;
};

const docsView = (client) => {
  const done = state.classified[client.id];
  const pendingLabel = html`<span class="muted">a classificar</span>`;
  const rows = sortRows(client.docs, state.sort.documentos).map((doc, index) => {
    const review = done && needsReview(doc, reviewBelow);
    return html`<tr class="${review ? 'is-flag' : ''}"><th scope="row" class="n">${index + 1}</th><td>${doc.file}</td><td>${doc.received}</td>
      <td>${done ? doc.kind : pendingLabel}</td><td>${done ? doc.account : pendingLabel}</td>
      <td class="num">${done ? `${doc.confidence}%` : ''}</td>
      <td class="act">${review ? html`<button type="button" class="tbtn" data-approve="${doc.id}">Aprovar</button>` : ''}</td></tr>`;
  });
  const label = done ? 'Documentos classificados' : state.busy ? 'Classificando…' : 'Classificar com IA';
  return html`<div class="docbar"><span>${client.docs.length} documentos recebidos pelo portal do cliente</span>
    <button type="button" class="tbtn is-primary" data-classify ${done || state.busy ? 'disabled' : ''}>${label}</button></div>
    <div class="grid-wrap" tabindex="0" role="region" aria-label="Documentos"><table class="grid"><caption class="sr-only">Documentos de ${client.name}</caption><thead><tr><th class="n"><span class="sr-only">Linha</span></th>${head('documentos', 'file', 'Arquivo')}${head('documentos', 'received', 'Recebido')}<th>Tipo detectado</th><th>Conta sugerida</th><th class="num">Conf.</th><th><span class="sr-only">Ação</span></th></tr></thead><tbody>${rows}</tbody></table></div>`;
};

const views = { lancamentos: entriesView, obrigacoes: obligationsView, documentos: docsView };

const renderView = () => {
  view.innerHTML = views[state.tab](current());
  view.setAttribute('aria-labelledby', `tab-${state.tab}`);
  tabs.forEach((tab) => {
    const active = tab.dataset.tab === state.tab;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
};

const entryDetail = (client, entry) => {
  const finding = state.checked[client.id] && entry.flag && !entry.reviewed;
  return html`<dl><dt>Data</dt><dd>${entry.date}/2026</dd><dt>Histórico</dt><dd>${entry.history}</dd><dt>Débito</dt><dd>${entry.debit}</dd><dt>Crédito</dt><dd>${entry.credit}</dd>
    <dt>Valor</dt><dd class="mono">R$ ${money(entry.value)}</dd><dt>Documento</dt><dd>${entry.doc || html`<span class="bad">não vinculado</span>`}</dd></dl>
    ${finding ? html`<div class="finding"><strong>Apontamento da IA, simulação</strong><p>${entry.flag}</p><button type="button" class="tbtn" data-review="${entry.id}">Marcar como revisado</button></div>` : ''}`;
};

const obligationDetail = (item) =>
  html`<dl><dt>Obrigação</dt><dd>${item.name}</dd><dt>Vencimento</dt><dd>${item.due}/2026</dd><dt>Situação</dt><dd><span class="chip is-${item.status}">${item.status}</span></dd><dt>Responsável</dt><dd>${item.owner}</dd></dl>`;

const renderInspector = () => {
  const client = current();
  const list = findings(client);
  let detail = html`<p class="muted">Selecione uma linha para ver os detalhes.</p>`;
  if (state.selected?.startsWith('e:')) detail = entryDetail(client, client.entries.find((entry) => `e:${entry.id}` === state.selected));
  if (state.selected?.startsWith('o:')) detail = obligationDetail(client.obligations.find((item) => `o:${item.id}` === state.selected));
  let summary = '';
  if (state.checked[client.id]) {
    summary = list.length
      ? html`<div class="finding"><strong>${findingsLabel(list.length)} da IA</strong><p>Linhas marcadas com ponto de exclamação na grade de lançamentos.</p></div>`
      : html`<div class="ok-note"><strong>Conferência concluída</strong><p>Nenhum apontamento para esta competência.</p></div>`;
  }
  inspector.innerHTML = html`<h2>${client.name}</h2><p class="muted">${client.regime}, competência 09/2026</p>${summary}<h3>Detalhes</h3>${detail}`;
};

const renderStatus = (aiText) => {
  const client = current();
  const ai = aiText ?? (state.checked[client.id] ? `IA: ${findingsLabel(findings(client).length)}` : 'IA: conferência não executada');
  status.innerHTML = html`<span>Cliente: <strong>${client.name}</strong></span><span>${client.entries.length} lançamentos</span><span class="mono">Total R$ ${money(totalOf(client.entries))}</span><span>${ai}</span>`;
};

const render = () => {
  renderTree();
  renderView();
  renderInspector();
  renderStatus();
};

const selectRow = (id) => {
  state.selected = id;
  renderView();
  renderInspector();
  view.querySelector(`[data-open="${id}"]`)?.focus();
};

root.addEventListener('click', (event) => {
  const target = event.target;
  const clientButton = target.closest('[data-client]');
  if (clientButton) {
    state.client = clientButton.dataset.client;
    state.selected = null;
    render();
    tree.querySelector(`[data-client="${state.client}"]`).focus();
    return;
  }
  const tab = target.closest('[data-tab]');
  if (tab) {
    state.tab = tab.dataset.tab;
    state.selected = null;
    render();
    return;
  }
  const sort = target.closest('[data-sort]');
  if (sort) {
    state.sort[state.tab] = toggleSort(state.sort[state.tab], sort.dataset.sort);
    renderView();
    view.querySelector(`[data-sort="${sort.dataset.sort}"]`).focus();
    return;
  }
  const opener = target.closest('[data-open]');
  if (opener) {
    selectRow(opener.dataset.open);
    return;
  }
  const row = target.closest('[data-row]');
  if (row && !target.closest('button')) {
    selectRow(row.dataset.row);
    return;
  }
  const deliver = target.closest('[data-deliver]');
  if (deliver) {
    current().obligations.find((item) => item.id === deliver.dataset.deliver).status = 'entregue';
    render();
    showToast('Obrigação marcada como entregue. Exemplo ilustrativo.');
    return;
  }
  const review = target.closest('[data-review]');
  if (review) {
    current().entries.find((entry) => entry.id === review.dataset.review).reviewed = true;
    render();
    showToast('Apontamento marcado como revisado.');
    return;
  }
  const approve = target.closest('[data-approve]');
  if (approve) {
    current().docs.find((doc) => doc.id === approve.dataset.approve).approved = true;
    renderView();
    showToast('Classificação aprovada pelo contador.');
    return;
  }
  if (target.closest('[data-classify]')) {
    const id = state.client;
    state.busy = true;
    renderView();
    setTimeout(
      () => {
        state.busy = false;
        state.classified[id] = true;
        if (state.client === id) renderView();
        showToast('Documentos classificados. Os de baixa confiança ficam para revisão humana.');
      },
      reduceMotion ? 0 : 900,
    );
    return;
  }
  if (target.closest('[data-check]')) {
    const id = state.client;
    renderStatus('IA: conferindo lançamentos…');
    setTimeout(
      () => {
        state.checked[id] = true;
        state.tab = 'lancamentos';
        render();
        showToast('Conferência concluída. Exemplo ilustrativo.');
      },
      reduceMotion ? 0 : 800,
    );
  }
});

tabs.forEach((tab, index) =>
  tab.addEventListener('keydown', (event) => {
    const moves = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = tabs[(moves[event.key] + tabs.length) % tabs.length];
    next.click();
    next.focus();
  }),
);

render();
