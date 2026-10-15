const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const money = (value) => currency.format(value);

const weekdayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const monthNames = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

const parts = (iso) => iso.split('-').map(Number);

const toUtc = (iso) => {
  const [year, month, day] = parts(iso);
  return Date.UTC(year, month - 1, day);
};

const dayMs = 86400000;

export const addDays = (iso, amount) => new Date(toUtc(iso) + amount * dayMs).toISOString().slice(0, 10);

export const daysBetween = (from, to) => Math.round((toUtc(to) - toUtc(from)) / dayMs);

export const weekday = (iso) => new Date(toUtc(iso)).getUTCDay();

export const dayTitle = (iso) => {
  const [, month, day] = parts(iso);
  return `${weekdayNames[weekday(iso)]}, ${day} de ${monthNames[month - 1]}`;
};

export const shortWeekday = (iso) => weekdayNames[weekday(iso)].slice(0, 3).toUpperCase();

export const dayOfMonth = (iso) => parts(iso)[2];

export const weekTitle = (days) => {
  const [, month] = parts(days[0]);
  return `${dayOfMonth(days[0])} a ${dayOfMonth(days[days.length - 1])} de ${monthNames[month - 1]}`;
};

export const brDate = (iso) => {
  const [year, month, day] = parts(iso);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
};

export const toMinutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

export const toTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export const serviceById = (services, id) => services.find((service) => service.id === id);

export const priceFor = (service, porte) => service.prices[porte] ?? null;

export const durationLabel = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours}h${String(rest).padStart(2, '0')}` : `${hours}h`;
};

export const endOf = (item, services) => toMinutes(item.start) + serviceById(services, item.service).minutes;

export const appointmentsOn = (items, date) =>
  items.filter((item) => item.date === date).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

export const isActive = (item) => item.status !== 'cancelado';

export const assignLanes = (items, services) => {
  const sorted = items
    .filter(isActive)
    .map((item) => ({ ...item, startMin: toMinutes(item.start), endMin: endOf(item, services) }))
    .sort((a, b) => a.startMin - b.startMin);
  const placed = [];
  let cluster = [];
  let clusterEnd = -Infinity;

  const flush = () => {
    const laneEnds = [];
    cluster.forEach((item) => {
      let lane = laneEnds.findIndex((end) => end <= item.startMin);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = item.endMin;
      item.lane = lane;
    });
    cluster.forEach((item) => {
      item.lanes = laneEnds.length;
    });
    placed.push(...cluster);
    cluster = [];
  };

  sorted.forEach((item) => {
    if (cluster.length && item.startMin >= clusterEnd) flush();
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, item.endMin);
  });
  if (cluster.length) flush();
  return placed;
};

export const maxConcurrent = (items, services) =>
  assignLanes(items, services).reduce((max, item) => Math.max(max, item.lanes), 0);

const statusMap = {
  concluido: { label: 'Concluído', tone: 'success' },
  confirmado: { label: 'Confirmado', tone: 'accent' },
  agendado: { label: 'Agendado', tone: 'neutral' },
  cancelado: { label: 'Cancelado', tone: 'danger' },
};

export const statusInfo = (status) => statusMap[status];

export const daySummary = (items) => {
  const active = items.filter(isActive);
  if (!active.length) return 'Nenhum atendimento';
  const done = active.filter((item) => item.status === 'concluido').length;
  const label = `${active.length} ${active.length === 1 ? 'atendimento' : 'atendimentos'}`;
  if (!done) return label;
  if (done === active.length) return `${label}, ${done === 1 ? 'concluído' : 'todos concluídos'}`;
  return `${label}, ${done} ${done === 1 ? 'concluído' : 'concluídos'}`;
};

export const upcomingCount = (items, date) =>
  items.filter((item) => item.date >= date && (item.status === 'confirmado' || item.status === 'agendado')).length;

export const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const daysSince = (client, date) => (client.lastVisit ? daysBetween(client.lastVisit, date) : null);

export const needsFollowUp = (client, date, limit = 30) => {
  const days = daysSince(client, date);
  return days !== null && days > limit;
};

const agoLabel = (days) => {
  if (days === 0) return 'hoje';
  if (days === 1) return 'ontem';
  return `há ${days} dias`;
};

export const visitsLabel = (client, date) => {
  if (!client.visits) return 'Ainda sem atendimento concluído';
  const count = `${client.visits} ${client.visits === 1 ? 'visita' : 'visitas'}`;
  return `${count}, última ${agoLabel(daysSince(client, date))}`;
};

const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

export const filterClients = (list, { term = '', view = 'todos' }, date) => {
  const query = normalize(term);
  return list
    .filter((client) => view !== 'acompanhamento' || needsFollowUp(client, date))
    .filter((client) => !query || normalize(client.name).includes(query))
    .sort((a, b) => b.total - a.total);
};

export const clientsLabel = (count) => `${count} ${count === 1 ? 'cliente' : 'clientes'}`;

export const periodRange = (period, date) => {
  if (period === '7') return { start: addDays(date, -6), end: date };
  if (period === '30') return { start: addDays(date, -29), end: date };
  return { start: `${date.slice(0, 8)}01`, end: date };
};

const within = (iso, range) => iso >= range.start && iso <= range.end;

const sum = (list, key) => list.reduce((total, item) => total + item[key], 0);

export const cashSummary = (days, outflows, range) => {
  const inPeriod = days.filter((day) => within(day.date, range));
  const income = sum(inPeriod, 'income');
  const spent = sum(
    outflows.filter((item) => within(item.date, range)),
    'amount',
  );
  const visits = sum(inPeriod, 'visits');
  return { income, spent, balance: income - spent, visits, ticket: visits ? income / visits : 0 };
};

export const dailySeries = (days, outflows, range) => {
  const series = [];
  for (let date = range.start; date <= range.end; date = addDays(date, 1)) {
    const day = days.find((item) => item.date === date);
    const spent = sum(
      outflows.filter((item) => item.date === date),
      'amount',
    );
    series.push({ date, income: day?.income ?? 0, spent });
  }
  return series;
};

export const peakDay = (series) =>
  series.reduce((best, day) => (day.income > (best?.income ?? -1) ? day : best), null);

export const recentMovements = (items, outflows, services, people, date, limit = 8) => {
  const entries = items
    .filter((item) => item.status === 'concluido' && item.date <= date)
    .map((item) => {
      const service = serviceById(services, item.service);
      return {
        date: item.date,
        time: toTime(endOf(item, services)),
        label: service.name,
        detail: people.find((person) => person.id === item.client)?.name ?? '',
        amount: priceFor(service, item.porte),
        kind: 'entrada',
      };
    });
  const exits = outflows
    .filter((item) => item.date <= date)
    .map((item) => ({ date: item.date, time: '23:59', label: item.label, detail: item.category, amount: item.amount, kind: 'saida' }));
  return [...entries, ...exits]
    .sort((a, b) => (a.date === b.date ? b.time.localeCompare(a.time) : b.date.localeCompare(a.date)))
    .slice(0, limit);
};

export const groupByDate = (moves) =>
  moves.reduce((groups, move) => {
    const last = groups[groups.length - 1];
    if (last && last.date === move.date) last.items.push(move);
    else groups.push({ date: move.date, items: [move] });
    return groups;
  }, []);

const percent = (part, total) => Math.round((part / total) * 100);

export const ladinhoAnswer = (id, data) => {
  if (id === 'semana') {
    const monday = addDays(data.today, weekday(data.today) === 0 ? -6 : 1 - weekday(data.today));
    const week = cashSummary(data.cashDays, [], { start: monday, end: data.today });
    const ahead = upcomingCount(data.appointments, data.today);
    return `De segunda até agora entraram ${money(week.income)} em ${week.visits} atendimentos. Ainda tem ${ahead} agendamentos marcados até sábado.`;
  }
  if (id === 'gasto') {
    const range = periodRange('mes', data.today);
    const totals = data.expenses
      .filter((item) => within(item.date, range))
      .reduce((map, item) => map.set(item.category, (map.get(item.category) ?? 0) + item.amount), new Map());
    const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]);
    const all = ranked.reduce((total, [, amount]) => total + amount, 0);
    const [first, second] = ranked;
    return `Neste mês, a maior saída foi com ${first[0].toLowerCase()}: ${money(first[1])}, ${percent(first[1], all)}% de tudo que saiu. Em segundo lugar: ${second[0].toLowerCase()}, com ${money(second[1])}.`;
  }
  if (id === 'servico') {
    const byRevenue = [...data.monthByService].sort((a, b) => b.revenue - a.revenue)[0];
    const byCount = [...data.monthByService].sort((a, b) => b.count - a.count)[0];
    const name = (item) => serviceById(data.services, item.service).name.toLowerCase();
    if (byRevenue.service === byCount.service) {
      return `A ${name(byRevenue)} lidera em tudo: ${byRevenue.count} atendimentos e ${money(byRevenue.revenue)} neste mês.`;
    }
    return `Em quantidade, a ${name(byCount)} lidera com ${byCount.count} atendimentos. Em dinheiro, quem rende mais é a ${name(byRevenue)}: ${money(byRevenue.revenue)} neste mês.`;
  }
  const [first, second] = [...data.monthByHour].sort((a, b) => b.count - a.count);
  return `O pico é às ${first.hour}h, com ${first.count} atendimentos neste mês. Depois vem o horário das ${second.hour}h, com ${second.count}.`;
};
