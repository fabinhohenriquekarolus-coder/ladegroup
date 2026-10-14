import { clients, reviewBelow } from '../../data/demos/erp.js';

const root = document.querySelector('#rz');
const tree = root.querySelector('#rz-tree');
const view = root.querySelector('#rz-view');
const inspector = root.querySelector('#rz-inspector');
const status = root.querySelector('#rz-status');
const tabs = [...root.querySelectorAll('[role="tab"]')];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const state = {
  client: 'padaria',
  tab: 'lancamentos',
  selected: null,
  sort: { lancamentos: { key: 'day', dir: 1 }, obrigacoes: { key: 'day', dir: 1 }, documentos: { key: 'received', dir: 1 } },
  data: Object.fromEntries(clients.map((client) => [client.id, structuredClone(client)])),
  checked: {},
  classified: {},
  busy: false,
};

const current = () => state.data[state.client];
const money = (value) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const toast = (message) => document.dispatchEvent(new CustomEvent('demo:toast', { detail: message }));
const total = (entries) => entries.reduce((sum, entry) => sum + entry.value, 0);
const flagged = (client) => (state.checked[client.id] ? client.entries.filter((entry) => entry.flag && !entry.reviewed) : []);
const pending = (client) => client.obligations.filter((o) => o.status !== 'entregue').length;

const sorted = (rows, tab) => {
  const { key, dir } = state.sort[tab];
  return [...rows].sort((a, b) => (a[key] > b[key] ? dir : a[key] < b[key] ? -dir : 0));
};

const head = (tab, key, label, cls = '') => {
  const sort = state.sort[tab];
  const active = sort.key === key;
  const arrow = active ? (sort.dir === 1 ? '▲' : '▼') : '';
  return `<th class="${cls}" aria-sort="${active ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}"><button type="button" data-sort="${key}">${label}<span>${arrow}</span></button></th>`;
};

const renderTree = () => {
  tree.innerHTML = Object.values(state.data)
    .map((client) => {
      const open = pending(client);
      const alerts = flagged(client).length;
      return `<li><button type="button" class="rz-client${client.id === state.client ? ' is-active' : ''}" data-client="${client.id}">
        <span class="rz-client-name">${client.name}</span>
        <span class="rz-client-meta">${client.regime}</span>
        <span class="rz-client-badges">${open ? `<i class="pill">${open} obrig.</i>` : ''}${alerts ? `<i class="pill is-bad">${alerts} IA</i>` : ''}</span>
      </button></li>`;
    })
    .join('');
};

const entriesView = (client) => {
  const rows = sorted(client.entries, 'lancamentos');
  const body = rows
    .map((entry, index) => {
      const mark = state.checked[client.id] && entry.flag && !entry.reviewed;
      return `<tr data-row="e:${entry.id}" class="${state.selected === `e:${entry.id}` ? 'is-selected' : ''}${mark ? ' is-flag' : ''}">
        <th scope="row" class="n">${index + 1}</th><td>${entry.date}</td><td>${entry.history}${mark ? '<b class="flag" title="Apontamento da IA">!</b>' : ''}</td>
        <td>${entry.debit}</td><td>${entry.credit}</td><td class="num">${money(entry.value)}</td></tr>`;
    })
    .join('');
  return `<div class="grid-wrap"><table class="grid"><thead><tr><th class="n"></th>${head('lancamentos', 'day', 'Data')}${head('lancamentos', 'history', 'Histórico')}${head('lancamentos', 'debit', 'Conta débito')}${head('lancamentos', 'credit', 'Conta crédito')}${head('lancamentos', 'value', 'Valor (R$)', 'num')}</tr></thead>
    <tbody>${body}</tbody>
    <tfoot><tr><th class="n"></th><td colspan="4">Total do período · ${client.entries.length} lançamentos</td><td class="num">${money(total(client.entries))}</td></tr></tfoot></table></div>`;
};

const obligationsView = (client) => {
  const rows = sorted(client.obligations, 'obrigacoes');
  const body = rows
    .map((item, index) => `<tr data-row="o:${item.id}" class="${state.selected === `o:${item.id}` ? 'is-selected' : ''}">
      <th scope="row" class="n">${index + 1}</th><td>${item.name}</td><td>${item.due}</td>
      <td><span class="chip is-${item.status}">${item.status}</span></td><td>${item.owner}</td>
      <td class="act">${item.status === 'entregue' ? '' : `<button type="button" class="tbtn" data-deliver="${item.id}">Marcar entregue</button>`}</td></tr>`)
    .join('');
  const done = client.obligations.filter((o) => o.status === 'entregue').length;
  const pct = Math.round((done / client.obligations.length) * 100);
  return `<div class="progress"><span>Obrigações da competência: <strong>${done} de ${client.obligations.length}</strong> entregues</span><div class="bar"><i style="width:${pct}%"></i></div></div>
    <div class="grid-wrap"><table class="grid"><thead><tr><th class="n"></th>${head('obrigacoes', 'name', 'Obrigação')}${head('obrigacoes', 'day', 'Vencimento')}${head('obrigacoes', 'status', 'Situação')}${head('obrigacoes', 'owner', 'Resp.')}<th></th></tr></thead><tbody>${body}</tbody></table></div>`;
};

const docsView = (client) => {
  const done = state.classified[client.id];
  const rows = sorted(client.docs, 'documentos');
  const body = rows
    .map((doc, index) => {
      const review = done && doc.confidence < reviewBelow && !doc.approved;
      return `<tr class="${review ? 'is-flag' : ''}"><th scope="row" class="n">${index + 1}</th><td>${doc.file}</td><td>${doc.received}</td>
        <td>${done ? doc.kind : '<span class="muted">—</span>'}</td><td>${done ? doc.account : '<span class="muted">—</span>'}</td>
        <td class="num">${done ? `${doc.confidence}%` : ''}</td>
        <td class="act">${done && review ? `<button type="button" class="tbtn" data-approve="${doc.id}">Aprovar</button>` : ''}</td></tr>`;
    })
    .join('');
  return `<div class="docbar"><span>${client.docs.length} documentos recebidos pelo portal do cliente</span>
    <button type="button" class="tbtn is-primary" data-classify ${done || state.busy ? 'disabled' : ''}>${done ? 'Documentos classificados' : state.busy ? 'Classificando…' : 'Classificar com IA'}</button></div>
    <div class="grid-wrap"><table class="grid"><thead><tr><th class="n"></th>${head('documentos', 'file', 'Arquivo')}${head('documentos', 'received', 'Recebido')}<th>Tipo detectado</th><th>Conta sugerida</th><th class="num">Conf.</th><th></th></tr></thead><tbody>${body}</tbody></table></div>`;
};

const renderView = () => {
  const client = current();
  view.innerHTML = { lancamentos: entriesView, obrigacoes: obligationsView, documentos: docsView }[state.tab](client);
  tabs.forEach((tab) => {
    const active = tab.dataset.tab === state.tab;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
};

const renderInspector = () => {
  const client = current();
  const list = flagged(client);
  let detail = '<p class="muted">Selecione uma linha para ver os detalhes.</p>';
  if (state.selected?.startsWith('e:')) {
    const entry = client.entries.find((e) => `e:${e.id}` === state.selected);
    const finding = state.checked[client.id] && entry.flag && !entry.reviewed;
    detail = `<dl><dt>Data</dt><dd>${entry.date}/2026</dd><dt>Histórico</dt><dd>${entry.history}</dd><dt>Débito</dt><dd>${entry.debit}</dd><dt>Crédito</dt><dd>${entry.credit}</dd>
      <dt>Valor</dt><dd class="mono">R$ ${money(entry.value)}</dd><dt>Documento</dt><dd>${entry.doc || '<span class="bad">não vinculado</span>'}</dd></dl>
      ${finding ? `<div class="finding"><strong>Apontamento da IA · simulação</strong><p>${entry.flag}</p><button type="button" class="tbtn" data-review="${entry.id}">Marcar como revisado</button></div>` : ''}`;
  } else if (state.selected?.startsWith('o:')) {
    const item = client.obligations.find((o) => `o:${o.id}` === state.selected);
    detail = `<dl><dt>Obrigação</dt><dd>${item.name}</dd><dt>Vencimento</dt><dd>${item.due}/2026</dd><dt>Situação</dt><dd><span class="chip is-${item.status}">${item.status}</span></dd><dt>Responsável</dt><dd>${item.owner}</dd></dl>`;
  }
  const summary = state.checked[client.id]
    ? list.length
      ? `<div class="finding"><strong>${list.length} ${list.length === 1 ? 'apontamento' : 'apontamentos'} da IA</strong><p>Linhas marcadas com “!” na grade de lançamentos.</p></div>`
      : '<div class="ok-note"><strong>Conferência concluída</strong><p>Nenhum apontamento para esta competência.</p></div>'
    : '';
  inspector.innerHTML = `<h2>${client.name}</h2><p class="muted">${client.regime} · competência 09/2026</p>${summary}<h3>Detalhes</h3>${detail}`;
};

const renderStatus = () => {
  const client = current();
  const ai = state.checked[client.id] ? `IA: ${flagged(client).length} apontamento(s)` : 'IA: conferência não executada';
  status.innerHTML = `<span>Cliente: <strong>${client.name}</strong></span><span>${client.entries.length} lançamentos</span><span class="mono">Total R$ ${money(total(client.entries))}</span><span>${ai}</span>`;
};

const render = () => {
  renderTree();
  renderView();
  renderInspector();
  renderStatus();
};

root.addEventListener('click', (event) => {
  const target = event.target;
  const clientButton = target.closest('[data-client]');
  if (clientButton) {
    state.client = clientButton.dataset.client;
    state.selected = null;
    return render();
  }
  const tab = target.closest('[data-tab]');
  if (tab) {
    state.tab = tab.dataset.tab;
    state.selected = null;
    return render();
  }
  const sort = target.closest('[data-sort]');
  if (sort) {
    const rule = state.sort[state.tab];
    rule.dir = rule.key === sort.dataset.sort ? -rule.dir : 1;
    rule.key = sort.dataset.sort;
    return renderView();
  }
  const row = target.closest('[data-row]');
  if (row && !target.closest('button')) {
    state.selected = row.dataset.row;
    renderView();
    return renderInspector();
  }
  const deliver = target.closest('[data-deliver]');
  if (deliver) {
    current().obligations.find((o) => o.id === deliver.dataset.deliver).status = 'entregue';
    toast('Obrigação marcada como entregue. Exemplo ilustrativo.');
    return render();
  }
  const review = target.closest('[data-review]');
  if (review) {
    current().entries.find((e) => e.id === review.dataset.review).reviewed = true;
    toast('Apontamento marcado como revisado.');
    return render();
  }
  const approve = target.closest('[data-approve]');
  if (approve) {
    current().docs.find((d) => d.id === approve.dataset.approve).approved = true;
    toast('Classificação aprovada pelo contador.');
    return renderView();
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
        toast('Documentos classificados. Os de baixa confiança ficam para revisão humana.');
      },
      reduceMotion ? 0 : 900,
    );
    return;
  }
  if (target.closest('[data-check]')) {
    const id = state.client;
    status.querySelector('span:last-child').textContent = 'IA: conferindo lançamentos…';
    setTimeout(
      () => {
        state.checked[id] = true;
        state.tab = 'lancamentos';
        render();
        toast('Conferência concluída. Exemplo ilustrativo.');
      },
      reduceMotion ? 0 : 800,
    );
  }
});

tabs.forEach((tab, index) =>
  tab.addEventListener('keydown', (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    next.focus();
    next.click();
  }),
);

render();
