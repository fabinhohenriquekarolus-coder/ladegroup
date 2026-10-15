const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const money = (value) => currency.format(value);

export const toMinutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

export const toTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export const roundUp = (minutes, step = 5) => Math.ceil(minutes / step) * step;

export const serviceById = (services, id) => services.find((service) => service.id === id);

export const endOf = (item, services) => toMinutes(item.start) + serviceById(services, item.service).minutes;

export const statusAt = (item, services, now) => {
  const current = toMinutes(now);
  if (endOf(item, services) <= current) return 'concluido';
  if (toMinutes(item.start) <= current) return 'atendendo';
  return 'agendado';
};

const statusLabels = { concluido: 'Concluído', atendendo: 'Na cadeira', agendado: 'Agendado' };

export const statusLabel = (status) => statusLabels[status];

export const busyIntervals = (barber, items, services) =>
  [
    { start: toMinutes(barber.breakStart), end: toMinutes(barber.breakEnd) },
    ...items
      .filter((item) => item.barber === barber.id)
      .map((item) => ({ start: toMinutes(item.start), end: endOf(item, services) })),
  ].sort((a, b) => a.start - b.start);

export const nextSlot = (busy, minutes, from, close) => {
  const candidates = [roundUp(from), ...busy.map((slot) => slot.end).filter((end) => end > from)].sort((a, b) => a - b);
  for (const start of candidates) {
    const end = start + minutes;
    if (end > close) return null;
    if (!busy.some((slot) => start < slot.end && slot.start < end)) return start;
  }
  return null;
};

export const planQueue = ({ queue, barbers, appointments, services, now, closeTime }) => {
  const reserved = [];
  const close = toMinutes(closeTime);
  return queue.map((walkIn) => {
    const service = serviceById(services, walkIn.service);
    let best = null;
    barbers.forEach((barber) => {
      const busy = busyIntervals(barber, [...appointments, ...reserved], services);
      const start = nextSlot(busy, service.minutes, toMinutes(now), close);
      if (start !== null && (best === null || start < best.start)) best = { barber: barber.id, start };
    });
    if (best) reserved.push({ barber: best.barber, start: toTime(best.start), service: walkIn.service });
    return {
      ...walkIn,
      barber: best?.barber ?? null,
      start: best ? toTime(best.start) : null,
      wait: best ? best.start - toMinutes(now) : null,
    };
  });
};

export const waitLabel = (minutes) => {
  if (minutes === null) return 'Sem vaga hoje';
  if (minutes <= 0) return 'Atende agora';
  if (minutes < 60) return `Espera de ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `Espera de ${hours}h${rest ? String(rest).padStart(2, '0') : ''}`;
};

export const fitWalkIn = (planned, id) => {
  const walkIn = planned.find((item) => item.id === id);
  if (!walkIn?.barber) return null;
  return {
    id: `e-${walkIn.id}`,
    barber: walkIn.barber,
    start: walkIn.start,
    service: walkIn.service,
    client: walkIn.name,
    payment: 'pix',
    walkIn: true,
  };
};

export const earliestSlot = ({ barbers, appointments, services, now, closeTime }, minutes = 30) => {
  const close = toMinutes(closeTime);
  return barbers.reduce((best, barber) => {
    const start = nextSlot(busyIntervals(barber, appointments, services), minutes, toMinutes(now), close);
    if (start === null || (best && best.start <= start)) return best;
    return { barber: barber.id, start };
  }, null);
};

export const dayTotals = ({ barbers, appointments, products, services, now, productRate, clubPayout }) =>
  barbers.map((barber) => {
    const done = appointments.filter((item) => item.barber === barber.id && statusAt(item, services, now) === 'concluido');
    const paid = done.filter((item) => item.payment !== 'clube');
    const club = done.length - paid.length;
    const servicesTotal = paid.reduce((total, item) => total + serviceById(services, item.service).price, 0);
    const productsTotal = products.filter((item) => item.barber === barber.id).reduce((total, item) => total + item.price, 0);
    const commission = servicesTotal * barber.rate + club * clubPayout + productsTotal * productRate;
    return { barber: barber.id, done: done.length, paid: paid.length, club, servicesTotal, productsTotal, commission: Math.round(commission * 100) / 100 };
  });

export const cashSummary = (totals) => {
  const services = totals.reduce((sum, row) => sum + row.servicesTotal, 0);
  const products = totals.reduce((sum, row) => sum + row.productsTotal, 0);
  const done = totals.reduce((sum, row) => sum + row.done, 0);
  const paid = totals.reduce((sum, row) => sum + row.paid, 0);
  const commission = totals.reduce((sum, row) => sum + row.commission, 0);
  return { revenue: services + products, services, products, done, ticket: paid ? services / paid : 0, commission: Math.round(commission * 100) / 100 };
};

export const paymentsBreakdown = ({ appointments, products, services, now }) => {
  const totals = { pix: 0, cartao: 0, dinheiro: 0 };
  appointments
    .filter((item) => item.payment !== 'clube' && statusAt(item, services, now) === 'concluido')
    .forEach((item) => {
      totals[item.payment] += serviceById(services, item.service).price;
    });
  products.forEach((item) => {
    totals[item.payment] += item.price;
  });
  return totals;
};

const dayMs = 86400000;

const toUtc = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};

export const daysUntil = (from, to) => Math.round((toUtc(to) - toUtc(from)) / dayMs);

export const subscriptionStatus = (subscriber, date, warnDays = 5) => {
  const offset = daysUntil(date, subscriber.renewal);
  if (offset < 0) return { key: 'atrasado', offset, label: `Atrasado há ${-offset} ${offset === -1 ? 'dia' : 'dias'}` };
  if (offset === 0) return { key: 'vencendo', offset, label: 'Vence hoje' };
  if (offset <= warnDays) return { key: 'vencendo', offset, label: `Vence em ${offset} ${offset === 1 ? 'dia' : 'dias'}` };
  return { key: 'em-dia', offset, label: 'Em dia' };
};

export const filterSubscribers = (list, view, date) =>
  list
    .map((subscriber) => ({ ...subscriber, status: subscriptionStatus(subscriber, date) }))
    .filter((subscriber) => view === 'todos' || subscriber.status.key === view)
    .sort((a, b) => a.status.offset - b.status.offset || a.name.localeCompare(b.name));

export const clubSummary = (list, plans, date) => {
  const priceOf = (id) => plans.find((plan) => plan.id === id).price;
  const withStatus = list.map((subscriber) => ({ ...subscriber, status: subscriptionStatus(subscriber, date) }));
  const late = withStatus.filter((subscriber) => subscriber.status.key === 'atrasado');
  return {
    active: list.length,
    monthly: list.reduce((total, subscriber) => total + priceOf(subscriber.plan), 0),
    dueSoon: withStatus.filter((subscriber) => subscriber.status.key === 'vencendo').length,
    late: late.length,
    lateValue: late.reduce((total, subscriber) => total + priceOf(subscriber.plan), 0),
  };
};

export const initials = (name) =>
  name
    .replace(/\./g, '')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const addDays = (iso, amount) => new Date(toUtc(iso) + amount * dayMs).toISOString().slice(0, 10);

export const brDate = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

export const renewSubscriber = (subscriber, date, cycle = 30) => ({
  ...subscriber,
  renewal: addDays(subscriber.renewal < date ? date : subscriber.renewal, cycle),
  uses: 0,
});

export const listNames = (names) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}` : (names[0] ?? ''));

export const dayCounts = (items, services, now) => {
  const statuses = items.map((item) => statusAt(item, services, now));
  const count = (status) => statuses.filter((value) => value === status).length;
  return { total: items.length, done: count('concluido'), inChair: count('atendendo'), upcoming: count('agendado') };
};
